'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { CandidateForm } from '@/components/forms/candidate-form';
import { useRouter } from 'next/navigation';
import { type CandidateFormData } from '@/lib/schemas';

export default function NewCandidatePage() {
  const router = useRouter();

  const handleSubmit = (data: CandidateFormData) => {
    // Create candidate
    console.log('New candidate:', data);
    router.push('/candidates');
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Add Candidate</h1>
          <p className="text-muted-foreground mt-2">Create a new candidate profile</p>
        </div>

        <CandidateForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
}
