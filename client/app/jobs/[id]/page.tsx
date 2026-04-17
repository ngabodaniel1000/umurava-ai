'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Users, DollarSign, Calendar } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  // Mock job data
  const job = {
    id: jobId,
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    description:
      'We are looking for an experienced React Developer to join our growing engineering team. You will work on building scalable, performant web applications using modern JavaScript and React.',
    requirements: [
      '5+ years of experience with React',
      'Strong understanding of JavaScript/TypeScript',
      'Experience with state management (Redux, Zustand)',
      'Knowledge of REST APIs',
      'Experience with testing frameworks',
      'Strong problem-solving skills',
    ],
    salaryMin: 140000,
    salaryMax: 200000,
    candidates: 12,
    pendingScreening: 5,
    createdAt: '2024-03-15',
  };

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
              <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
              <p className="text-muted-foreground mb-6">{job.department}</p>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold text-foreground">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Salary Range</p>
                  <p className="font-semibold text-foreground">
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">About this role</h2>
                <p className="text-foreground leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent mt-1.5">✓</span>
                      <span className="text-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold text-foreground mb-4">Job Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
                  <p className="text-2xl font-bold text-foreground">{job.candidates}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Screening</p>
                  <p className="text-2xl font-bold text-accent">{job.pendingScreening}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Posted</p>
                  <p className="text-sm text-foreground">{job.createdAt}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Link href={`/jobs/${job.id}/screen`} className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Start Screening
                </Button>
              </Link>
              <Link href={`/candidates?job=${job.id}`} className="block">
                <Button variant="outline" className="w-full border-border hover:bg-muted">
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
