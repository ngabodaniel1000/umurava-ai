'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreeningWizard } from '@/components/screening/screening-wizard';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Target } from 'lucide-react';

export default function ScreeningPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [screeningResult, setScreeningResult] = useState<any>(null);

  // Mock data
  const job = {
    id: jobId,
    title: 'Senior React Developer',
  };

  const candidate = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const handleScreeningComplete = (result: any) => {
    setScreeningResult(result);
  };

  if (screeningResult) {
    return (
      <AppLayout>
        <div className="p-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Results */}
            <div className="col-span-2 space-y-6">
              {/* Score Card */}
              <Card className="p-8 bg-gradient-to-br from-accent/20 to-background border-accent/30">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{screeningResult.candidateName}</h1>
                    <p className="text-muted-foreground mt-2">{screeningResult.jobTitle}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-4xl font-bold text-white">{screeningResult.score}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">/10</p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Match Percentage</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                        style={{ width: `${screeningResult.matchPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-2xl font-bold text-accent">{screeningResult.matchPercentage}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-foreground leading-relaxed">{screeningResult.feedback}</p>
                </div>
              </Card>

              {/* Matched Skills */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {screeningResult.matchedSkills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Detailed Analysis */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Analysis</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Technical Fit</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Excellent technical alignment with strong React and TypeScript expertise.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Experience Level</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        6 years of experience meets and exceeds the 5+ year requirement.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className={`p-6 border ${
                screeningResult.status === 'passed'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {screeningResult.status === 'passed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <p className="font-bold text-foreground capitalize">{screeningResult.status}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {screeningResult.status === 'passed'
                    ? 'This candidate is recommended for the next round.'
                    : 'This candidate may need further review.'}
                </p>
              </Card>

              <div className="space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Move to Next Round
                </Button>
                <Button variant="outline" className="w-full border-border hover:bg-muted">
                  Request Additional Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.push(`/jobs/${jobId}`)}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Screening</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered candidate assessment for {job.title}
          </p>
        </div>

        <Card className="p-8 bg-card border-border mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Position</p>
              <p className="text-lg font-semibold text-foreground">{job.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Candidate</p>
              <p className="text-lg font-semibold text-foreground">{candidate.name}</p>
            </div>
          </div>
        </Card>

        <ScreeningWizard
          jobTitle={job.title}
          candidateName={candidate.name}
          onComplete={handleScreeningComplete}
        />
      </div>
    </AppLayout>
  );
}
