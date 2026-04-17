'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, Filter, Download, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function ResultsPage() {
  const [results] = useState([
    {
      id: '1',
      jobTitle: 'Senior React Developer',
      candidate: 'Sarah Johnson',
      score: 8.5,
      matchPercentage: 85,
      status: 'passed',
      date: '2024-03-20',
      skills: ['React', 'TypeScript', 'AWS'],
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      candidate: 'Mike Chen',
      score: 6.2,
      matchPercentage: 62,
      status: 'review',
      date: '2024-03-19',
      skills: ['Product Strategy', 'Analytics'],
    },
    {
      id: '3',
      jobTitle: 'UI/UX Designer',
      candidate: 'Emma Davis',
      score: 9.1,
      matchPercentage: 91,
      status: 'passed',
      date: '2024-03-18',
      skills: ['Figma', 'Design Systems', 'UX Research'],
    },
    {
      id: '4',
      jobTitle: 'Backend Engineer',
      candidate: 'Alex Kumar',
      score: 5.8,
      matchPercentage: 58,
      status: 'rejected',
      date: '2024-03-17',
      skills: ['Python', 'SQL'],
    },
    {
      id: '5',
      jobTitle: 'Senior React Developer',
      candidate: 'James Wilson',
      score: 7.9,
      matchPercentage: 79,
      status: 'passed',
      date: '2024-03-16',
      skills: ['React', 'Next.js', 'Node.js'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: results.length,
    passed: results.filter((r) => r.status === 'passed').length,
    review: results.filter((r) => r.status === 'review').length,
    rejected: results.filter((r) => r.status === 'rejected').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'review':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      case 'review':
        return 'bg-amber-500/20 text-amber-300';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Screening Results</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">View all AI screening results and decisions</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2 border-border hover:bg-muted">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Screened', value: stats.total, color: 'text-foreground' },
            { label: 'Passed', value: stats.passed, color: 'text-green-500' },
            { label: 'Under Review', value: stats.review, color: 'text-amber-500' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-500' },
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
              placeholder="Search by candidate or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-11 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === null ? 'default' : 'outline'}
              onClick={() => setFilterStatus(null)}
              className={cn(
                "flex-1 md:flex-none",
                filterStatus === null ? 'bg-accent text-accent-foreground' : 'border-border'
              )}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'passed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('passed')}
              className={cn(
                "flex-1 md:flex-none",
                filterStatus === 'passed' ? 'bg-green-600 text-white' : 'border-border hover:bg-muted'
              )}
            >
              Passed
            </Button>
            <Button
              variant={filterStatus === 'review' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('review')}
              className={cn(
                "flex-1 md:flex-none",
                filterStatus === 'review' ? 'bg-amber-600 text-white' : 'border-border hover:bg-muted'
              )}
            >
              Review
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('rejected')}
              className={cn(
                "flex-1 md:flex-none",
                filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'border-border hover:bg-muted'
              )}
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Results Table */}
        <Card className="bg-card border-border overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Match</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{result.candidate}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{result.jobTitle}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-accent tabular-nums">{result.score}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-accent h-full rounded-full"
                            style={{ width: `${result.matchPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {result.matchPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          getStatusColor(result.status)
                        )}>
                          {result.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{result.date}</td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border">
            {filteredResults.map((result) => (
              <div key={result.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-foreground">{result.candidate}</p>
                    <p className="text-sm text-muted-foreground">{result.jobTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent">{result.score}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Score</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">Match Prediction</span>
                    <span className="font-bold text-foreground">{result.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full"
                      style={{ width: `${result.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      getStatusColor(result.status)
                    )}>
                      {result.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{result.date}</span>
                    <Button size="sm" variant="outline" className="h-8 border-border">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
