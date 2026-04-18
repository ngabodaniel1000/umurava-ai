const ScreeningResult = require('../models/screeningModel');
const Candidate = require('../models/candidateModel');
const Job = require('../models/jobModel');

// @desc    Create screening result
// @route   POST /api/screenings
// @access  Private (usually automated by AI service or manual HR review)
const createScreeningResult = async (req, res) => {
    const { jobId, candidateId, score, matchPercentage, matchedSkills, feedback, status } = req.body;

    const screeningResult = new ScreeningResult({
        job: jobId,
        candidate: candidateId,
        score,
        matchPercentage,
        matchedSkills,
        feedback,
        status,
    });

    const createdResult = await screeningResult.save();
    res.status(201).json(createdResult);
};

// @desc    Get all screening results (optionally filter by job or candidate)
// @route   GET /api/screenings
// @access  Private
const getScreeningResults = async (req, res) => {
    const { jobId, candidateId } = req.query;

    // Find jobs owned by recruiter
    const userJobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const userJobIds = userJobs.map(job => job._id.toString());

    let filter = { job: { $in: userJobIds } };

    if (jobId) {
        if (!userJobIds.includes(jobId)) {
            return res.status(401).json({ message: 'Not authorized for this job' });
        }
        filter.job = jobId;
    }

    if (candidateId) filter.candidate = candidateId;

    const results = await ScreeningResult.find(filter)
        .populate('job', 'title')
        .populate('candidate', 'name email');
    res.json(results);
};

// @desc    Update screening result status
// @route   PUT /api/screenings/:id
// @access  Private
const updateScreeningStatus = async (req, res) => {
    const { status, feedback } = req.body;

    const screening = await ScreeningResult.findById(req.params.id);

    if (screening) {
        screening.status = status || screening.status;
        screening.feedback = feedback || screening.feedback;

        const updatedScreening = await screening.save();
        res.json(updatedScreening);
    } else {
        res.status(404).json({ message: 'Screening result not found' });
    }
};

module.exports = {
    createScreeningResult,
    getScreeningResults,
    updateScreeningStatus,
};
