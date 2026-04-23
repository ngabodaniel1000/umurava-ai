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
    TrendingUp,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api-client';

interface ShortlistedCandidate {
    rank: number;
    candidate: any;
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
    createdAt: string;
    shortlist: ShortlistedCandidate[];
}

// Color config with green for positive indicators
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
    const cfg = (recommendationConfig as any)[candidate.recommendation] || recommendationConfig['Consider'];
    const Icon = cfg.icon;

    return (
        <Card className="bg-card border-border transition-all duration-300 hover:shadow-md">
            <button
                onClick={onToggle}
                className="w-full p-5 flex items-center gap-4 text-left"
                aria-expanded={isExpanded}
            >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted border-border flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">#{candidate.rank}</span>
                </div>

                <ScoreRing score={candidate.matchScore} />

                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-foreground truncate">{candidate.candidateName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                            {candidate.recommendation}
                        </span>
                    </div>
                </div>

                <div className="flex-shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {isExpanded && (
                <div className="px-5 pb-5 space-y-4 pt-4 border-t border-border">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">
                            AI Reasoning
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{candidate.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-green-500 mb-2 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Strengths
                            </p>
                            <ul className="space-y-1.5">
                                {candidate.strengths?.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-widest text-blue-500 mb-2 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Gaps / Risks
                            </p>
                            {candidate.gaps?.length > 0 ? (
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

export default function JobSpecificResultsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const [data, setData] = useState<ScreeningData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobResults = async () => {
            try {
                const { data } = await api.get(`/ai/screen/${jobId}/results`);
                if (data && data.length > 0) {
                    setData(data[0]);
                    setExpandedId(data[0].shortlist?.[0]?.candidate?._id || null);
                } else {
                    setError('No screening results found for this job.');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchJobResults();
    }, [jobId]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading screening data...</p>
                </div>
            </AppLayout>
        );
    }

    if (error || !data) {
        return (
            <AppLayout>
                <div className="max-w-md mx-auto text-center py-32 space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <XCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Error Loading Results</h2>
                    <p className="text-muted-foreground">{error || 'Something went wrong.'}</p>
                    <Button onClick={() => router.push('/results')} variant="outline">
                        Back to All Results
                    </Button>
                </div>
            </AppLayout>
        );
    }

    const topCandidate = data.shortlist[0];
    const avgScore =
        Math.round(
            data.shortlist.reduce((s, c) => s + (c.matchScore || 0), 0) /
            data.shortlist.length
        ) || 0;

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/results')}
                            className="mb-3 gap-2 text-muted-foreground hover:text-foreground px-0 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Results
                        </Button>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                            <Brain className="w-7 h-7 text-green-500" /> {data.jobTitle}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Screening Date: {new Date(data.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2 font-bold text-xs">
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Summary stats - using green for positive metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            icon: Users,
                            label: 'Candidates Analyzed',
                            value: data.totalCandidatesAnalyzed,
                            color: 'text-blue-500',
                            bg: 'bg-blue-500/10',
                        },
                        {
                            icon: Trophy,
                            label: 'Shortlisted',
                            value: data.shortlistCount,
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
                        <Card key={stat.label} className="p-5 border-border bg-card rounded-xl">
                            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Disclaimer - using green accent */}
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
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" /> Ranked Shortlist
                    </h2>
                    <div className="space-y-4">
                        {data.shortlist.map((candidate) => (
                            <CandidateCard
                                key={candidate.candidate?._id || `${candidate.candidateName}-${candidate.rank}`}
                                candidate={candidate}
                                isExpanded={expandedId === (candidate.candidate?._id || `${candidate.candidateName}-${candidate.rank}`)}
                                onToggle={() => setExpandedId(prev => prev === (candidate.candidate?._id || `${candidate.candidateName}-${candidate.rank}`) ? null : (candidate.candidate?._id || `${candidate.candidateName}-${candidate.rank}`))}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}