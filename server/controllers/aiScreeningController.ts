import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Candidate from '../models/candidateModel';
import Job from '../models/jobModel';
import ScreeningResult from '../models/screeningModel';
import { AuthRequest } from '../middleware/authMiddleware';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define model fallback order (prioritizing fastest/most capable first)
const MODEL_FALLBACK_ORDER = [
    'gemini-2.5-flash',        // Latest fast model (working for you)
    'gemini-2.0-flash',        // Stable fallback
    'gemini-1.5-flash',        // Older stable model
    'gemini-3.0-flash-preview', // Preview model (may have limits)
    'gemini-pro'                // Last resort
];

// Helper: build a concise but rich text representation of a candidate profile
function formatCandidateProfile(candidate: any, index: number) {
    const skills = (candidate.skills || [])
        .map((s: any) => `${s.name} (${s.level}, ${s.yearsOfExperience}yr)`)
        .join(', ') || 'N/A';

    const experience = (candidate.experience || [])
        .map((e: any) => `${e.role} at ${e.company} (${e.startDate} – ${e.endDate || 'Present'}): ${e.description || ''}`)
        .join(' | ') || 'N/A';

    const education = (candidate.education || [])
        .map((ed: any) => `${ed.degree} in ${ed.fieldOfStudy || 'N/A'} from ${ed.institution}`)
        .join(', ') || 'N/A';

    const certifications = (candidate.certifications || [])
        .map((c: any) => `${c.name} by ${c.issuer}`)
        .join(', ') || 'None';

    const projects = (candidate.projects || [])
        .map((p: any) => `${p.name}: ${p.description || ''} [${(p.technologies || []).join(', ')}]`)
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
async function countPromptTokens(model: any, prompt: string) {
    try {
        const countResponse = await model.countTokens(prompt);
        return {
            totalTokens: countResponse.totalTokens,
            billableCharacters: countResponse.totalBillableCharacters || 0,
            promptTokensDetails: countResponse.promptTokensDetails || []
        };
    } catch (error: any) {
        console.warn('⚠️ Token counting failed:', error.message);
        return null;
    }
}

// Helper: Generate content with retry logic
async function generateWithRetry(model: any, prompt: string, maxRetries = 3) {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error: any) {
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

// NEW: Helper to get a working model with fallback support
async function getWorkingModel(prompt: string, candidateCount: number) {
    let lastError: any = null;

    for (const modelName of MODEL_FALLBACK_ORDER) {
        try {
            console.log(`🔄 Attempting to use model: ${modelName}...`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 4000,
                    topP: 0.95,
                    topK: 40,
                }
            });

            // Test the model with a simple count tokens or generate request
            try {
                await model.countTokens('test');
            } catch (testError: any) {
                if (testError.message.includes('404') || testError.message.includes('not found')) {
                    console.log(`   Model ${modelName} not available, trying next...`);
                    continue;
                }
            }

            console.log(`✅ Successfully connected to model: ${modelName}`);
            return { model, modelName };

        } catch (error: any) {
            lastError = error;
            console.log(`❌ Model ${modelName} failed: ${error.message}`);
            continue;
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

// NEW: Helper to extract token usage safely
function extractTokenUsage(usageMetadata: any, modelName: string) {
    if (!usageMetadata) {
        console.warn(`⚠️ No usage metadata returned from ${modelName}`);
        return null;
    }

    const inputTokens = usageMetadata.promptTokenCount ||
        usageMetadata.prompt_tokens ||
        usageMetadata.inputTokenCount || 0;

    const outputTokens = usageMetadata.candidatesTokenCount ||
        usageMetadata.completion_tokens ||
        usageMetadata.outputTokenCount || 0;

    let totalTokens = usageMetadata.totalTokenCount ||
        usageMetadata.total_tokens ||
        (inputTokens + outputTokens);

    if (totalTokens !== inputTokens + outputTokens) {
        console.log(`   Correcting total tokens from ${totalTokens} to ${inputTokens + outputTokens}`);
        totalTokens = inputTokens + outputTokens;
    }

    return { inputTokens, outputTokens, totalTokens };
}

// @desc    Run AI screening for a job using Gemini
// @route   POST /api/ai/screen/:jobId
// @access  Private
const runAIScreening = async (req: AuthRequest, res: Response) => {
    const startTime = Date.now(); // Track response time
    const { jobId } = req.params;
    const { topN = 10, saveResults = false } = req.body;

    // Verify job belongs to recruiter
    const job: any = await Job.findOne({ _id: jobId, recruiter: req.user?._id });
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

    // Estimate token count
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

    let result: any;
    let usedModel: string | null = null;
    let tokenInfo: any = null;

    try {
        const { model, modelName } = await getWorkingModel(prompt, candidates.length);
        usedModel = modelName;

        console.log('\n🔢 COUNTING PROMPT TOKENS...');
        try {
            tokenInfo = await countPromptTokens(model, prompt);

            if (tokenInfo) {
                const promptInputCost = (tokenInfo.totalTokens / 1_000_000) * 0.075;
                console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    PROMPT TOKEN ANALYSIS                     ║
╠══════════════════════════════════════════════════════════════╣
║ Model used:          ${usedModel!.padEnd(38)}║
║ Total prompt tokens: ${tokenInfo.totalTokens.toString().padEnd(38)}║
║ Billable characters: ${tokenInfo.billableCharacters.toString().padEnd(38)}║
║ Estimated cost:      $${promptInputCost.toFixed(6).padEnd(38)}║
╚══════════════════════════════════════════════════════════════╝
                `);

                if (tokenInfo.totalTokens > 1000000) {
                    return res.status(400).json({
                        success: false,
                        message: `Prompt too large: ${tokenInfo.totalTokens} tokens exceeds 1M limit. Please reduce number of candidates.`,
                        tokenCount: tokenInfo.totalTokens,
                        candidateCount: candidates.length
                    });
                }

                if (tokenInfo.totalTokens > 500000) {
                    console.warn(`⚠️ Large prompt detected (${tokenInfo.totalTokens} tokens). Consider reducing candidates for faster processing.`);
                }
            }
        } catch (countError) {
            console.log('ℹ️ Token counting skipped (not supported by this model)');
        }

        console.log(`🤖 Sending to Gemini AI (${usedModel})...`);
        result = await generateWithRetry(model, prompt);

        const usageMetadata = result.response.usageMetadata;

        if (usageMetadata) {
            const tokenData = extractTokenUsage(usageMetadata, usedModel!);

            if (tokenData) {
                const { inputTokens, outputTokens, totalTokens } = tokenData;

                let INPUT_COST_PER_1M = 0.075;
                let OUTPUT_COST_PER_1M = 0.30;

                if (usedModel!.includes('pro')) {
                    INPUT_COST_PER_1M = 0.50;
                    OUTPUT_COST_PER_1M = 1.50;
                } else if (usedModel!.includes('preview')) {
                    INPUT_COST_PER_1M = 0.10;
                    OUTPUT_COST_PER_1M = 0.40;
                }

                const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_1M;
                const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_1M;
                const totalCost = inputCost + outputCost;

                const responseTime = (Date.now() - startTime) / 1000;

                console.log(`
╔══════════════════════════════════════════════════════════════╗
║              ACTUAL TOKEN USAGE & COST BREAKDOWN             ║
╠══════════════════════════════════════════════════════════════╣
║ Model used:          ${usedModel!.padEnd(38)}║
║ INPUT TOKENS:        ${inputTokens.toString().padEnd(38)}║
║ OUTPUT TOKENS:       ${outputTokens.toString().padEnd(38)}║
║ TOTAL TOKENS:        ${totalTokens.toString().padEnd(38)}║
╠══════════════════════════════════════════════════════════════╣
║ Input cost:          $${inputCost.toFixed(6).padEnd(38)}║
║ Output cost:         $${outputCost.toFixed(6).padEnd(38)}║
║ TOTAL COST:          $${totalCost.toFixed(6).padEnd(38)}║
╠══════════════════════════════════════════════════════════════╣
║ Cost per candidate:  $${(totalCost / candidates.length).toFixed(6).padEnd(38)}║
║ Response time:       ${responseTime.toFixed(2)}s${' '.repeat(35 - responseTime.toFixed(2).length - 1)}║
╚══════════════════════════════════════════════════════════════╝
                `);

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

                res.setHeader('X-Model-Used', usedModel!);
                res.setHeader('X-Token-Usage-Input', inputTokens);
                res.setHeader('X-Token-Usage-Output', outputTokens);
                res.setHeader('X-Token-Usage-Total', totalTokens);
                res.setHeader('X-Token-Cost', totalCost.toFixed(6));
                res.setHeader('X-Response-Time-Seconds', responseTime.toFixed(2));
            }
        }

    } catch (apiError: any) {
        console.error('Gemini API Error:', apiError);

        if (apiError.message.includes('All Gemini models failed')) {
            return res.status(503).json({
                success: false,
                message: 'All AI models are currently unavailable. Please try again later.',
                error: 'No available AI models'
            });
        }

        if (apiError.message.includes('503')) {
            return res.status(503).json({
                success: false,
                message: 'Service high demand. Try again in a few moments.'
            });
        }

        return res.status(503).json({
            success: false,
            message: 'AI service unavailable.',
            error: apiError.message
        });
    }

    const rawText = result.response.text();

    const jsonText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    let screeningData: any;
    try {
        screeningData = JSON.parse(jsonText);
    } catch (parseErr: any) {
        return res.status(500).json({
            success: false,
            message: 'AI invalid response.',
        });
    }

    const shortlistCount = screeningData.shortlistCount || screeningData.shortlist.length;
    const selectionRate = ((shortlistCount / candidates.length) * 100).toFixed(1);

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    SCREENING SUMMARY                         ║
╠══════════════════════════════════════════════════════════════╣
║ Model used:          ${usedModel!.padEnd(38)}║
║ Candidates analyzed: ${candidates.length.toString().padEnd(38)}║
║ Shortlisted:         ${shortlistCount.toString().padEnd(38)}║
║ Selection rate:      ${selectionRate}%${' '.repeat(38 - selectionRate.length - 1)}║
╚══════════════════════════════════════════════════════════════╝
    `);

    if (saveResults && screeningData.shortlist) {
        const statusMap: any = {
            'Highly Recommended': 'passed',
            'Recommended': 'passed',
            'Consider': 'review',
            'Borderline': 'review',
        };

        const shortListItems = screeningData.shortlist.map((item: any) => ({
            rank: item.rank,
            candidate: item.candidateId,
            candidateName: item.candidateName,
            matchScore: item.matchScore,
            recommendation: item.recommendation,
            strengths: item.strengths || [],
            gaps: item.gaps || [],
            reasoning: item.reasoning,
            status: statusMap[item.recommendation] || 'review',
            modelUsed: usedModel
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
                shortlist: shortListItems,
            });
            await newResult.save();
        }
        console.log(`💾 Saved results for job ${jobId} to database (using ${usedModel})`);
    }

    return res.json({
        success: true,
        data: screeningData,
    });
};

const getJobScreeningResults = async (req: AuthRequest, res: Response) => {
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, recruiter: req.user?._id });
    if (!job) {
        return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    const result = await ScreeningResult.findOne({ job: jobId })
        .populate('shortlist.candidate', 'firstName lastName email headline location skills');

    return res.json(result ? [result] : []);
};

export { runAIScreening, getJobScreeningResults };
