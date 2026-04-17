'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, MapPin, Users, Calendar } from 'lucide-react';
import { useScreening } from '@/lib/screening-context';

export default function JobsPage() {
  const { setActiveJob } = useScreening();
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      candidates: 12,
      createdAt: '2024-03-15',
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      candidates: 8,
      createdAt: '2024-03-10',
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      candidates: 15,
      createdAt: '2024-03-05',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectJob = (job: any) => {
    setActiveJob({
      id: job.id,
      title: job.title,
      description: 'Job description goes here',
      requirements: ['Requirement 1', 'Requirement 2'],
      location: job.location,
      department: job.department,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(),
    });
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

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

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
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{job.candidates} candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{job.createdAt}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Link href={`/jobs/${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-border hover:bg-muted">
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
      </div>
    </AppLayout>
  );
}
