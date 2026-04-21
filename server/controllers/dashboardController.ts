import { Response } from 'express';
import Job from '../models/jobModel';
import Candidate from '../models/candidateModel';
import ScreeningResult from '../models/screeningModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userJobs = await Job.find({ recruiter: req.user?._id }).select('_id');
        const userJobIds = userJobs.map(job => job._id);

        const totalJobs = userJobs.length;
        const totalCandidates = await Candidate.countDocuments({ job: { $in: userJobIds } });

        const results = await ScreeningResult.find({ job: { $in: userJobIds } });
        let pendingScreenings = 0;
        let totalScore = 0;
        let countScored = 0;

        results.forEach(resItem => {
            resItem.shortlist.forEach(c => {
                if (c.status === 'review') pendingScreenings++;
                totalScore += c.matchScore;
                countScored++;
            });
        });

        const averageScore = countScored > 0 ? (totalScore / countScored).toFixed(1) : 0;

        res.json({
            totalJobs,
            totalCandidates,
            pendingScreenings,
            averageScore
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent screenings
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentScreenings = async (req: AuthRequest, res: Response) => {
    try {
        const userJobs = await Job.find({ recruiter: req.user?._id }).select('_id');
        const userJobIds = userJobs.map(job => job._id);

        const recentJobs: any = await ScreeningResult.find({ job: { $in: userJobIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job', 'title')
            .populate('shortlist.candidate', 'firstName lastName');

        let recentScreenings: any[] = [];
        for (const jobResult of recentJobs) {
            for (const item of jobResult.shortlist) {
                recentScreenings.push({
                    _id: jobResult._id,
                    candidateId: item.candidate?._id,
                    job: jobResult.job,
                    candidate: item.candidate,
                    score: item.matchScore,
                    status: item.status,
                    createdAt: jobResult.createdAt
                });
            }
        }

        recentScreenings = recentScreenings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

        res.json(recentScreenings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getDashboardStats,
    getRecentScreenings
};
