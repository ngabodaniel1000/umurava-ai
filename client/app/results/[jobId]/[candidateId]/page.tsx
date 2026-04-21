'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { ArrowLeft, Loader2, Target, CheckCircle, AlertCircle, XCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CandidateResultPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const candidateId = params.candidateId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [candidateData, setCandidateData] = useState<any>(null);

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const { data } = await api.get(`/screenings?jobId=${jobId}`);
                const jobResult = data[0]; // expect the first one since it's filtered by job
                if (jobResult && jobResult.shortlist) {
                    const candidate = jobResult.shortlist.find((c: any) =>
                        c.candidate?._id === candidateId || c.candidate === candidateId
                    );
                    if (candidate) {
                        setCandidateData({ ...candidate, jobTitle: jobResult.job?.title || jobResult.jobTitle });
                    } else {
                        setError('Candidate screening not found in this job.');
                    }
                } else {
                    setError('Screening results for this job not found.');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch candidate details');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateData();
    }, [jobId, candidateId]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            </AppLayout>
        );
    }

    if (error || !candidateData) {
        return (
            <AppLayout>
                <div className="space-y-4 max-w-2xl mx-auto">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2 px-0 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                        {error || 'Candidate not found.'}
                    </div>
                </div>
            </AppLayout>
        )
    }

    // Same configurations as earlier pages
    const recommendationConfig: any = {
        'Highly Recommended': {
            icon: Trophy,
            color: 'text-yellow-400',
            badge: 'bg-yellow-400/20 text-yellow-300',
        },
        Recommended: {
            icon: CheckCircle,
            color: 'text-green-400',
            badge: 'bg-green-500/20 text-green-300',
        },
        Consider: {
            icon: AlertCircle,
            color: 'text-blue-400',
            badge: 'bg-blue-500/20 text-blue-300',
        },
        Borderline: {
            icon: XCircle,
            color: 'text-amber-400',
            badge: 'bg-amber-500/20 text-amber-300',
        },
    };

    const recType = candidateData.recommendation || 'Consider';
    const cfg = recommendationConfig[recType] || recommendationConfig['Consider'];
    const Icon = cfg.icon;

    const score = candidateData.matchScore || 0;
    const circumference = 2 * Math.PI * 46;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor =
        score >= 80
            ? '#facc15'
            : score >= 65
                ? '#4ade80'
                : score >= 50
                    ? '#60a5fa'
                    : '#fb923c';

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-4 px-0 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Results
                    </Button>
                    <div className="flex items-center gap-4 border-b border-border pb-6">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="46"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-foreground leading-none">{score}</span>
                                <span className="text-[10px] uppercase text-muted-foreground mt-1">Score</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                {candidateData.candidateName || candidateData.candidate?.firstName + ' ' + candidateData.candidate?.lastName}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Screened for <strong className="text-foreground font-semibold">{candidateData.jobTitle}</strong>
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", cfg.badge)}>
                                    <Icon className={cn("w-4 h-4", cfg.color)} />
                                    {recType}
                                </div>
                                <div className="text-xs uppercase font-bold tracking-wider px-2 py-1 bg-muted rounded-md text-muted-foreground">
                                    Rank #{candidateData.rank}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 py-4">
                    <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xs tracking-widest uppercase font-bold text-muted-foreground mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-accent" /> AI Reasoning
                        </h2>
                        <p className="text-foreground leading-relaxed text-sm md:text-base">
                            {candidateData.reasoning}
                        </p>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs tracking-widest uppercase font-bold text-green-400 flex items-center gap-2 mb-4">
                                <CheckCircle className="w-4 h-4" /> Strengths Identified
                            </h3>
                            {candidateData.strengths && candidateData.strengths.length > 0 ? (
                                <ul className="space-y-3">
                                    {candidateData.strengths.map((s: string, idx: number) => (
                                        <li key={idx} className="flex gap-3 text-sm text-foreground items-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                                            <span className="leading-relaxed">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No specific strengths identified.</p>
                            )}
                        </Card>

                        <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs tracking-widest uppercase font-bold text-amber-400 flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4" /> Gaps & Risks
                            </h3>
                            {candidateData.gaps && candidateData.gaps.length > 0 ? (
                                <ul className="space-y-3">
                                    {candidateData.gaps.map((g: string, idx: number) => (
                                        <li key={idx} className="flex gap-3 text-sm text-foreground items-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                            <span className="leading-relaxed">{g}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No major gaps identified.</p>
                            )}
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
