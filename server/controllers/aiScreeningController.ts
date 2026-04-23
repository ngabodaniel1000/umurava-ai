import { GoogleGenerativeAI } from '@google/generative-ai';
import Candidate from '../models/candidateModel';
import Job from '../models/jobModel';
import ScreeningResult from '../models/screeningModel';
import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import mammoth from 'mammoth';



// Simplified AuthRequest - extends Request and adds user property
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
    params: {
        jobId?: string;
        [key: string]: string | undefined;
    };
    body: any;
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define available models with fallback priority
const AVAILABLE_MODELS = [
    'gemini-3.1-flash-lite-preview',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-robotics-er-1.6-preview'
] as const;

type ModelName = typeof AVAILABLE_MODELS[number];

// Interfaces for type safety
interface CandidateProfile {
    _id: string;
    firstName: string;
    lastName: string;
    headline?: string;
    location?: string;
    bio?: string;
    skills?: Array<{ name: string; level: string; yearsOfExperience: number }>;
    experience?: Array<{ role: string; company: string; startDate: string; endDate?: string; description?: string }>;
    education?: Array<{ degree: string; fieldOfStudy?: string; institution: string }>;
    certifications?: Array<{ name: string; issuer: string }>;
    projects?: Array<{ name: string; description?: string; technologies?: string[] }>;
    availability?: { status: string; type?: string };
}

interface ScreeningShortlistItem {
    rank: number;
    candidateId: string;
    candidateName: string;
    matchScore: number;
    recommendation: 'Highly Recommended' | 'Recommended' | 'Consider' | 'Borderline';
    strengths: string[];
    gaps: string[];
    reasoning: string;
}

interface ScreeningResponse {
    jobTitle: string;
    totalCandidatesAnalyzed: number;
    shortlistCount: number;
    screeningDate: string;
    shortlist: ScreeningShortlistItem[];
}

interface TokenInfo {
    totalTokens: number;
    billableCharacters?: number;
    promptTokensDetails?: any[];
}

interface ScreeningResultDocument {
    job: string;
    jobTitle: string;
    totalCandidatesAnalyzed: number;
    shortlistCount: number;
    shortlist: Array<{
        rank: number;
        candidate: string;
        candidateName: string;
        matchScore: number;
        recommendation: string;
        strengths: string[];
        gaps: string[];
        reasoning: string;
        status: string;
    }>;
    save(): Promise<any>;
}

