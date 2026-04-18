'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFormSchema, type JobFormData } from '@/lib/schemas';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

export function JobForm({ onSubmit }: JobFormProps) {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [currentRequirement, setCurrentRequirement] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      requirements: [],
    },
  });

  const handleAddRequirement = () => {
    if (currentRequirement.trim()) {
      const newRequirements = [...requirements, currentRequirement];
      setRequirements(newRequirements);
      setValue('requirements', newRequirements, { shouldValidate: true });
      setCurrentRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    setValue('requirements', newRequirements, { shouldValidate: true });
  };

  const handleFormSubmit = (data: JobFormData) => {
    onSubmit({
      ...data,
      requirements,
    });
    reset();
    setRequirements([]);
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Create New Job</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Job Title *
          </label>
          <Input
            id="title"
            placeholder="e.g., Senior React Developer"
            {...register('title')}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            {...register('description')}
            rows={6}
            className="w-full bg-input border border-border text-foreground placeholder:text-muted-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Location & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location *
            </label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              {...register('location')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-foreground mb-2">
              Department *
            </label>
            <Input
              id="department"
              placeholder="e.g., Engineering"
              {...register('department')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department.message}</p>}
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-foreground mb-2">
              Min Salary (USD)
            </label>
            <Input
              id="salaryMin"
              type="number"
              placeholder="120000"
              {...register('salaryMin')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-foreground mb-2">
              Max Salary (USD)
            </label>
            <Input
              id="salaryMax"
              type="number"
              placeholder="180000"
              {...register('salaryMax')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Key Requirements *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="e.g., React, TypeScript, 3+ years experience"
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequirement();
                }
              }}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              onClick={handleAddRequirement}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {requirements.length > 0 && (
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted px-3 py-2 rounded-md"
                >
                  <span className="text-sm text-foreground">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {requirements.length === 0 && (
            <p className="text-red-400 text-sm">Add at least one requirement</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
        >
          Create Job
        </Button>
      </form>
    </Card>
  );
}
