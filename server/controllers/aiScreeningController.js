const { GoogleGenerativeAI } = require('@google/generative-ai');
const Candidate = require('../models/candidateModel');
const Job = require('../models/jobModel');
const ScreeningResult = require('../models/screeningModel');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: build a concise but rich text representation of a candidate profile
function formatCandidateProfile(candidate, index) {
    const skills = (candidate.skills || [])
        .map((s) => `${s.name} (${s.level}, ${s.yearsOfExperience}yr)`)
        .join(', ') || 'N/A';

    const experience = (candidate.experience || [])
        .map((e) => `${e.role} at ${e.company} (${e.startDate} – ${e.endDate || 'Present'}): ${e.description || ''}`)
        .join(' | ') || 'N/A';

    const education = (candidate.education || [])
        .map((ed) => `${ed.degree} in ${ed.fieldOfStudy || 'N/A'} from ${ed.institution}`)
        .join(', ') || 'N/A';

    const certifications = (candidate.certifications || [])
        .map((c) => `${c.name} by ${c.issuer}`)
        .join(', ') || 'None';

    const projects = (candidate.projects || [])
        .map((p) => `${p.name}: ${p.description || ''} [${(p.technologies || []).join(', ')}]`)
        .join(' | ') || 'None';

    const availability = candidate.availability
        ? `${candidate.availability.status} (${candidate.availability.type || 'N/A'})`
        : 'Unknown';

    return `
--- CANDIDATE ${index + 1} ---
ID: ${candidate._id}
Name: ${candidate.firstName} ${candidate.lastName}
Headline: ${candidate.headline}
Location: ${candidate.location}
Bio: ${candidate.bio || 'N/A'}
Skills: ${skills}
Experience: ${experience}
Education: ${education}
Certifications: ${certifications}
Projects: ${projects}
Availability: ${availability}
`.trim();
}

// Helper to count tokens in a prompt without sending to API
async function countPromptTokens(model, prompt) {
    try {
        const countResponse = await model.countTokens(prompt);
        return {
            totalTokens: countResponse.totalTokens,
            billableCharacters: countResponse.totalBillableCharacters || 0,
            promptTokensDetails: countResponse.promptTokensDetails || []
        };
    } catch (error) {
        console.warn('⚠️ Token counting failed:', error.message);
        return null;
    }
}

