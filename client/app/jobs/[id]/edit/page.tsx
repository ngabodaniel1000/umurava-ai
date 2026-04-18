'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { JobForm } from '@/components/forms/job-form';
import { useParams, useRouter } from 'next/navigation';
import { type JobFormData } from '@/lib/schemas';
import api from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditJobPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${jobId}`);
                setJob(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch job');
            } finally {
                setLoading(false);
            }
        };
        if (jobId) fetchJob();
    }, [jobId]);

    const handleSubmit = async (data: JobFormData) => {
        setSaving(true);
        setError('');

        try {
            await api.put(`/jobs/${jobId}`, {
                title: data.title,
                description: data.description,
                skillsNeeded: data.skillsNeeded,
                experience: data.experience,
                location: data.location,
                department: data.department,
                salaryRange: data.salaryMin || data.salaryMax ? {
                    min: data.salaryMin || 0,
                    max: data.salaryMax || 0,
                } : undefined,
            });

            router.push(`/jobs/${jobId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update job');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                </div>
            </AppLayout>
        );
    }

    if (error && !job) {
        return (
            <AppLayout>
                <div className="p-8 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-lg m-8">
                    <p>{error}</p>
                    <Button onClick={() => router.push('/jobs')} className="mt-4">Back to Jobs</Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/jobs/${jobId}`)}
                    className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel
                </Button>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground">Edit Job</h1>
                    <p className="text-muted-foreground mt-2">Update the position details</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive">
                        {error}
                    </div>
                )}

                <JobForm
                    onSubmit={handleSubmit}
                    mode="edit"
                    initialData={{
                        ...job,
                        salaryMin: job.salaryRange?.min,
                        salaryMax: job.salaryRange?.max,
                    }}
                />
            </div>
        </AppLayout>
    );
}
