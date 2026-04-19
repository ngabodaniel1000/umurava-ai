'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { CandidateForm } from '@/components/forms/candidate-form';
import { useRouter } from 'next/navigation';
import { type CandidateFormData } from '@/lib/schemas';
import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { Job } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function NewCandidatePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0]._id);
      } catch (err: any) {
        setError('Failed to fetch jobs. Please create a job first.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSubmit = async (data: CandidateFormData) => {
    if (!selectedJobId) {
      setError('Please select a job for this candidate');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/candidates', {
        ...data,
        jobId: selectedJobId,
      });
      router.push('/candidates');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Add Candidate</h1>
          <p className="text-muted-foreground mt-2">
            Create a structured talent profile — fill in each section and click <strong>Next</strong> to proceed
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Job selector */}
            <div className="bg-card p-5 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-semibold text-foreground shrink-0">
                🎯 Target Job *
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-foreground text-sm"
                disabled={submitting}
              >
                <option value="">Select a job...</option>
                {jobs.map((job: any) => (
                  <option key={job._id} value={job._id}>
                    {job.title} — {job.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Multi-tab form */}
            <CandidateForm onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
