import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().min(2, { message: 'Job title must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  skillsNeeded: z.array(z.string().min(1)).min(1, { message: 'Add at least one skill' }),
  experience: z.string().min(1, { message: 'Experience level is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  department: z.string().min(2, { message: 'Department is required' }),
  salaryMin: z.coerce.number().positive().optional(),
  salaryMax: z.coerce.number().positive().optional(),
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: "Max salary must be greater than or equal to min salary",
  path: ["salaryMax"],
});

// ---------- Sub-schemas ----------

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Select a proficiency level' }),
  }),
  yearsOfExperience: z.coerce.number().min(0).default(0),
});

const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  proficiency: z.enum(['Basic', 'Conversational', 'Fluent', 'Native'], {
    errorMap: () => ({ message: 'Select a proficiency level' }),
  }),
});

const workExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  isCurrent: z.boolean().default(false),
});

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startYear: z.coerce.number().optional(),
  endYear: z.coerce.number().optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional(),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const availabilitySchema = z.object({
  status: z.enum(['Available', 'Open to Opportunities', 'Not Available'], {
    errorMap: () => ({ message: 'Select availability status' }),
  }),
  type: z.enum(['Full-time', 'Part-time', 'Contract']).optional(),
  startDate: z.string().optional(),
});

const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  other: z.string().url().optional().or(z.literal('')),
});

// ---------- Full Candidate Schema ----------

export const candidateFormSchema = z.object({
  // 3.1 Basic Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email({ message: 'Invalid email address' }),
  headline: z.string().min(2, 'Headline is required'),
  bio: z.string().optional(),
  location: z.string().min(2, 'Location is required'),

  // 3.2 Skills & Languages
  skills: z.array(skillSchema).min(1, 'Add at least one skill'),
  languages: z.array(languageSchema).default([]),

  // 3.3 Work Experience
  experience: z.array(workExperienceSchema).min(1, 'Add at least one work experience'),

  // 3.4 Education
  education: z.array(educationSchema).min(1, 'Add at least one education entry'),

  // 3.5 Certifications
  certifications: z.array(certificationSchema).default([]),

  // 3.6 Projects
  projects: z.array(projectSchema).min(1, 'Add at least one project'),

  // 3.7 Availability
  availability: availabilitySchema,

  // 3.8 Social Links
  socialLinks: socialLinksSchema.optional(),
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(30, { message: 'Password must be no more than 30 characters' }),
});

export const settingsFormSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  notification: z.boolean(),
  theme: z.enum(['light', 'dark']),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
export type CandidateFormData = z.infer<typeof candidateFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type SettingsFormData = z.infer<typeof settingsFormSchema>;
