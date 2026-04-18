const Job = require('../models/jobModel');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    const { title, description, requirements, salaryRange, location, department } = req.body;

    const job = new Job({
        title,
        description,
        requirements,
        salaryRange,
        location,
        department,
        recruiter: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('recruiter', 'name company');
    res.json(jobs);
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    const { title, description, requirements, salaryRange, location, department } = req.body;

    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to update this job' });
            return;
        }

        job.title = title || job.title;
        job.description = description || job.description;
        job.requirements = requirements || job.requirements;
        job.salaryRange = salaryRange || job.salaryRange;
        job.location = location || job.location;
        job.department = department || job.department;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to delete this job' });
            return;
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
};
