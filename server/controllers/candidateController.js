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
    const filter = jobId ? { job: jobId } : {};

    const candidates = await Candidate.find(filter).populate('job', 'title department');
    res.json(candidates);
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
const getCandidateById = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id).populate('job', 'title department');

    if (candidate) {
        res.json(candidate);
    } else {
        res.status(404).json({ message: 'Candidate not found' });
    }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private
const deleteCandidate = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
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
