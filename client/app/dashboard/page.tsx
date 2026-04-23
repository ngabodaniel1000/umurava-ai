'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BarChart3, FileText, Users, TrendingUp, Plus, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { ActivityChart } from './activity-chart';
import { StatusChart } from './status-chart';
import { ScoreChart } from './score-chart';
import api from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentScreenings, setRecentScreenings] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent')
        ]);

        const statsData = [
          {
            label: 'Total Jobs',
            value: statsRes.data.totalJobs.toString(),
            icon: FileText,
            color: 'bg-blue-500/10 text-blue-400',
          },
          {
            label: 'Total Candidates',
            value: statsRes.data.totalCandidates.toString(),
            icon: Users,
            color: 'bg-purple-500/10 text-purple-400',
          },
          {
            label: 'Screenings Pending',
            value: statsRes.data.pendingScreenings.toString(),
            icon: BarChart3,
            color: 'bg-amber-500/10 text-amber-400',
          },
          {
            label: 'Avg Score',
            value: `${statsRes.data.averageScore}/10`,
            icon: TrendingUp,
            color: 'bg-green-500/10 text-green-400',
          },
        ];

        setStats(statsData);
        setRecentScreenings(recentRes.data);
        setActivityData(statsRes.data.activityData || []);
        setStatusData(statsRes.data.statusDistribution || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Welcome back! Here&apos;s your screening overview.</p>
          </div>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20">
              <Plus className="w-4 h-4" />
              New Job
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-5 md:p-6 bg-card border-border hover:border-accent/40 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs md:text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <Card className="xl:col-span-2 p-5 md:p-6 bg-card border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Screening Activity</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Candidate screenings over the last 7 days</p>
                  </div>
                </div>
                <div className="h-[300px] md:h-[350px] w-full">
                  <ActivityChart data={activityData} />
                </div>
              </Card>

              <Card className="p-5 md:p-6 bg-card border-border flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-foreground">Status Distribution</h2>
                  <p className="text-xs md:text-sm text-muted-foreground">Current status of all candidates</p>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                  <StatusChart data={statusData} />
                </div>
              </Card>
            </div>

            {/* Recent Screenings */}
            <Card className="bg-card border-border overflow-hidden">
              <div className="p-5 md:p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-foreground">Recent Screenings</h2>
                <Link href="/results" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Candidate</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentScreenings.map((screening) => (
                      <tr key={screening._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{screening.job?.title || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{screening.candidate ? `${screening.candidate.firstName} ${screening.candidate.lastName}` : 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-[100px] bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-accent h-full rounded-full"
                                style={{ width: `${screening.score * 10}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-foreground tabular-nums">
                              {screening.score}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                              screening.status === 'passed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            )}
                          >
                            {screening.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(screening.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