// Helper: build a concise but rich text representation of a candidate profile
function formatCandidateProfile(candidate: CandidateProfile, index: number): string {
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
Headline: ${candidate.headline || 'N/A'}
Location: ${candidate.location || 'N/A'}
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
async function countPromptTokens(model: any, prompt: string): Promise<TokenInfo | null> {
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

// Helper: Generate content with retry logic and model fallback
async function generateWithFallback(prompt: string | any[], maxRetriesPerModel: number = 2): Promise<any> {
    let lastError: Error | null = null;

    for (const modelName of AVAILABLE_MODELS) {
        console.log(`🔄 Attempting with model: ${modelName}`);

        for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                console.log(`✅ Success with model: ${modelName} on attempt ${attempt}`);
                return result;
            } catch (error: any) {
                lastError = error;
                console.warn(`❌ Model ${modelName} attempt ${attempt} failed:`, error.message);

                const isRetryable = error.message?.includes('503') ||
                    error.message?.includes('429') ||
                    error.message?.includes('500') ||
                    error.message?.includes('502') ||
                    error.message?.includes('504') ||
                    error.message?.includes('timeout') ||
                    error.message?.includes('rate limit');

                if (isRetryable && attempt < maxRetriesPerModel) {
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    console.log(`Retrying ${modelName} in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.log(`Moving to next model after ${attempt} attempts with ${modelName}`);
                    break;
                }
            }
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}

// Helper to extract JSON from AI response
function extractJSONFromResponse(rawText: string): any {
    const jsonText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    return JSON.parse(jsonText);
}

// @desc    Run AI screening for a job with Gemini using model fallback
// @route   POST /api/ai/screen/:jobId
// @access  Private
export const runAIScreening = async (req: AuthRequest, res: Response) => {
    const startTime = Date.now();
    const { jobId } = req.params;
    const { topN = 10, saveResults = false } = req.body;

    try {
        // Verify job belongs to recruiter
        const job = await Job.findOne({ _id: jobId, recruiter: req.user?._id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or not authorized' });
        }

        // Fetch all candidates for this job
        const candidates = await Candidate.find({ job: jobId }) as CandidateProfile[];
        if (!candidates || candidates.length === 0) {
            return res.status(400).json({ message: 'No candidates found for this job' });
        }

        // Build the prompt
        const jobDescription = `
Job Title: ${job.title}
Department: ${job.department || 'N/A'}
Location: ${job.location}
Required Experience: ${job.experience}
Required Skills: ${(job.skillsNeeded || []).join(', ')}
Job Description: ${job.description}
Salary Range: ${job.salaryRange ? `$${job.salaryRange.min} – $${job.salaryRange.max}` : 'Not specified'}
`.trim();

        const candidateProfiles = candidates
            .map((c, i) => formatCandidateProfile(c, i))
            .join('\n\n');

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

        try {
            console.log('🤖 Starting AI screening with model fallback support...');
            result = await generateWithFallback(prompt, 2);
        } catch (apiError: any) {
            console.error('All Gemini models failed:', apiError);

            if (apiError.message.includes('503') || apiError.message.includes('unavailable')) {
                return res.status(503).json({
                    success: false,
                    message: 'The AI service is currently experiencing high demand. Please try again in a few moments.',
                    retryAfter: '5 seconds',
                    modelsAttempted: AVAILABLE_MODELS
                });
            }

            if (apiError.message.includes('429') || apiError.message.includes('rate limit')) {
                return res.status(429).json({
                    success: false,
                    message: 'Rate limit exceeded on all models. Please wait before trying again.',
                    modelsAttempted: AVAILABLE_MODELS
                });
            }

            if (apiError.message.includes('context length') || apiError.message.includes('token')) {
                return res.status(400).json({
                    success: false,
                    message: 'Too many candidates to process at once. Please reduce the number of candidates.',
                    tokenCount: estimatedTokens,
                    candidateCount: candidates.length
                });
            }

            return res.status(503).json({
                success: false,
                message: 'The AI service is currently unavailable. Please wait a moment and try again.',
                error: apiError.message,
                modelsAttempted: AVAILABLE_MODELS
            });
        }

        const rawText = result.response.text();
        console.log('📝 Raw AI response length:', rawText.length, 'characters');

        let screeningData: ScreeningResponse;
        try {
            screeningData = extractJSONFromResponse(rawText);
        } catch (parseErr: any) {
            console.error('Gemini JSON parse error:', parseErr.message);
            console.error('Raw response preview:', rawText.substring(0, 500));
            return res.status(500).json({
                success: false,
                message: 'AI returned an invalid response. Please try again.',
                rawPreview: rawText.substring(0, 300),
            });
        }

        if (!screeningData.shortlist || !Array.isArray(screeningData.shortlist)) {
            console.error('Invalid response structure:', screeningData);
            return res.status(500).json({
                success: false,
                message: 'AI returned an unexpected response structure. Please try again.'
            });
        }

        const usageMetadata = result.response.usageMetadata;
        if (usageMetadata) {
            const inputTokens = usageMetadata.promptTokenCount || usageMetadata.prompt_tokens || 0;
            const outputTokens = usageMetadata.candidatesTokenCount || usageMetadata.completion_tokens || 0;
            const totalTokens = inputTokens + outputTokens;
            const responseTime = (Date.now() - startTime) / 1000;

            console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   TOKEN USAGE & COST BREAKDOWN               ║
╠══════════════════════════════════════════════════════════════╣
║ INPUT TOKENS:          ${inputTokens.toString().padEnd(38)}║
║ OUTPUT TOKENS:         ${outputTokens.toString().padEnd(38)}║
║ TOTAL TOKENS:          ${totalTokens.toString().padEnd(38)}║
║ Response time:         ${responseTime.toFixed(2)}s${' '.repeat(35 - responseTime.toFixed(2).length - 1)}║
╚══════════════════════════════════════════════════════════════╝
            `);
        }

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
            const shortListItems = screeningData.shortlist.map(item => ({
                rank: item.rank,
                candidate: item.candidateId,
                candidateName: item.candidateName,
                matchScore: item.matchScore,
                recommendation: item.recommendation,
                strengths: item.strengths || [],
                gaps: item.gaps || [],
                reasoning: item.reasoning,
                status: 'passed'
            }));

            const existingResult = await ScreeningResult.findOne({ job: jobId }) as ScreeningResultDocument | null;

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
            modelInfo: {
                modelsAttempted: AVAILABLE_MODELS,
                message: 'Automatic model fallback was used to ensure successful screening'
            }
        });

    } catch (error: any) {
        console.error('Unexpected error in runAIScreening:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during screening',
            error: error.message
        });
    }
};

