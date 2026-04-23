import { Response } from 'express';
import Candidate from '../models/candidateModel';
import Job from '../models/jobModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Add a new candidate to a job
// @route   POST /api/candidates
// @access  Private
const addCandidate = async (req: AuthRequest, res: Response) => {
    const {
        firstName, lastName, email, headline, bio, location,
        skills, languages,
        experience,
        education,
        certifications,
        projects,
        availability,
        socialLinks,
        jobId,
    } = req.body;

    const jobExists: any = await Job.findById(jobId);

    if (!jobExists) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    // Ensure job belongs to requester
    if (jobExists.recruiter.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
        res.status(401).json({ message: 'Not authorized for this job' });
        return;
    }

    const candidate = new Candidate({
        firstName,
        lastName,
        email,
        headline,
        bio,
        location,
        skills: skills || [],
        languages: languages || [],
        experience: experience || [],
        education: education || [],
        certifications: certifications || [],
        projects: projects || [],
        availability,
        socialLinks,
        job: jobId,
    });

    const createdCandidate = await candidate.save();
    res.status(201).json(createdCandidate);
};

// @desc    Get all candidates (optionally filter by job)
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req: AuthRequest, res: Response) => {
    const { jobId } = req.query;

    // First find all jobs belonging to this recruiter
    const userJobs = await Job.find({ recruiter: req.user?._id }).select('_id');
    const userJobIds = userJobs.map(job => job._id.toString());

    let filter: any = { job: { $in: userJobIds } };

    if (jobId) {
        if (!userJobIds.includes(jobId as string)) {
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
const getCandidateById = async (req: AuthRequest, res: Response) => {
    const candidate: any = await Candidate.findById(req.params.id).populate('job');

    if (candidate) {
        // Check if the candidate's job belongs to the current user
        if (candidate.job.recruiter.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
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
const deleteCandidate = async (req: AuthRequest, res: Response) => {
    const candidate: any = await Candidate.findById(req.params.id).populate('job');

    if (candidate) {
        if (candidate.job.recruiter.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to delete this candidate' });
            return;
        }
        await candidate.deleteOne();
        res.json({ message: 'Candidate removed' });
    } else {
        res.status(404).json({ message: 'Candidate not found' });
    }
};

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
// @access  Private
const updateCandidate = async (req: AuthRequest, res: Response) => {
    const candidate: any = await Candidate.findById(req.params.id).populate('job');

    if (candidate) {
        if (candidate.job.recruiter.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to update this candidate' });
            return;
        }

        const {
            firstName, lastName, email, headline, bio, location,
            skills, languages, experience, education, certifications,
            projects, availability, socialLinks
        } = req.body;

        candidate.firstName = firstName || candidate.firstName;
        candidate.lastName = lastName || candidate.lastName;
        candidate.email = email || candidate.email;
        candidate.headline = headline || candidate.headline;
        candidate.bio = bio || candidate.bio;
        candidate.location = location || candidate.location;
        candidate.skills = skills || candidate.skills;
        candidate.languages = languages || candidate.languages;
        candidate.experience = experience || candidate.experience;
        candidate.education = education || candidate.education;
        candidate.certifications = certifications || candidate.certifications;
        candidate.projects = projects || candidate.projects;
        candidate.availability = availability || candidate.availability;
        candidate.socialLinks = socialLinks || candidate.socialLinks;

        const updatedCandidate = await candidate.save();
        res.json(updatedCandidate);
    } else {
        res.status(404).json({ message: 'Candidate not found' });
    }
};

export {
    addCandidate,
    getCandidates,
    getCandidateById,
    deleteCandidate,
    updateCandidate,
};
