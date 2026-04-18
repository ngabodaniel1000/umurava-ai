'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateFormSchema, type CandidateFormData } from '@/lib/schemas';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CandidateFormProps {
  onSubmit: (data: CandidateFormData) => void;
  jobTitle?: string;
}

export function CandidateForm({ onSubmit, jobTitle }: CandidateFormProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      skills: [],
    },
  });

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      const newSkills = [...skills, currentSkill];
      setSkills(newSkills);
      setValue('skills', newSkills, { shouldValidate: true });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    setValue('skills', newSkills, { shouldValidate: true });
  };

  const handleFormSubmit = (data: CandidateFormData) => {
    onSubmit({
      ...data,
      skills,
    });
    reset();
    setSkills([]);
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-2">Add Candidate</h2>
      {jobTitle && <p className="text-muted-foreground mb-6">for {jobTitle}</p>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name *
          </label>
          <Input
            id="name"
            placeholder="e.g., Sarah Johnson"
            {...register('name')}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@example.com"
              {...register('email')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone *
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
              Years of Experience *
            </label>
            <Input
              id="experience"
              type="number"
              placeholder="5"
              {...register('experience')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>}
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-foreground mb-2">
              Education *
            </label>
            <Input
              id="education"
              placeholder="B.S. Computer Science"
              {...register('education')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.education && <p className="text-red-400 text-sm mt-1">{errors.education.message}</p>}
          </div>
        </div>

        {/* Resume URL */}
        <div>
          <label htmlFor="resumeUrl" className="block text-sm font-medium text-foreground mb-2">
            Resume URL
          </label>
          <Input
            id="resumeUrl"
            type="url"
            placeholder="https://example.com/resume.pdf"
            {...register('resumeUrl')}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Skills *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="e.g., React, TypeScript, AWS"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted px-3 py-2 rounded-md"
                >
                  <span className="text-sm text-foreground">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {skills.length === 0 && <p className="text-red-400 text-sm">Add at least one skill</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
        >
          Add Candidate
        </Button>
      </form>
    </Card>
  );
}
