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
        const pendingScreenings = await ScreeningResult.countDocuments({
            job: { $in: userJobIds },
            status: 'review'
        });

        const results = await ScreeningResult.find({ job: { $in: userJobIds } });
        const averageScore = results.length > 0
            ? (results.reduce((acc, item) => acc + item.score, 0) / results.length).toFixed(1)
            : 0;

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

        const recentScreenings = await ScreeningResult.find({ job: { $in: userJobIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job', 'title')
            .populate('candidate', 'name');

        res.json(recentScreenings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getRecentScreenings
};
