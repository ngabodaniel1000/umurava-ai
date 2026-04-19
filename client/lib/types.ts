export interface Job {
  id: string;
  _id?: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  experience: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  location: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

// 3.2 Skill entry
export interface CandidateSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

// 3.2 Language entry
export interface CandidateLanguage {
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

// 3.3 Work Experience entry
export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;   // YYYY-MM
  endDate?: string;    // YYYY-MM | "Present"
  description?: string;
  technologies: string[];
  isCurrent: boolean;
}

// 3.4 Education entry
export interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

// 3.5 Certification entry
export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;  // YYYY-MM
}

// 3.6 Project entry
export interface Project {
  name: string;
  description?: string;
  technologies: string[];
  role?: string;
  link?: string;
  startDate?: string;  // YYYY-MM
  endDate?: string;    // YYYY-MM
}

// 3.7 Availability
export interface Availability {
  status: 'Available' | 'Open to Opportunities' | 'Not Available';
  type?: 'Full-time' | 'Part-time' | 'Contract';
  startDate?: string;  // YYYY-MM-DD
}

// 3.8 Social Links
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  other?: string;
}

// Full Candidate Profile (Talent Profile Schema)
export interface Candidate {
  id: string;
  _id?: string;

  // 3.1 Basic Information
  firstName: string;
  lastName: string;
  name: string;   // virtual: firstName + lastName
  email: string;
  headline: string;
  bio?: string;
  location: string;

  // 3.2 Skills & Languages
  skills: CandidateSkill[];
  languages: CandidateLanguage[];

  // 3.3 Work Experience
  experience: WorkExperience[];

  // 3.4 Education
  education: EducationEntry[];

  // 3.5 Certifications
  certifications: Certification[];

  // 3.6 Projects
  projects: Project[];

  // 3.7 Availability
  availability?: Availability;

  // 3.8 Social Links
  socialLinks?: SocialLinks;

  // Meta
  appliedDate: Date;
  job?: {
    _id: string;
    id?: string;
    title: string;
    department: string;
  };
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
