const Candidate = require('../models/candidateModel');
const Job = require('../models/jobModel');

// @desc    Add a new candidate to a job
// @route   POST /api/candidates
// @access  Public
const addCandidate = async (req, res) => {
    const { name, email, phone, experience, skills, education, resumeUrl, jobId } = req.body;

    const jobExists = await Job.findById(jobId);

    if (!jobExists) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    const candidate = new Candidate({
        name,
        email,
        phone,
        experience,
        skills,
        education,
        resumeUrl,
        job: jobId,
    });

    const createdCandidate = await candidate.save();
    res.status(201).json(createdCandidate);
};

// @desc    Get all candidates (optionally filter by job)
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req, res) => {
    const { jobId } = req.query;

    // First find all jobs belonging to this recruiter
    const userJobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const userJobIds = userJobs.map(job => job._id.toString());

    let filter = { job: { $in: userJobIds } };

    if (jobId) {
        if (!userJobIds.includes(jobId)) {
            return res.status(401).json({ message: 'Not authorized for this job' });
        }
        filter.job = jobId;
    }

    const candidates = await Candidate.find(filter).populate('job', 'title department');
    res.json(candidates);
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
const getCandidateById = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id).populate('job');

    if (candidate) {
        // Check if the candidate's job belongs to the current user
        if (candidate.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to view this candidate' });
            return;
        }
        res.json(candidate);
    } else {
        res.status(404).json({ message: 'Candidate not found' });
    }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private
const deleteCandidate = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id).populate('job');

    if (candidate) {
        if (candidate.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to delete this candidate' });
            return;
        }
        await candidate.deleteOne();
        res.json({ message: 'Candidate removed' });
    } else {
        res.status(404).json({ message: 'Candidate not found' });
    }
};

module.exports = {
    addCandidate,
    getCandidates,
    getCandidateById,
    deleteCandidate,
};
