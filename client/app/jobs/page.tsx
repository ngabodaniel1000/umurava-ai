'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Users, Calendar, Loader2 } from 'lucide-react';
import { useScreening } from '@/lib/screening-context';
import api from '@/lib/api-client';
import { Job } from '@/lib/types';

export default function JobsPage() {
  const { setActiveJob } = useScreening();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (fromDate || toDate) {
      const createdDate = new Date(job.createdAt);
      if (fromDate) {
        matchesDate = matchesDate && createdDate >= new Date(fromDate);
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && createdDate <= end;
      }
    }

    return matchesSearch && matchesDate;
  });

  const handleSelectJob = (job: Job) => {
    setActiveJob(job);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Jobs</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage and screen candidates for your open positions</p>
          </div>
          <Link href="/jobs/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4" />
              New Job
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-input border-border text-foreground w-full md:w-auto cursor-pointer"
            />
            <span className="text-muted-foreground text-sm font-medium">to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-input border-border text-foreground w-full md:w-auto cursor-pointer"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6 bg-card border-border hover:border-accent/50 transition cursor-pointer group">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition mb-3">
                    {job.title}
                  </h3>

                  <div className="space-y-3 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-muted text-foreground text-xs font-medium">
                        {job.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-accent">
                      <span>Experience: {job.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Link href={`/jobs/${job.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-border hover:bg-muted hover:border-accent transition-colors">
                        View
                      </Button>
                    </Link>
                    <Link href={`/jobs/${job.id}/screen`} className="flex-1">
                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => handleSelectJob(job)}
                      >
                        Screen
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
