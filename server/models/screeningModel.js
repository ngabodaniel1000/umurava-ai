const mongoose = require('mongoose');

const screeningResultSchema = mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        matchPercentage: {
            type: Number,
            required: true,
        },
        matchedSkills: {
            type: [String],
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['passed', 'rejected', 'review'],
            default: 'review',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ScreeningResult = mongoose.model('ScreeningResult', screeningResultSchema);

module.exports = ScreeningResult;
