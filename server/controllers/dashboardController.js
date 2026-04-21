const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');
const ScreeningResult = require('../models/screeningModel');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userJobs = await Job.find({ recruiter: req.user._id }).select('_id');
        const userJobIds = userJobs.map(job => job._id);

        const totalJobs = userJobs.length;
        const totalCandidates = await Candidate.countDocuments({ job: { $in: userJobIds } });

        const results = await ScreeningResult.find({ job: { $in: userJobIds } });
        let pendingScreenings = 0;
        let totalScore = 0;
        let countScored = 0;

        results.forEach(res => {
            res.shortlist.forEach(c => {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent screenings
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentScreenings = async (req, res) => {
    try {
        const userJobs = await Job.find({ recruiter: req.user._id }).select('_id');
        const userJobIds = userJobs.map(job => job._id);

        const recentJobs = await ScreeningResult.find({ job: { $in: userJobIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job', 'title')
            .populate('shortlist.candidate', 'firstName lastName');

        // Extract individual candidate screenings from the job results to display as 'recent screenings'
        let recentScreenings = [];
        for (const jobResult of recentJobs) {
            for (const item of jobResult.shortlist) {
                recentScreenings.push({
                    _id: jobResult._id, // might want to use unique candidate IDs, but this is acceptable for now
                    candidateId: item.candidate?._id,
                    job: jobResult.job,
                    candidate: item.candidate,
                    score: item.matchScore,
                    status: item.status,
                    createdAt: jobResult.createdAt
                });
            }
        }

        // Sort the flattened list by created logic and just take top 5
        recentScreenings = recentScreenings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        res.json(recentScreenings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getRecentScreenings
};
