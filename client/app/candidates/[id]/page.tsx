'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, Mail, MapPin, Loader2, Globe, Github, Linkedin,
  Twitter, Briefcase, GraduationCap, Award, FolderOpen, Clock,
  Zap, ExternalLink, Calendar, CheckCircle2,
} from 'lucide-react';
import api from '@/lib/api-client';
import Link from 'next/link';
import {
  Candidate, CandidateSkill, WorkExperience, EducationEntry,
  Certification, Project, Availability, SocialLinks,
} from '@/lib/types';

/* ── helpers ── */
const levelColor: Record<string, string> = {
  Beginner: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Advanced: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Expert: 'bg-green-500/10 text-green-400 border-green-500/20',
};
const statusColor: Record<string, string> = {
  Available: 'bg-green-500/20 text-green-400',
  'Open to Opportunities': 'bg-yellow-500/20 text-yellow-400',
  'Not Available': 'bg-red-500/20 text-red-400',
};
const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <Card className="p-6 bg-card border-border">
    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5 text-accent" />
      {title}
    </h2>
    {children}
  </Card>
);

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const { data } = await api.get(`/candidates/${candidateId}`);
        setCandidate(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch candidate details');
      } finally {
        setLoading(false);
      }
    };
    if (candidateId) fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error || !candidate) {
    return (
      <AppLayout>
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-lg m-8">
          {error || 'Candidate not found'}
          <div className="mt-4">
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const c = candidate as Candidate;
  const sl = c.socialLinks as SocialLinks | undefined;
  const avail = c.availability as Availability | undefined;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column: main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero card */}
            <Card className="p-8 bg-card border-border">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                  {c.firstName?.[0]}{c.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground">{c.firstName} {c.lastName}</h1>
                  <p className="text-accent font-medium mt-1">{c.headline}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{c.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{c.location}</span>
                  </div>
                  {c.bio && <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{c.bio}</p>}
                </div>
              </div>
            </Card>

            {/* 3.2 Skills */}
            {c.skills?.length > 0 && (
              <SectionCard title="Skills" icon={Zap}>
                <div className="flex flex-wrap gap-2">
                  {c.skills.map((sk: CandidateSkill, i: number) => (
                    <span key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${levelColor[sk.level] || 'bg-muted/40 text-foreground border-border'}`}>
                      {sk.name}
                      <span className="opacity-70">· {sk.level}</span>
                      {sk.yearsOfExperience > 0 && <span className="opacity-60">· {sk.yearsOfExperience}y</span>}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3.2 Languages */}
            {c.languages?.length > 0 && (
              <SectionCard title="Languages" icon={Globe}>
                <div className="flex flex-wrap gap-2">
                  {c.languages.map((lang: any, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-muted/40 border border-border text-xs font-medium text-foreground">
                      {lang.name} <span className="text-muted-foreground">· {lang.proficiency}</span>
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3.3 Work Experience */}
            {c.experience?.length > 0 && (
              <SectionCard title="Work Experience" icon={Briefcase}>
                <div className="space-y-5">
                  {c.experience.map((exp: WorkExperience, i: number) => (
                    <div key={i} className="relative pl-5 border-l-2 border-accent/30">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-semibold text-foreground">{exp.role}</p>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {exp.startDate} → {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.description && <p className="text-sm text-foreground/80 mt-2">{exp.description}</p>}
                      {exp.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.technologies.map((t: string, ti: number) => (
                            <span key={ti} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3.4 Education */}
            {c.education?.length > 0 && (
              <SectionCard title="Education" icon={GraduationCap}>
                <div className="space-y-4">
                  {c.education.map((edu: EducationEntry, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {edu.startYear} – {edu.endYear}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3.5 Certifications */}
            {c.certifications?.length > 0 && (
              <SectionCard title="Certifications" icon={Award}>
                <div className="space-y-3">
                  {c.certifications.map((cert: Certification, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.issuer} {cert.issueDate ? `· ${cert.issueDate}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3.6 Projects */}
            {c.projects?.length > 0 && (
              <SectionCard title="Projects" icon={FolderOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {c.projects.map((proj: Project, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-muted/30">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-foreground">{proj.name}</p>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80 shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {proj.role && <p className="text-xs text-muted-foreground mb-2">{proj.role}</p>}
                      {proj.description && <p className="text-sm text-foreground/80 mb-3">{proj.description}</p>}
                      {proj.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map((t: string, ti: number) => (
                            <span key={ti} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">{t}</span>
                          ))}
                        </div>
                      )}
                      {(proj.startDate || proj.endDate) && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {proj.startDate} – {proj.endDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">

            {/* Availability */}
            {avail && (
              <SectionCard title="Availability" icon={Clock}>
                <div className="space-y-3">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusColor[avail.status] || 'bg-muted text-foreground'}`}>
                    {avail.status}
                  </span>
                  {avail.type && <p className="text-sm text-foreground"><span className="text-muted-foreground">Type:</span> {avail.type}</p>}
                  {avail.startDate && <p className="text-sm text-foreground"><span className="text-muted-foreground">From:</span> {avail.startDate}</p>}
                </div>
              </SectionCard>
            )}

            {/* Social Links */}
            {sl && (Object.values(sl).some(Boolean)) && (
              <SectionCard title="Social Links" icon={Globe}>
                <div className="space-y-2">
                  {sl.linkedin && (
                    <a href={sl.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" /> LinkedIn
                    </a>
                  )}
                  {sl.github && (
                    <a href={sl.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {sl.portfolio && (
                    <a href={sl.portfolio} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      <Globe className="w-4 h-4" /> Portfolio
                    </a>
                  )}
                  {sl.twitter && (
                    <a href={sl.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X
                    </a>
                  )}
                  {sl.other && (
                    <a href={sl.other} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      <ExternalLink className="w-4 h-4" /> Other
                    </a>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Quick info */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold text-foreground mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Applied</p>
                  <p className="text-foreground font-medium">{new Date(c.appliedDate).toLocaleDateString()}</p>
                </div>
                {c.job && (
                  <div>
                    <p className="text-muted-foreground mb-1">Job</p>
                    <p className="text-foreground font-medium">{c.job.title}</p>
                    <p className="text-xs text-muted-foreground">{c.job.department}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Link href={`/jobs/${c.job?._id}/screen`}>
                <Button variant="outline" className="w-full border-border hover:bg-muted">
                  Screen for {c.job?.title}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
