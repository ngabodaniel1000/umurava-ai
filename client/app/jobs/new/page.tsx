'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { JobForm } from '@/components/forms/job-form';
import { useRouter } from 'next/navigation';
import { useScreening } from '@/lib/screening-context';
import { type JobFormData } from '@/lib/schemas';

export default function NewJobPage() {
  const router = useRouter();
  const { setActiveJob } = useScreening();

  const handleSubmit = (data: JobFormData) => {
    // Create job
    const newJob = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      department: data.department,
      salaryRange: data.salaryMin || data.salaryMax ? {
        min: data.salaryMin || 0,
        max: data.salaryMax || 0,
      } : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setActiveJob(newJob);
    router.push('/jobs');
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Job</h1>
          <p className="text-muted-foreground mt-2">Add a new position to your screening pipeline</p>
        </div>

        <JobForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
}