// @desc    Get saved screening results for a job
// @route   GET /api/ai/screen/:jobId/results
// @access  Private
export const getJobScreeningResults = async (req: AuthRequest, res: Response) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findOne({ _id: jobId, recruiter: req.user?._id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or not authorized' });
        }

        const result = await ScreeningResult.findOne({ job: jobId })
            .populate('shortlist.candidate', 'firstName lastName email headline location skills');

        return res.json(result ? [result] : []);
    } catch (error: any) {
        console.error('Error fetching screening results:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching screening results',
            error: error.message
        });
    }
};

// @desc    Parse uploaded resume files using Gemini and save candidates
// @route   POST /api/ai/parse-candidates/:jobId
// @access  Private
export const parseAndUploadCandidates = async (req: AuthRequest & { files?: any[] }, res: Response) => {
    const { jobId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    try {
        const job = await Job.findOne({ _id: jobId, recruiter: req.user?._id });
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found or not authorized' });
        }

        const addedCandidates = [];

        for (const file of files) {
            console.log(`Processing file: ${file.originalname} of type ${file.mimetype}`);

            const prompt = `
You are an expert AI recruiter assistant. 
I am providing a document (resume, CV, or dataset) containing candidate information.
Extract ALL candidates found in this document into a JSON array of objects matching this exact structure:

[
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "headline": "string",
    "bio": "string",
    "location": "string",
    "skills": [
      { "name": "string", "level": "Beginner | Intermediate | Advanced | Expert", "yearsOfExperience": number }
    ],
    "languages": [
      { "name": "string", "proficiency": "Basic | Conversational | Fluent | Native" }
    ],
    "experience": [
      { "company": "string", "role": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM | Present", "description": "string", "technologies": ["string"], "isCurrent": boolean }
    ],
    "education": [
      { "institution": "string", "degree": "string", "fieldOfStudy": "string", "startYear": number, "endYear": number }
    ],
    "certifications": [
      { "name": "string", "issuer": "string", "issueDate": "YYYY-MM" }
    ],
    "projects": [
      { "name": "string", "description": "string", "technologies": ["string"], "role": "string", "link": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }
    ],
    "availability": {
      "status": "Available | Open to Opportunities | Not Available",
      "type": "Full-time | Part-time | Contract",
      "startDate": "YYYY-MM-DD"
    },
    "socialLinks": {
      "linkedin": "string",
      "github": "string",
      "portfolio": "string",
      "twitter": "string",
      "other": "string"
    }
  }
]

Return ONLY a valid JSON array. Do not include any markdown format like \`\`\`json.
`;

            let filePart: any;
            const mimeType = file.mimetype;

            if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.endsWith('.xlsx')) {
                const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                let allSheetsContent = '';

                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const csv = xlsx.utils.sheet_to_csv(worksheet);
                    if (csv.trim()) {
                        allSheetsContent += `--- SHEET: ${sheetName} ---\n${csv}\n\n`;
                    }
                });

                filePart = { text: `[DATASET CONTENT FROM ALL SHEETS]\n${allSheetsContent}` };
            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalname.endsWith('.docx')) {
                const result = await mammoth.extractRawText({ buffer: file.buffer });
                filePart = { text: `[DOCUMENT CONTENT]\n${result.value}` };
            } else {
                filePart = {
                    inlineData: {
                        data: file.buffer.toString('base64'),
                        mimeType: mimeType === 'application/octet-stream' ? 'application/pdf' : mimeType // Fallback for some uploads
                    }
                };
            }

            let parts: any[] = [{ text: prompt }, filePart];

            try {
                const result = await generateWithFallback(parts, 2);
                const rawText = result.response.text();

                let parsedCandidates = extractJSONFromResponse(rawText);
                if (!Array.isArray(parsedCandidates)) {
                    parsedCandidates = [parsedCandidates];
                }

                for (let candData of parsedCandidates) {
                    // Provide default fallbacks to satisfy mongoose schema requirements
                    if (!candData.firstName) candData.firstName = 'Unknown';
                    if (!candData.lastName) candData.lastName = 'Candidate';
                    if (!candData.email) candData.email = 'unknown@example.com';
                    if (!candData.headline) candData.headline = 'Applicant';
                    if (!candData.location) candData.location = 'Unknown Location';

                    const candidate = new Candidate({
                        ...candData,
                        job: jobId,
                    });
                    await candidate.save();
                    addedCandidates.push(candidate);
                }
            } catch (err: any) {
                console.error(`Failed to parse file ${file.originalname}:`, err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Successfully processed files and added ${addedCandidates.length} candidates.`,
            addedCandidatesCount: addedCandidates.length,
            candidates: addedCandidates
        });

    } catch (error: any) {
        console.error('Error parsing candidates:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during document parsing',
            error: error.message
        });
    }
};
