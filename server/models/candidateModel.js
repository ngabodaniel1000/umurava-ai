const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        experience: {
            type: Number,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        education: {
            type: String,
            required: true,
        },
        resumeUrl: {
            type: String,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
