export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  location: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  education: string;
  resumeUrl?: string;
  appliedDate: Date;
}

export interface ScreeningResult {
  id: string;
  jobId: string;
  candidateId: string;
  score: number;
  matchPercentage: number;
  matchedSkills: string[];
  feedback: string;
  status: 'passed' | 'rejected' | 'review';
  createdAt: Date;
}

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  pendingScreenings: number;
  averageScore: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  company: string;
  avatar?: string;
}
