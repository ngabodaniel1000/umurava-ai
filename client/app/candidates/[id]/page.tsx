'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, BookOpen, Award, Loader2, FileText } from 'lucide-react';
import api from '@/lib/api-client';
import { Candidate } from '@/lib/types';
import Link from 'next/link';

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

  return (
    <AppLayout>
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
                  <p className="text-muted-foreground mt-2">{candidate.experience} years of experience</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <p className="text-sm">Email</p>
                  </div>
                  <a href={`mailto:${candidate.email}`} className="text-accent hover:underline">
                    {candidate.email}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <p className="text-sm">Phone</p>
                  </div>
                  <a href={`tel:${candidate.phone}`} className="text-accent hover:underline">
                    {candidate.phone}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">Job</p>
                  </div>
                  <p className="font-semibold text-foreground">{candidate.job?.title || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Education
                </h2>
                <p className="text-foreground">{candidate.education}</p>
              </div>
            </Card>

            {/* Documents & Source Files Section */}
            <Card className="p-8 bg-card border-border">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Documents & Source Files
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex border border-border rounded-xl overflow-hidden bg-muted/30 group hover:border-accent/50 transition-all">
                  <div className="w-16 bg-muted flex items-center justify-center border-r border-border">
                    <FileText className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div className="p-4 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{candidate.name.replace(' ', '_')}_Resume.pdf</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF Document • 2.4 MB</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="link" className="h-auto p-0 text-accent text-xs font-bold" asChild>
                        <a href={candidate.resumeUrl} target="_blank">View File</a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Simulated Excel Source if candidate was bulk uploaded */}
                <div className="flex border border-border rounded-xl overflow-hidden bg-muted/30 group hover:border-accent/50 transition-all opacity-60">
                  <div className="w-16 bg-muted flex items-center justify-center border-r border-border">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="p-4 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">External_Job_Board_Export.xlsx</p>
                    <p className="text-xs text-muted-foreground mt-1">Excel Sheet • Source Data</p>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[10px] bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground">Linked Source</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold text-foreground mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Applied</p>
                  <p className="text-foreground font-medium">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Experience</p>
                  <p className="text-foreground font-medium">{candidate.experience} years</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {candidate.resumeUrl && (
                <Button
                  asChild
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </Button>
              )}
              <Link href={`/jobs/${candidate.job?._id}/screen`}>
                <Button variant="outline" className="w-full border-border hover:bg-muted">
                  Screen for {candidate.job?.title}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
