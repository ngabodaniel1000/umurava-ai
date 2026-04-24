'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Trophy,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Target,
  Brain,
  Star,
  Save,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api-client';
import { Job } from '@/lib/types';

interface ShortlistedCandidate {
  rank: number;
  candidateId: string;
  candidateName: string;
  matchScore: number;
  recommendation: 'Highly Recommended' | 'Recommended' | 'Consider' | 'Borderline';
  strengths: string[];
  gaps: string[];
  reasoning: string;
}

interface ScreeningData {
  jobTitle: string;
  totalCandidatesAnalyzed: number;
  shortlistCount: number;
  screeningDate: string;
  shortlist: ShortlistedCandidate[];
}

const recommendationConfig = {
  'Highly Recommended': {
    icon: Trophy,
    color: 'text-green-500',
    bg: 'bg-card border-border',
    badge: 'bg-green-500/10 text-green-500',
  },
  Recommended: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-card border-border',
    badge: 'bg-green-500/10 text-green-500',
  },
  Consider: {
    icon: AlertCircle,
    color: 'text-blue-500',
    bg: 'bg-card border-border',
    badge: 'bg-blue-500/10 text-blue-500',
  },
  Borderline: {
    icon: XCircle,
    color: 'text-muted-foreground',
    bg: 'bg-card border-border',
    badge: 'bg-muted text-muted-foreground',
  },
};

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;
  // Use green for high scores, blue for medium, muted for low
  const color =
    score >= 80
      ? '#22c55e' // Green for excellent
      : score >= 65
        ? '#3b82f6' // Blue for good
        : '#64748b'; // Muted for needs improvement

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" className="stroke-muted" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-foreground leading-none">{score}</span>
        <span className="text-[9px] text-muted-foreground leading-none mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  isExpanded,
  onToggle,
}: {
  candidate: ShortlistedCandidate;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cfg = recommendationConfig[candidate.recommendation] || recommendationConfig['Consider'];
  const Icon = cfg.icon;

  return (
    <Card
      className={`bg-card border-border transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left"
        aria-expanded={isExpanded}
      >
        {/* Rank badge */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">#{candidate.rank}</span>
        </div>

        {/* Score ring */}
        <ScoreRing score={candidate.matchScore} />

        {/* Name + recommendation */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground truncate">{candidate.candidateName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {candidate.recommendation}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable details */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {/* Reasoning */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ">
              AI Reasoning
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{candidate.reasoning}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div>
              <p className="text-xs uppercase tracking-widest text-green-500 mb-2 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Strengths
              </p>
              <ul className="space-y-1.5">
                {candidate.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-500 mb-2 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Gaps / Risks
              </p>
              {candidate.gaps.length > 0 ? (
                <ul className="space-y-1.5">
                  {candidate.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No significant gaps identified.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function AIScreeningPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [candidateCount, setCandidateCount] = useState<number | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  // Fetch job + candidate count on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [jobRes, candRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/candidates?jobId=${jobId}`),
        ]);
        setJob(jobRes.data);
        const candidates = Array.isArray(candRes.data) ? candRes.data : candRes.data?.candidates || [];
        setCandidateCount(candidates.length);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details');
      }
    };
    load();
  }, [jobId]);

  const simulateProgress = () => {
    const stages = [
      { pct: 15, label: 'Loading candidate profiles…' },
      { pct: 30, label: 'Preparing job requirements…' },
      { pct: 50, label: 'Sending to Gemini AI…' },
      { pct: 70, label: 'Analyzing candidate fit…' },
      { pct: 85, label: 'Ranking shortlist…' },
      { pct: 95, label: 'Finalizing results…' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setProgress(stages[i].pct);
        setProgressLabel(stages[i].label);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return interval;
  };

  const runScreening = useCallback(
    async (save = false) => {
      setError('');
      setScreeningData(null);
      setIsRunning(true);
      setProgress(5);
      setProgressLabel('Starting AI screening engine…');

      const interval = simulateProgress();

      try {
        const { data } = await api.post(`/ai/screen/${jobId}`, {
          topN,
          saveResults: save,
        });
        clearInterval(interval);
        setProgress(100);
        setProgressLabel('Complete!');
        // Small delay so user sees 100%
        await new Promise((r) => setTimeout(r, 600));
        setScreeningData(data.data);
        setExpandedId(data.data?.shortlist?.[0]?.candidateId || null);
      } catch (err: any) {
        clearInterval(interval);
        setError(err.response?.data?.message || 'AI Screening failed. Please try again.');
      } finally {
        setIsRunning(false);
      }
    },
    [jobId, topN]
  );

  const saveResults = async () => {
    if (!screeningData) return;
    setIsSaving(true);
    try {
      await api.post(`/screenings`, {
        jobId,
        jobTitle: screeningData.jobTitle,
        totalCandidatesAnalyzed: screeningData.totalCandidatesAnalyzed,
        shortlistCount: screeningData.shortlistCount,
        shortlist: screeningData.shortlist.map(c => ({
          rank: c.rank,
          candidate: c.candidateId,
          candidateName: c.candidateName,
          matchScore: c.matchScore,
          recommendation: c.recommendation,
          strengths: c.strengths,
          gaps: c.gaps,
          reasoning: c.reasoning,
          // maps client recommendation to status correctly
          status: ['Highly Recommended', 'Recommended'].includes(c.recommendation) ? 'passed' : 'review'
        }))
      });
      setIsSaving(false);
    } catch {
      setIsSaving(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!job) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </AppLayout>
    );
  }

  // ── Results view ───────────────────────────────────────────────────────────
  if (screeningData) {
    const topCandidate = screeningData.shortlist[0];
    const avgScore =
      Math.round(
        screeningData.shortlist.reduce((s, c) => s + c.matchScore, 0) /
        screeningData.shortlist.length
      ) || 0;

    return (
      <AppLayout>
        <div className="space-y-8">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="mb-3 gap-2 text-muted-foreground hover:text-foreground px-0"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Job
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-7 h-7 text-green-500" /> AI Screening Results
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {screeningData.jobTitle} — {new Date(screeningData.screeningDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 border-border hover:bg-muted"
                onClick={() => {
                  setScreeningData(null);
                  setProgress(0);
                  setProgressLabel('');
                }}
              >
                <RefreshCw className="w-4 h-4" /> Re-Screen
              </Button>
              <Button
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={saveResults}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Results
              </Button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                label: 'Candidates Analyzed',
                value: screeningData.totalCandidatesAnalyzed,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: Trophy,
                label: 'Shortlisted',
                value: screeningData.shortlistCount,
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: Star,
                label: 'Top Score',
                value: `${topCandidate?.matchScore ?? 0}`,
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: TrendingUp,
                label: 'Avg Score',
                value: `${avgScore}`,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
            ].map((stat) => (
              <Card key={stat.label} className="p-5 border-border bg-card rounded-xl border">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
            <Sparkles className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">AI-Powered Shortlist</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These rankings are generated by Gemini AI based on candidate profiles and job requirements.
                Recruiters should review the reasoning and strengths for each candidate before making a final decision.
              </p>
            </div>
          </div>

          {/* Shortlist */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" /> Ranked Shortlist
            </h2>
            <div className="space-y-3">
              {screeningData.shortlist.map((candidate) => (
                <CandidateCard
                  key={candidate.candidateId}
                  candidate={candidate}
                  isExpanded={expandedId === candidate.candidateId}
                  onToggle={() => toggleExpand(candidate.candidateId)}
                />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Setup / Launch view ────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground px-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-7 h-7 text-accent" /> AI Candidate Screening
          </h1>
          <p className="text-muted-foreground mt-1">
            Gemini AI will analyze all candidates and rank the best matches for{' '}
            <span className="text-foreground font-semibold">{job.title}</span>
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Job summary card */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4">
            Job Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Title</p>
              <p className="font-semibold text-foreground">{job.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-semibold text-foreground">{job.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Experience Required</p>
              <p className="font-semibold text-foreground">{job.experience}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-semibold text-foreground">{job.location}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground mb-1">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {job.skillsNeeded.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Config card */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4">
            Screening Settings
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Shortlist Size (Top N candidates)
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTopN(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${topN === n
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Top {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Skills Match — <span className="text-foreground font-semibold">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Work Experience — <span className="text-foreground font-semibold">30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Education & Certs — <span className="text-foreground font-semibold">20%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Projects — <span className="text-foreground font-semibold">15%</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Availability & Location — <span className="text-foreground font-semibold">10%</span>
              </div>
            </div>

            {candidateCount !== null && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-bold">{candidateCount}</span> candidate
                  {candidateCount !== 1 ? 's' : ''} will be analyzed
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Progress bar (visible while running) */}
        {isRunning && (
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Gemini AI is working…</p>
                <p className="text-xs text-muted-foreground">{progressLabel}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">{progress}%</p>
          </Card>
        )}

        {/* CTA */}
        {!isRunning && (
          <Button
            className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground gap-3 rounded-xl shadow-lg shadow-accent/20"
            onClick={() => runScreening(true)}
            disabled={candidateCount === 0}
          >
            <Sparkles className="w-5 h-5" />
            {candidateCount === 0
              ? 'No Candidates to Screen'
              : `Run AI Screening on ${candidateCount ?? '...'} Candidate${candidateCount !== 1 ? 's' : ''}`}
          </Button>
        )}

        {candidateCount === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Add candidates to this job first before running AI screening.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
