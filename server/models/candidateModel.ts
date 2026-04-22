import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true,
    },
    yearsOfExperience: { type: Number, default: 0 },
}, { _id: false });

const languageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    proficiency: {
        type: String,
        enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
        required: true,
    },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: String, required: true },  // YYYY-MM
    endDate: { type: String },                      // YYYY-MM | "Present"
    description: { type: String },
    technologies: { type: [String], default: [] },
    isCurrent: { type: Boolean, default: false },
}, { _id: false });

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
}, { _id: false });

const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String },  // YYYY-MM
}, { _id: false });

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    technologies: { type: [String], default: [] },
    role: { type: String },
    link: { type: String },
    startDate: { type: String },  // YYYY-MM
    endDate: { type: String },    // YYYY-MM
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Available', 'Open to Opportunities', 'Not Available'],
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract'],
    },
    startDate: { type: String },  // YYYY-MM-DD
}, { _id: false });

const socialLinksSchema = new mongoose.Schema({
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    twitter: { type: String },
    other: { type: String },
}, { _id: false });

const candidateSchema = new mongoose.Schema(
    {
        // 3.1 Basic Information
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        headline: { type: String, required: true },
        bio: { type: String },
        location: { type: String, required: true },

        // 3.2 Skills & Languages
        skills: { type: [skillSchema], default: [] },
        languages: { type: [languageSchema], default: [] },

        // 3.3 Work Experience
        experience: { type: [experienceSchema], default: [] },

        // 3.4 Education
        education: { type: [educationSchema], default: [] },

        // 3.5 Certifications
        certifications: { type: [certificationSchema], default: [] },

        // 3.6 Projects
        projects: { type: [projectSchema], default: [] },

        // 3.7 Availability
        availability: { type: availabilitySchema },

        // 3.8 Social Links
        socialLinks: { type: socialLinksSchema },

        // Association
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

// Virtual: full name for backward compatibility
candidateSchema.virtual('name').get(function (this: any) {
    return `${this.firstName} ${this.lastName}`.trim();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
