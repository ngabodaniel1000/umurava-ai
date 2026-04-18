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

export const candidateFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be valid' }),
  experience: z.coerce.number().min(0, { message: 'Experience must be 0 or more' }),
  skills: z.array(z.string().min(1)).min(1, { message: 'Add at least one skill' }),
  education: z.string().min(2, { message: 'Education is required' }),
  resumeUrl: z.string().url().optional().or(z.literal('')),
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