// Helper: Generate content with retry logic
async function generateWithRetry(model, prompt, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            lastError = error;

            // Check if it's a retryable error
            const isRetryable = error.message.includes('503') ||
                error.message.includes('429') ||
                error.message.includes('500') ||
                error.message.includes('502') ||
                error.message.includes('504');

            if (!isRetryable || attempt === maxRetries) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

// @desc    Run AI screening for a job using Gemini
// @route   POST /api/ai/screen/:jobId
// @access  Private
const runAIScreening = async (req, res) => {
    const startTime = Date.now(); // Track response time
    const { jobId } = req.params;
    const { topN = 10, saveResults = false } = req.body;

    // Verify job belongs to recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: req.user._id });
    if (!job) {
        return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    // Fetch all candidates for this job
    const candidates = await Candidate.find({ job: jobId });
    if (!candidates || candidates.length === 0) {
        return res.status(400).json({ message: 'No candidates found for this job' });
    }

    // Build the prompt
    const jobDescription = `
Job Title: ${job.title}
Department: ${job.department}
Location: ${job.location}
Required Experience: ${job.experience}
Required Skills: ${(job.skillsNeeded || []).join(', ')}
Job Description: ${job.description}
Salary Range: ${job.salaryRange ? `$${job.salaryRange.min} – $${job.salaryRange.max}` : 'Not specified'}
`.trim();

    const candidateProfiles = candidates
        .map((c, i) => formatCandidateProfile(c, i))
        .join('\n\n');

    // Estimate token count (rough approximation)
    const estimatedTokens = (jobDescription.length + candidateProfiles.length + 2000) / 4;
    console.log(`\n📊 PRE-SCREENING ESTIMATE:`);
    console.log(`   Estimated prompt tokens: ~${Math.round(estimatedTokens)}`);
    console.log(`   Candidates to analyze: ${candidates.length}`);

    if (estimatedTokens > 8000) {
        console.warn('⚠️ Prompt may exceed model limits. Consider reducing candidates or using batch processing.');
    }

    const prompt = `
You are an expert AI recruiter assistant for Umurava, an AI-powered talent screening platform.
Your task is to analyze ALL candidates listed below and produce a ranked shortlist of the TOP ${topN} best matches for the given job.

## JOB REQUIREMENTS
${jobDescription}

## CANDIDATE PROFILES
${candidateProfiles}

## INSTRUCTIONS
Evaluate each candidate against the job requirements using a weighted scoring model:
- Skills match: 25%
- Work experience relevance & seniority: 30%
- Education & certifications: 20%
- Project portfolio relevance: 15%
- Availability & location fit: 10%

For each shortlisted candidate, produce a JSON object with these exact fields:
{
  "rank": <integer starting at 1>,
  "candidateId": "<the exact _id string from the profile>",
  "candidateName": "<First Last>",
  "matchScore": <integer 0-100>,
  "recommendation": "<one of: Highly Recommended | Recommended | Consider | Borderline>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "reasoning": "<2-3 sentence natural language explanation of why this candidate was ranked here>"
}

Return ONLY a valid JSON object with this structure:
{
  "jobTitle": "${job.title}",
  "totalCandidatesAnalyzed": ${candidates.length},
  "shortlistCount": <number of candidates in the shortlist, max ${topN}>,
  "screeningDate": "<ISO date>",
  "shortlist": [ ...array of candidate result objects... ]
}

Do NOT include any text before or after the JSON. The response must be parseable by JSON.parse().
`.trim();

    let result;
    let tokenInfo = null;
    
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        // Count tokens BEFORE sending to API
        console.log('\n🔢 COUNTING PROMPT TOKENS...');
        tokenInfo = await countPromptTokens(model, prompt);
        
        if (tokenInfo) {
            const promptInputCost = (tokenInfo.totalTokens / 1_000_000) * 0.075;
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    PROMPT TOKEN ANALYSIS                     ║
╠══════════════════════════════════════════════════════════════╣
║ Total prompt tokens:     ${tokenInfo.totalTokens.toString().padEnd(38)}║
║ Billable characters:     ${tokenInfo.billableCharacters.toString().padEnd(38)}║
║ Estimated cost (input):  $${promptInputCost.toFixed(6).padEnd(38)}║
╚══════════════════════════════════════════════════════════════╝
            `);
            
            // Check if token count exceeds reasonable limits (Gemini 1.5 Flash supports 1M tokens)
            if (tokenInfo.totalTokens > 1000000) {
                return res.status(400).json({
                    success: false,
                    message: `Prompt too large: ${tokenInfo.totalTokens} tokens exceeds 1M limit. Please reduce number of candidates.`,
                    tokenCount: tokenInfo.totalTokens,
                    candidateCount: candidates.length
                });
            }
            
            // Warn if prompt is large but still within limits
            if (tokenInfo.totalTokens > 500000) {
                console.warn(`⚠️ Large prompt detected (${tokenInfo.totalTokens} tokens). Consider reducing candidates for faster processing.`);
            }
        }
        
        // Send to AI with retry logic
        console.log('🤖 Sending to Gemini AI...');
        result = await generateWithRetry(model, prompt);
        
        // Extract and display token usage from the response with CORRECT calculation
        const usageMetadata = result.response.usageMetadata;
        
        if (usageMetadata) {
            // Extract token counts with fallbacks for different API response formats
            const inputTokens = usageMetadata.promptTokenCount || usageMetadata.prompt_tokens || 0;
            const outputTokens = usageMetadata.candidatesTokenCount || usageMetadata.completion_tokens || 0;
            
            // FIXED: Calculate total tokens manually by adding input + output
            // The API's totalTokenCount sometimes includes extra metadata tokens
            const correctTotalTokens = inputTokens + outputTokens;
            
            // Gemini 1.5 Flash approximate pricing (as of 2025)
            const INPUT_COST_PER_1M = 0.075;   // $0.075 per 1M input tokens
            const OUTPUT_COST_PER_1M = 0.30;   // $0.30 per 1M output tokens
            
            const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_1M;
            const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_1M;
            const totalCost = inputCost + outputCost;
            
            // Calculate response time
            const responseTime = (Date.now() - startTime) / 1000;
            
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║              ACTUAL TOKEN USAGE & COST BREAKDOWN             ║
╠══════════════════════════════════════════════════════════════╣
║ INPUT TOKENS:          ${inputTokens.toString().padEnd(38)}║
║ OUTPUT TOKENS:         ${outputTokens.toString().padEnd(38)}║
║ TOTAL TOKENS:          ${correctTotalTokens.toString().padEnd(38)}║
╠══════════════════════════════════════════════════════════════╣
║ Input cost:            $${inputCost.toFixed(6).padEnd(38)}║
║ Output cost:           $${outputCost.toFixed(6).padEnd(38)}║
║ TOTAL COST:            $${totalCost.toFixed(6).padEnd(38)}║
╠══════════════════════════════════════════════════════════════╣
║ Cost per candidate:    $${(totalCost / candidates.length).toFixed(6).padEnd(38)}║
║ Response time:         ${responseTime.toFixed(2)}s${' '.repeat(35 - responseTime.toFixed(2).length - 1)}║
╚══════════════════════════════════════════════════════════════╝
            `);
            
            // NEW: Display token efficiency metrics
            const tokensPerCandidateInput = (inputTokens / candidates.length).toFixed(1);
            const tokensPerCandidateOutput = (outputTokens / candidates.length).toFixed(1);
            const outputInputRatio = ((outputTokens / inputTokens) * 100).toFixed(1);
            
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   TOKEN EFFICIENCY METRICS                   ║
╠══════════════════════════════════════════════════════════════╣
║ Tokens per candidate (input):  ${tokensPerCandidateInput.padEnd(38)}║
║ Tokens per candidate (output): ${tokensPerCandidateOutput.padEnd(38)}║
║ Output/Input ratio:            ${outputInputRatio}%${' '.repeat(38 - outputInputRatio.length - 1)}║
╚══════════════════════════════════════════════════════════════╝
            `);
            
            // Save token usage to response headers for frontend access
            res.setHeader('X-Token-Usage-Input', inputTokens);
            res.setHeader('X-Token-Usage-Output', outputTokens);
            res.setHeader('X-Token-Usage-Total', correctTotalTokens);
            res.setHeader('X-Token-Cost', totalCost.toFixed(6));
            res.setHeader('X-Response-Time-Seconds', responseTime.toFixed(2));
        } else {
            console.warn('⚠️ No usage metadata returned from Gemini API');
        }
        
    } catch (apiError) {
        console.error('Gemini API Error:', apiError);

        // Provide user-friendly error messages
        if (apiError.message.includes('503')) {
            return res.status(503).json({
                success: false,
                message: 'The AI service is currently experiencing high demand. Please try again in a few moments.',
                retryAfter: '5 seconds'
            });
        }

        if (apiError.message.includes('429')) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded. Please wait before trying again.'
            });
        }

        if (apiError.message.includes('context length') || apiError.message.includes('token')) {
            return res.status(400).json({
                success: false,
                message: 'Too many candidates to process at once. Please reduce the number of candidates or contact support for batch processing.'
            });
        }

        return res.status(503).json({
            success: false,
            message: 'The AI service is currently unavailable. Please wait a moment and try again.',
            error: apiError.message
        });
    }

    const rawText = result.response.text();
    console.log('📝 Raw AI response length:', rawText.length, 'characters');

    // Strip markdown fences if present
    const jsonText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    let screeningData;
    try {
        screeningData = JSON.parse(jsonText);
    } catch (parseErr) {
        console.error('Gemini JSON parse error:', parseErr.message);
        console.error('Raw response preview:', rawText.substring(0, 500));
        return res.status(500).json({
            success: false,
            message: 'AI returned an invalid response. Please try again.',
            rawPreview: rawText.substring(0, 300),
        });
    }

    // Validate the response structure
    if (!screeningData.shortlist || !Array.isArray(screeningData.shortlist)) {
        console.error('Invalid response structure:', screeningData);
        return res.status(500).json({
            success: false,
            message: 'AI returned an unexpected response structure. Please try again.'
        });
    }

    // Display screening summary
    const shortlistCount = screeningData.shortlistCount || screeningData.shortlist.length;
    const selectionRate = ((shortlistCount / candidates.length) * 100).toFixed(1);
    
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    SCREENING SUMMARY                         ║
╠══════════════════════════════════════════════════════════════╣
║ Candidates analyzed:    ${candidates.length.toString().padEnd(38)}║
║ Shortlisted:           ${shortlistCount.toString().padEnd(38)}║
║ Selection rate:        ${selectionRate}%${' '.repeat(38 - selectionRate.length - 1)}║
╚══════════════════════════════════════════════════════════════╝
    `);

    // Optionally persist results to DB
    if (saveResults && screeningData.shortlist) {
        const statusMap = {
            'Highly Recommended': 'passed',
            'Recommended': 'passed',
            'Consider': 'review',
            'Borderline': 'review',
        };

        const shortListItems = screeningData.shortlist.map(item => ({
            rank: item.rank,
            candidate: item.candidateId,
            candidateName: item.candidateName,
            matchScore: item.matchScore,
            recommendation: item.recommendation,
            strengths: item.strengths || [],
            gaps: item.gaps || [],
            reasoning: item.reasoning,
            status: statusMap[item.recommendation] || 'review'
        }));

        const existingResult = await ScreeningResult.findOne({ job: jobId });

        if (existingResult) {
            existingResult.jobTitle = screeningData.jobTitle;
            existingResult.totalCandidatesAnalyzed = screeningData.totalCandidatesAnalyzed;
            existingResult.shortlistCount = screeningData.shortlistCount;
            existingResult.shortlist = shortListItems;
            await existingResult.save();
        } else {
            const newResult = new ScreeningResult({
                job: jobId,
                jobTitle: screeningData.jobTitle,
                totalCandidatesAnalyzed: screeningData.totalCandidatesAnalyzed,
                shortlistCount: screeningData.shortlistCount,
                shortlist: shortListItems
            });
            await newResult.save();
        }
        console.log(`💾 Saved screening results for job ${jobId} to database`);
    }

    return res.json({
        success: true,
        data: screeningData,
    });
};

// @desc    Get saved screening results for a job
// @route   GET /api/ai/screen/:jobId/results
// @access  Private
const getJobScreeningResults = async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, recruiter: req.user._id });
    if (!job) {
        return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    const result = await ScreeningResult.findOne({ job: jobId })
        .populate('shortlist.candidate', 'firstName lastName email headline location skills');

    return res.json(result ? [result] : []);
};

module.exports = { runAIScreening, getJobScreeningResults };