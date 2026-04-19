'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateFormSchema, type CandidateFormData } from '@/lib/schemas';
import { useState } from 'react';
import {
  X, Plus, ChevronRight, ChevronLeft, User, Zap, Briefcase,
  GraduationCap, Award, FolderOpen, Clock, Link as LinkIcon,
  Check
} from 'lucide-react';

interface CandidateFormProps {
  onSubmit: (data: CandidateFormData) => void;
  isSubmitting?: boolean;
}

const TABS = [
  { id: 0, label: 'Basic Info', icon: User },
  { id: 1, label: 'Skills & Languages', icon: Zap },
  { id: 2, label: 'Work', icon: Briefcase },
  { id: 3, label: 'Education', icon: GraduationCap },
  { id: 4, label: 'Certifications', icon: Award },
  { id: 5, label: 'Projects', icon: FolderOpen },
  { id: 6, label: 'Availability', icon: Clock },
  { id: 7, label: 'Social Links', icon: LinkIcon },
];

const inputCls = 'bg-input border-border text-foreground placeholder:text-muted-foreground w-full';
const labelCls = 'block text-sm font-medium text-foreground mb-1';
const errorCls = 'text-red-400 text-xs mt-1';

/* ─── small reusable tag-chip input ─── */
function TagInput({
  tags, onAdd, onRemove, placeholder,
}: { tags: string[]; onAdd: (v: string) => void; onRemove: (i: number) => void; placeholder?: string }) {
  const [val, setVal] = useState('');
  const add = () => { if (val.trim()) { onAdd(val.trim()); setVal(''); } };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? 'Type and press Enter'}
          className={inputCls} />
        <Button type="button" variant="outline" onClick={add} className="border-border shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
              {t}
              <button type="button" onClick={() => onRemove(i)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-foreground border-b border-border pb-2 mb-4">{children}</h3>
  );
}

