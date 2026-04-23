'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Plus,
  Search,
  Mail,
  Briefcase,
  Loader2,
  Upload,
  FileText,
  ChevronDown,
  Edit,
  Trash2,
  MessageCircle
} from 'lucide-react';
import api from '@/lib/api-client';
import { Candidate, Job } from '@/lib/types';
import { FileUpload } from '@/components/screening/file-upload';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bulkUploadJobId, setBulkUploadJobId] = useState<string>('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [candidateFilterJob, setCandidateFilterJob] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, jobsRes] = await Promise.all([
          api.get('/candidates'),
          api.get('/jobs')
        ]);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCandidates = candidates.filter((c: any) => {
    const fullName = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase();
    const skillNames = (c.skills ?? []).map((s: any) =>
      typeof s === 'string' ? s.toLowerCase() : (s.name ?? '').toLowerCase()
    );
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (c.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.headline ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      skillNames.some((s: string) => s.includes(searchQuery.toLowerCase()));

    // Handle either string ID or populated object ID
    const cJobId = typeof c.job === 'string' ? c.job : (c.job?._id || c.job?.id);
    const matchesJob = candidateFilterJob === 'all' || cJobId === candidateFilterJob;

    let matchesDate = true;
    if (fromDate || toDate) {
      const applied = new Date(c.appliedDate);
      if (fromDate) {
        matchesDate = matchesDate && applied >= new Date(fromDate);
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && applied <= end;
      }
    }

    return matchesSearch && matchesJob && matchesDate;
  });

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    setIsUpdating(true);
    try {
      const cId = editingCandidate._id || editingCandidate.id;
      const response = await api.put(`/candidates/${cId}`, editingCandidate);
      setCandidates((prev) => prev.map((c) => (c._id || c.id) === cId ? response.data : c));
      setIsEditOpen(false);
      toast.success('Candidate updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update candidate');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await api.delete(`/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => (c._id || c.id) !== id));
      toast.success('Candidate deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete candidate');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Candidates</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm md:text-base">View and manage all candidates in your pipeline</p>
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20">
                {filteredCandidates.length} Total
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-11">
                  <Plus className="w-4 h-4" />
                  Add Candidate
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border w-56">
                <DropdownMenuItem asChild>
                  <Link href="/candidates/new" className="flex items-center gap-2 cursor-pointer py-3 text-foreground hover:bg-muted">
                    <Plus className="w-4 h-4 text-accent" />
                    Add Manually (Structured)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsBulkUploadOpen(true)} className="flex items-center gap-2 cursor-pointer py-3 text-foreground hover:bg-muted">
                  <Upload className="w-4 h-4 text-accent" />
                  Bulk Upload (Files)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
              <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Bulk Upload Candidates</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Upload unstructured resumes (PDF) or data sheets (Excel/CSV). Our AI will parse and normalize the data automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Target Job Profile</label>
                    <Select value={bulkUploadJobId} onValueChange={setBulkUploadJobId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Upload Files</label>
                    <FileUpload
                      isLoading={isUploading}
                      onUpload={async (files) => {
                        if (!bulkUploadJobId) {
                          toast.error('Please select a target job profile first');
                          return;
                        }

                        setIsUploading(true);
                        try {
                          const formData = new FormData();
                          files.forEach((file) => formData.append('files', file));

                          const response = await api.post(`/ai/parse-candidates/${bulkUploadJobId}`, formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          });

                          toast.success(`Successfully added ${response.data.addedCandidatesCount} candidates.`);
                          setIsBulkUploadOpen(false);

                          // Refresh candidates loop
                          const candidatesRes = await api.get('/candidates');
                          setCandidates(candidatesRes.data);
                        } catch (error: any) {
                          console.error('File upload error:', error);
                          toast.error(error.response?.data?.message || 'Failed to upload and parse files');
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="w-full md:w-64 shrink-0">
            <Select value={candidateFilterJob} onValueChange={setCandidateFilterJob}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-11 bg-input border-border text-foreground w-full md:w-auto cursor-pointer"
            />
            <span className="text-muted-foreground text-sm font-medium">to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-11 bg-input border-border text-foreground w-full md:w-auto cursor-pointer"
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
            <p className="text-muted-foreground">Loading candidates...</p>
          </div>
        ) : (
          <>
            <Card className="bg-card border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Headline & Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Skills</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Applied</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate: any) => {
                      const cId = candidate._id || candidate.id;
                      const fullName = `${candidate.firstName ?? ''} ${candidate.lastName ?? ''}`.trim() || candidate.name || 'Unknown';
                      const skillsCount = candidate.skills?.length ?? 0;
                      return (
                        <tr key={cId} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="px-6 py-4">
                            <Link href={`/candidates/${cId}`} className="text-accent hover:underline font-medium">
                              {fullName}
                            </Link>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${candidate.email}`} className="hover:underline">{candidate.email}</a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground font-medium truncate max-w-[200px]">{candidate.headline || '—'}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Briefcase className="w-3 h-3" />
                              {candidate.location || '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-accent">{skillsCount}</span>
                            <span className="text-xs text-muted-foreground ml-1">{skillsCount === 1 ? 'skill' : 'skills'}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">
                            {new Date(candidate.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                  setEditingCandidate(candidate);
                                  setIsEditOpen(true);
                                }}
                                title="Edit Candidate"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                                onClick={() => handleDeleteCandidate(cId)}
                                title="Delete Candidate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Edit Candidate Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">Edit Candidate</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateCandidate} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</label>
                      <Input
                        value={editingCandidate?.firstName || ''}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, firstName: e.target.value })}
                        className="h-11 bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</label>
                      <Input
                        value={editingCandidate?.lastName || ''}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, lastName: e.target.value })}
                        className="h-11 bg-input border-border"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      value={editingCandidate?.email || ''}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                      className="h-11 bg-input border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Headline</label>
                    <Input
                      value={editingCandidate?.headline || ''}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, headline: e.target.value })}
                      className="h-11 bg-input border-border"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
                    <Input
                      value={editingCandidate?.location || ''}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, location: e.target.value })}
                      className="h-11 bg-input border-border"
                      placeholder="e.g. Kigali, Rwanda"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-11 px-6">
                      Cancel
                    </Button>
                    <Button type="submit" className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </AppLayout>
  );
}
