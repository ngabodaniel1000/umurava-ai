const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');
const ScreeningResult = require('../models/screeningModel');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalCandidates = await Candidate.countDocuments();
        const pendingScreenings = await ScreeningResult.countDocuments({ status: 'review' });

        const results = await ScreeningResult.find({});
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
        const recentScreenings = await ScreeningResult.find({})
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
