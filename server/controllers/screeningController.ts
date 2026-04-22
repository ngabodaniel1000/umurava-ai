import { Response } from 'express';
import ScreeningResult from '../models/screeningModel';
import Job from '../models/jobModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create or Update screening result for a job manually (fallback if needed)
// @route   POST /api/screenings
// @access  Private 
const createScreeningResult = async (req: AuthRequest, res: Response) => {
    const { jobId, jobTitle, totalCandidatesAnalyzed, shortlistCount, shortlist } = req.body;

    let screeningResult: any = await ScreeningResult.findOne({ job: jobId });

    if (screeningResult) {
        screeningResult.jobTitle = jobTitle || screeningResult.jobTitle;
        screeningResult.totalCandidatesAnalyzed = totalCandidatesAnalyzed || screeningResult.totalCandidatesAnalyzed;
        screeningResult.shortlistCount = shortlistCount || screeningResult.shortlistCount;
        screeningResult.shortlist = shortlist || screeningResult.shortlist;

        const updatedResult = await screeningResult.save();
        return res.status(200).json(updatedResult);
    } else {
        screeningResult = new ScreeningResult({
            job: jobId,
            jobTitle,
            totalCandidatesAnalyzed,
            shortlistCount,
            shortlist: shortlist || []
        });

        const createdResult = await screeningResult.save();
        return res.status(201).json(createdResult);
    }
};

// @desc    Get all screening results (optionally filter by job)
// @route   GET /api/screenings
// @access  Private
const getScreeningResults = async (req: AuthRequest, res: Response) => {
    const { jobId } = req.query;

    const userJobs = await Job.find({ recruiter: req.user?._id }).select('_id');
    const userJobIds = userJobs.map(job => job._id.toString());

    let filter: any = { job: { $in: userJobIds } };

    if (jobId) {
        if (!userJobIds.includes(jobId as string)) {
            return res.status(401).json({ message: 'Not authorized for this job' });
        }
        filter.job = jobId;
    }

    const results = await ScreeningResult.find(filter)
        .populate('job', 'title')
        .populate('shortlist.candidate', 'firstName lastName email');
    res.json(results);
};

// @desc    Update screening result status for a specific candidate
// @route   PUT /api/screenings/:id
// @access  Private
const updateScreeningStatus = async (req: AuthRequest, res: Response) => {
    const { candidateId, status, feedback } = req.body;

    const screening: any = await ScreeningResult.findById(req.params.id);

    if (screening) {
        const candidateInShortlist = screening.shortlist.find(
            (c: any) => c.candidate.toString() === candidateId
        );

        if (candidateInShortlist) {
            candidateInShortlist.status = status || candidateInShortlist.status;
            candidateInShortlist.reasoning = feedback || candidateInShortlist.reasoning;

            const updatedScreening = await screening.save();
            return res.json(updatedScreening);
        } else {
            return res.status(404).json({ message: 'Candidate not found in screening shortlist' });
        }
    } else {
        res.status(404).json({ message: 'Screening result not found' });
    }
};

export {
    createScreeningResult,
    getScreeningResults,
    updateScreeningStatus,
};
