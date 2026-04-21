const mongoose = require('mongoose');

const screenedCandidateSchema = new mongoose.Schema({
    rank: { type: Number, required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    candidateName: { type: String },
    matchScore: { type: Number, required: true },
    recommendation: { type: String },
    strengths: { type: [String] },
    gaps: { type: [String] },
    reasoning: { type: String },
    status: { type: String, enum: ['passed', 'rejected', 'review'], default: 'review' }
});

const screeningResultSchema = mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
            unique: true,
        },
        jobTitle: {
            type: String,
        },
        totalCandidatesAnalyzed: {
            type: Number,
            default: 0,
        },
        shortlistCount: {
            type: Number,
            default: 0,
        },
        shortlist: [screenedCandidateSchema]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ScreeningResult = mongoose.model('ScreeningResult', screeningResultSchema);

module.exports = ScreeningResult;
