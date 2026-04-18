'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api-client';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${jobId}`);
        setJob(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId && jobId !== 'undefined') fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error || !job) {
    return (
      <AppLayout>
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-lg m-8">
          <p className="mb-4">{error || 'Job not found'}</p>
          <Button onClick={() => router.push('/jobs')}>Go Back to Jobs</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/jobs')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card border-border shadow-sm">
              <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
              <p className="text-muted-foreground mb-6 font-medium text-lg">{job.department}</p>

              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Location</p>
                    <p className="font-bold text-foreground">{job.location}</p>
                  </div>
                </div>
                {job.salaryRange && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <span className="text-xl font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Salary Range</p>
                      <p className="font-bold text-foreground">
                        ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-foreground mb-4">About this role</h2>
                <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Key Requirements</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-accent mt-0.5 font-bold">✓</span>
                      <span className="text-sm text-foreground/90">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full"></span>
                Job Stats
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Posted Date</p>
                  <p className="text-sm text-foreground font-semibold">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Link href={`/jobs/${job.id}/screen`} className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-12 shadow-lg shadow-accent/20">
                  Start Screening
                </Button>
              </Link>
              <Link href={`/candidates?job=${job.id}`} className="block">
                <Button variant="outline" className="w-full border-border hover:bg-muted font-bold h-12">
                  View Candidates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
