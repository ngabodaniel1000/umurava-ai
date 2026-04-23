'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Search, Filter, Download, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api-client';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [jobs, setJobs] = useState<{ id: string, title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterJob, setFilterJob] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get('/screenings');
        setResults(data);

        const uniqueJobs = data.map((res: any) => ({
          id: res.job?._id || res.job,
          title: res.jobTitle || res.job?.title || 'Unknown Job'
        })).filter((v: any, i: number, a: any[]) => a.findIndex(t => t.id === v.id) === i);

        setJobs(uniqueJobs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleExportAll = () => {
    if (results.length === 0) return;

    const headers = ['Job Title', 'Total Screened', 'Shortlisted', 'Date'];
    const rows = results.map(r => [
      `"${(r.jobTitle || r.job?.title || 'Unknown').replace(/"/g, '""')}"`,
      r.totalCandidatesAnalyzed,
      r.shortlistCount,
      new Date(r.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all_screening_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('All results exported to CSV');
  };

  const filteredResults = results.filter((result) => {
    const jobTitle = result.jobTitle || result.job?.title || '';
    const matchesSearch = jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJob = !filterJob || (result.job?._id || result.job) === filterJob;
    return matchesSearch && matchesJob;
  });

  const stats = {
    totalJobs: results.length,
    totalScreened: results.reduce((acc, curr) => acc + (curr.totalCandidatesAnalyzed || 0), 0),
    totalShortlisted: results.reduce((acc, curr) => acc + (curr.shortlistCount || 0), 0),
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Screening Results</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">View all AI screening results by job</p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            onClick={handleExportAll}
          >
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Screened Jobs', value: stats.totalJobs, color: 'text-foreground' },
                { label: 'Total Candidates Screened', value: stats.totalScreened, color: 'text-accent' },
                { label: 'Total Shortlisted', value: stats.totalShortlisted, color: 'text-green-500' },
              ].map((stat, index) => (
                <Card key={index} className="p-4 bg-card border-border">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  placeholder="Search by job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-11 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div className="flex-shrink-0 w-full md:w-64">
                <select
                  value={filterJob || ''}
                  onChange={(e) => setFilterJob(e.target.value || null)}
                  className="w-full h-11 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 px-3"
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Table */}
            <Card className="bg-card border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Screened</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Shortlisted</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredResults.map((result) => (
                      <tr key={result._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">{result.jobTitle || result.job?.title || 'Unknown Job'}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{result.totalCandidatesAnalyzed} candidates</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-accent">{result.shortlistCount}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-left">
                          <Link href={`/results/${result.job?._id || result.job}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-accent hover:text-accent-foreground text-xs font-bold gap-2 transition-all"
                            >
                              View Results
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {filteredResults.length === 0 && (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No screened jobs found</p>
                <Link href="/jobs" className="mt-4">
                  <Button variant="link" className="text-accent font-bold">
                    Browse jobs to screen
                  </Button>
                </Link>
              </div>
            )}
          </>
        )
        }
      </div>
    </AppLayout>
  );
}