export function CandidateForm({ onSubmit, isSubmitting = false }: CandidateFormProps) {
  const [activeTab, setActiveTab] = useState(0);

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', headline: '', bio: '', location: '',
      skills: [],
      languages: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      availability: { status: 'Available', type: 'Full-time', startDate: '' },
      socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '', other: '' },
    },
    mode: 'onTouched',
  });

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, getValues } = form;

  /* ── field arrays ── */
  const skillsArr = useFieldArray({ control, name: 'skills' });
  const langsArr = useFieldArray({ control, name: 'languages' });
  const expArr = useFieldArray({ control, name: 'experience' });
  const eduArr = useFieldArray({ control, name: 'education' });
  const certArr = useFieldArray({ control, name: 'certifications' });
  const projArr = useFieldArray({ control, name: 'projects' });

  /* ────── tab renderers ────── */

  /* 3.1 */
  const Tab1 = () => (
    <div className="space-y-5">
      <SectionHeading>Basic Information</SectionHeading>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First Name *</label>
          <Input {...register('firstName')} placeholder="e.g. Sarah" className={inputCls} />
          {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Last Name *</label>
          <Input {...register('lastName')} placeholder="e.g. Johnson" className={inputCls} />
          {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <Input {...register('email')} type="email" placeholder="sarah@example.com" className={inputCls} />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Headline *</label>
        <Input {...register('headline')} placeholder='e.g. "Backend Engineer – Node.js & AI Systems"' className={inputCls} />
        {errors.headline && <p className={errorCls}>{errors.headline.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Location *</label>
        <Input {...register('location')} placeholder="e.g. Kigali, Rwanda" className={inputCls} />
        {errors.location && <p className={errorCls}>{errors.location.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Bio</label>
        <textarea
          {...register('bio')}
          rows={4}
          placeholder="Short professional biography..."
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>
    </div>
  );

  /* 3.2 */
  const Tab2 = () => (
    <div className="space-y-8">
      {/* Skills */}
      <div>
        <SectionHeading>Skills</SectionHeading>
        {skillsArr.fields.length === 0 && (
          <p className="text-muted-foreground text-sm mb-3">No skills added yet.</p>
        )}
        <div className="space-y-3 mb-4">
          {skillsArr.fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-muted/40 border border-border">
              <div className="col-span-4">
                <label className={labelCls}>Skill</label>
                <Input {...register(`skills.${idx}.name`)} placeholder="e.g. Node.js" className={inputCls} />
                {errors.skills?.[idx]?.name && <p className={errorCls}>{errors.skills[idx]?.name?.message}</p>}
              </div>
              <div className="col-span-4">
                <label className={labelCls}>Level</label>
                <select {...register(`skills.${idx}.level`)}
                  className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground">
                  <option value="">Select...</option>
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {errors.skills?.[idx]?.level && <p className={errorCls}>{errors.skills[idx]?.level?.message}</p>}
              </div>
              <div className="col-span-3">
                <label className={labelCls}>Yrs Exp.</label>
                <Input {...register(`skills.${idx}.yearsOfExperience`)} type="number" min={0} placeholder="0" className={inputCls} />
              </div>
              <div className="col-span-1 flex justify-end">
                <button type="button" onClick={() => skillsArr.remove(idx)}
                  className="text-muted-foreground hover:text-red-400 mt-5">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => skillsArr.append({ name: '', level: 'Intermediate', yearsOfExperience: 0 })}
          className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
        {errors.skills && typeof errors.skills.message === 'string' && (
          <p className={errorCls}>{errors.skills.message}</p>
        )}
      </div>

      {/* Languages */}
      <div>
        <SectionHeading>Languages</SectionHeading>
        {langsArr.fields.length === 0 && (
          <p className="text-muted-foreground text-sm mb-3">No languages added yet.</p>
        )}
        <div className="space-y-3 mb-4">
          {langsArr.fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-muted/40 border border-border">
              <div className="col-span-5">
                <label className={labelCls}>Language</label>
                <Input {...register(`languages.${idx}.name`)} placeholder="e.g. English" className={inputCls} />
              </div>
              <div className="col-span-6">
                <label className={labelCls}>Proficiency</label>
                <select {...register(`languages.${idx}.proficiency`)}
                  className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground">
                  <option value="">Select...</option>
                  {['Basic', 'Conversational', 'Fluent', 'Native'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 flex justify-end">
                <button type="button" onClick={() => langsArr.remove(idx)}
                  className="text-muted-foreground hover:text-red-400 mt-5">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => langsArr.append({ name: '', proficiency: 'Fluent' })}
          className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10">
          <Plus className="w-4 h-4" /> Add Language
        </Button>
      </div>
    </div>
  );

  /* 3.3 */
  const Tab3 = () => (
    <div className="space-y-4">
      <SectionHeading>Work Experience</SectionHeading>
      {expArr.fields.length === 0 && (
        <p className="text-muted-foreground text-sm mb-3">No experience entries yet.</p>
      )}
      {expArr.fields.map((field, idx) => {
        const isCurrent = watch(`experience.${idx}.isCurrent`);
        const techTags: string[] = watch(`experience.${idx}.technologies`) ?? [];
        return (
          <div key={field.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-accent">Experience #{idx + 1}</span>
              <button type="button" onClick={() => expArr.remove(idx)} className="text-muted-foreground hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Company *</label>
                <Input {...register(`experience.${idx}.company`)} placeholder="Company Name" className={inputCls} />
                {errors.experience?.[idx]?.company && <p className={errorCls}>{errors.experience[idx]?.company?.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Role *</label>
                <Input {...register(`experience.${idx}.role`)} placeholder="Backend Engineer" className={inputCls} />
                {errors.experience?.[idx]?.role && <p className={errorCls}>{errors.experience[idx]?.role?.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start Date * (YYYY-MM)</label>
                <Input {...register(`experience.${idx}.startDate`)} placeholder="2021-06" className={inputCls} />
                {errors.experience?.[idx]?.startDate && <p className={errorCls}>{errors.experience[idx]?.startDate?.message}</p>}
              </div>
              <div>
                <label className={labelCls}>End Date (YYYY-MM)</label>
                <Input {...register(`experience.${idx}.endDate`)} placeholder="Present" disabled={isCurrent} className={inputCls} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`isCurrent-${idx}`} {...register(`experience.${idx}.isCurrent`)}
                className="accent-accent w-4 h-4" />
              <label htmlFor={`isCurrent-${idx}`} className="text-sm text-foreground">Currently working here</label>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea {...register(`experience.${idx}.description`)} rows={3}
                placeholder="Key responsibilities and achievements..."
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
            </div>
            <div>
              <label className={labelCls}>Technologies Used</label>
              <TagInput
                tags={techTags}
                onAdd={v => setValue(`experience.${idx}.technologies`, [...techTags, v])}
                onRemove={i => setValue(`experience.${idx}.technologies`, techTags.filter((_, ti) => ti !== i))}
                placeholder="e.g. Node.js, PostgreSQL"
              />
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={() => expArr.append({
        company: '', role: '', startDate: '', endDate: '', description: '', technologies: [], isCurrent: false,
      })} className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10 w-full">
        <Plus className="w-4 h-4" /> Add Work Experience
      </Button>
      {errors.experience && typeof errors.experience.message === 'string' && (
        <p className={errorCls}>{errors.experience.message}</p>
      )}
    </div>
  );

  /* 3.4 */
  const Tab4 = () => (
    <div className="space-y-4">
      <SectionHeading>Education</SectionHeading>
      {eduArr.fields.length === 0 && (
        <p className="text-muted-foreground text-sm mb-3">No education entries yet.</p>
      )}
      {eduArr.fields.map((field, idx) => (
        <div key={field.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-accent">Education #{idx + 1}</span>
            <button type="button" onClick={() => eduArr.remove(idx)} className="text-muted-foreground hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Institution *</label>
              <Input {...register(`education.${idx}.institution`)} placeholder="University Name" className={inputCls} />
              {errors.education?.[idx]?.institution && <p className={errorCls}>{errors.education[idx]?.institution?.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Degree *</label>
              <Input {...register(`education.${idx}.degree`)} placeholder="Bachelor's" className={inputCls} />
              {errors.education?.[idx]?.degree && <p className={errorCls}>{errors.education[idx]?.degree?.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Field of Study</label>
            <Input {...register(`education.${idx}.fieldOfStudy`)} placeholder="Computer Science" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Year</label>
              <Input {...register(`education.${idx}.startYear`)} type="number" placeholder="2019" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Year</label>
              <Input {...register(`education.${idx}.endYear`)} type="number" placeholder="2023" className={inputCls} />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => eduArr.append({
        institution: '', degree: '', fieldOfStudy: '', startYear: undefined, endYear: undefined,
      })} className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10 w-full">
        <Plus className="w-4 h-4" /> Add Education
      </Button>
      {errors.education && typeof errors.education.message === 'string' && (
        <p className={errorCls}>{errors.education.message}</p>
      )}
    </div>
  );

  /* 3.5 */
  const Tab5 = () => (
    <div className="space-y-4">
      <SectionHeading>Certifications</SectionHeading>
      {certArr.fields.length === 0 && (
        <p className="text-muted-foreground text-sm mb-3">No certifications added yet.</p>
      )}
      {certArr.fields.map((field, idx) => (
        <div key={field.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-accent">Certification #{idx + 1}</span>
            <button type="button" onClick={() => certArr.remove(idx)} className="text-muted-foreground hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Certification Name *</label>
              <Input {...register(`certifications.${idx}.name`)} placeholder="AWS Certified Developer" className={inputCls} />
              {errors.certifications?.[idx]?.name && <p className={errorCls}>{errors.certifications[idx]?.name?.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Issuer *</label>
              <Input {...register(`certifications.${idx}.issuer`)} placeholder="Amazon" className={inputCls} />
              {errors.certifications?.[idx]?.issuer && <p className={errorCls}>{errors.certifications[idx]?.issuer?.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Issue Date (YYYY-MM)</label>
            <Input {...register(`certifications.${idx}.issueDate`)} placeholder="2023-06" className={inputCls} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => certArr.append({
        name: '', issuer: '', issueDate: '',
      })} className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10 w-full">
        <Plus className="w-4 h-4" /> Add Certification
      </Button>
    </div>
  );

  /* 3.6 */
  const Tab6 = () => (
    <div className="space-y-4">
      <SectionHeading>Projects</SectionHeading>
      {projArr.fields.length === 0 && (
        <p className="text-muted-foreground text-sm mb-3">No projects added yet.</p>
      )}
      {projArr.fields.map((field, idx) => {
        const techTags: string[] = watch(`projects.${idx}.technologies`) ?? [];
        return (
          <div key={field.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-accent">Project #{idx + 1}</span>
              <button type="button" onClick={() => projArr.remove(idx)} className="text-muted-foreground hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Project Name *</label>
                <Input {...register(`projects.${idx}.name`)} placeholder="AI Recruitment System" className={inputCls} />
                {errors.projects?.[idx]?.name && <p className={errorCls}>{errors.projects[idx]?.name?.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Your Role</label>
                <Input {...register(`projects.${idx}.role`)} placeholder="Backend Engineer" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea {...register(`projects.${idx}.description`)} rows={2}
                placeholder="Brief project description..."
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
            </div>
            <div>
              <label className={labelCls}>Technologies</label>
              <TagInput
                tags={techTags}
                onAdd={v => setValue(`projects.${idx}.technologies`, [...techTags, v])}
                onRemove={i => setValue(`projects.${idx}.technologies`, techTags.filter((_, ti) => ti !== i))}
                placeholder="e.g. Next.js, Gemini API"
              />
            </div>
            <div>
              <label className={labelCls}>Project Link</label>
              <Input {...register(`projects.${idx}.link`)} type="url" placeholder="https://..." className={inputCls} />
              {errors.projects?.[idx]?.link && <p className={errorCls}>{errors.projects[idx]?.link?.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start Date (YYYY-MM)</label>
                <Input {...register(`projects.${idx}.startDate`)} placeholder="2023-01" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date (YYYY-MM)</label>
                <Input {...register(`projects.${idx}.endDate`)} placeholder="2023-12" className={inputCls} />
              </div>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={() => projArr.append({
        name: '', description: '', technologies: [], role: '', link: '', startDate: '', endDate: '',
      })} className="gap-2 border-dashed border-accent text-accent hover:bg-accent/10 w-full">
        <Plus className="w-4 h-4" /> Add Project
      </Button>
      {errors.projects && typeof errors.projects.message === 'string' && (
        <p className={errorCls}>{errors.projects.message}</p>
      )}
    </div>
  );

  /* 3.7 */
  const Tab7 = () => (
    <div className="space-y-5">
      <SectionHeading>Availability</SectionHeading>
      <div>
        <label className={labelCls}>Status *</label>
        <select {...register('availability.status')}
          className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground">
          {['Available', 'Open to Opportunities', 'Not Available'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.availability?.status && <p className={errorCls}>{errors.availability.status.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Employment Type</label>
        <select {...register('availability.type')}
          className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground">
          <option value="">Select...</option>
          {['Full-time', 'Part-time', 'Contract'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Available From</label>
        <Input {...register('availability.startDate')} type="date" className={inputCls} />
      </div>
    </div>
  );

  /* 3.8 */
  const Tab8 = () => (
    <div className="space-y-5">
      <SectionHeading>Social Links</SectionHeading>
      {[
        { key: 'linkedin' as const, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
        { key: 'github' as const, label: 'GitHub', placeholder: 'https://github.com/...' },
        { key: 'portfolio' as const, label: 'Portfolio', placeholder: 'https://yoursite.com' },
        { key: 'twitter' as const, label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
        { key: 'other' as const, label: 'Other', placeholder: 'https://...' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className={labelCls}>{label}</label>
          <Input {...register(`socialLinks.${key}`)} type="url" placeholder={placeholder} className={inputCls} />
          {errors.socialLinks?.[key] && <p className={errorCls}>{errors.socialLinks[key]?.message}</p>}
        </div>
      ))}
    </div>
  );

  const tabContent = [<Tab1 />, <Tab2 />, <Tab3 />, <Tab4 />, <Tab5 />, <Tab6 />, <Tab7 />, <Tab8 />];

  const handleFormSubmit = (data: CandidateFormData) => {
    onSubmit(data);
  };

  const goNext = () => setActiveTab(t => Math.min(t + 1, TABS.length - 1));
  const goPrev = () => setActiveTab(t => Math.max(t - 1, 0));

  return (
    <div className="w-full">
      {/* ── Progress steps ── */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-1 bg-muted/50 rounded-xl p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDone = activeTab > tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                  ${isActive ? 'bg-accent text-accent-foreground shadow' : isDone ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="p-6 bg-card border-border min-h-[420px]">
          {tabContent[activeTab]}
        </Card>

        {/* ── Navigation ── */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={activeTab === 0}
            className="gap-2 border-border"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-xs text-muted-foreground font-medium">
            Step {activeTab + 1} of {TABS.length}
          </span>

          {activeTab < TABS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <><Check className="w-4 h-4" /> Save Candidate</>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
