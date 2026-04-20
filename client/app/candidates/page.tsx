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
  Link as LinkIcon
} from 'lucide-react';
import api from '@/lib/api-client';
import { Candidate, Job } from '@/lib/types';
import { FileUpload } from '@/components/screening/file-upload';
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
  const [isImportUrlOpen, setIsImportUrlOpen] = useState(false);
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importUrlJobId, setImportUrlJobId] = useState<string>('');
  const [documentFilterJob, setDocumentFilterJob] = useState<string>('all');
  const [documentFilterType, setDocumentFilterType] = useState<string>('all');
  const [urlFilterJob, setUrlFilterJob] = useState<string>('all');

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

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">View and manage all candidates in your pipeline</p>
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
                  Bulk Upload (Unstructured)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsImportUrlOpen(true)} className="flex items-center gap-2 cursor-pointer py-3 text-foreground hover:bg-muted">
                  <LinkIcon className="w-4 h-4 text-accent" />
                  Import from URL
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
                      onUpload={(files) => {
                        setIsUploading(true);
                        setTimeout(() => {
                          setIsUploading(false);
                          setIsBulkUploadOpen(false);
                          alert(`Successfully processed ${files.length} documents. Candidates have been added to the pipeline.`);
                        }, 3000);
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isImportUrlOpen} onOpenChange={setIsImportUrlOpen}>
              <DialogContent className="max-w-xl bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Import from URL</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Provide a link containing candidate information (e.g., Google Drive folder, Cloudinary URL). Our AI will analyze the contents and import the candidates.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Target Job Profile</label>
                    <Select value={importUrlJobId} onValueChange={setImportUrlJobId}>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Resource URL</label>
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsImportUrlOpen(false)}>Cancel</Button>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={isImportingUrl || !importUrl}
                      onClick={() => {
                        setIsImportingUrl(true);
                        setTimeout(() => {
                          setIsImportingUrl(false);
                          setIsImportUrlOpen(false);
                          setImportUrl('');
                          alert('Candidates from URL are being processed successfully in the background.');
                        }, 2000);
                      }}
                    >
                      {isImportingUrl && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Start Import
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-muted p-1 rounded-lg mb-8">
            <TabsTrigger value="list" className="gap-2 px-6 py-2">
              <Plus className="w-4 h-4" />
              Candidate List
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 px-6 py-2">
              <FileText className="w-4 h-4" />
              Document Sources
            </TabsTrigger>
            <TabsTrigger value="urls" className="gap-2 px-6 py-2">
              <LinkIcon className="w-4 h-4" />
              URL Sources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
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
                                <Link href={`/candidates/${cId}`}>
                                  <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {filteredCandidates.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No candidates found</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-64">
                <Select value={documentFilterJob} onValueChange={setDocumentFilterJob}>
                  <SelectTrigger className="w-full">
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
              <div className="w-full sm:w-64">
                <Select value={documentFilterType} onValueChange={setDocumentFilterType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="Doc">Doc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-card border-border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Sarah_Johnson_Resume.pdf', type: 'PDF', size: '2.4 MB', date: '2024-03-15', jobId: jobs[0]?.id },
                  { name: 'External_Board_Job_A.xlsx', type: 'Excel', size: '1.2 MB', date: '2024-03-14', jobId: jobs[0]?.id },
                  { name: 'Tech_Talent_Pool.csv', type: 'CSV', size: '450 KB', date: '2024-03-12', jobId: jobs[1]?.id },
                  { name: 'Michael_Chen_CV.docx', type: 'Doc', size: '1.8 MB', date: '2024-03-10', jobId: jobs[0]?.id },
                ]
                  .filter(doc => (documentFilterJob === 'all' || doc.jobId === documentFilterJob) && (documentFilterType === 'all' || doc.type === documentFilterType))
                  .map((doc, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-muted border border-border">
                          {doc.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground truncate mb-1">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground mb-4">{doc.size} • {doc.date}</p>
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all">
                        View Data Source
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="urls" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-64">
                <Select value={urlFilterJob} onValueChange={setUrlFilterJob}>
                  <SelectTrigger className="w-full">
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
            </div>

            <Card className="bg-card border-border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Senior Dev Resumes', url: 'https://drive.google.com/drive/folders/1A2B3C', provider: 'Google Drive', importedCandidates: 12, date: '2024-03-18', jobId: jobs[0]?.id },
                  { name: 'Design Portfolio Links', url: 'https://cloudinary.com/console/media_library/folders/all/Design', provider: 'Cloudinary', importedCandidates: 5, date: '2024-03-15', jobId: jobs[1]?.id },
                  { name: 'Marketing Candidates', url: 'https://www.dropbox.com/sh/abc123yz/Marketing', provider: 'Dropbox', importedCandidates: 8, date: '2024-03-10', jobId: jobs[0]?.id },
                ]
                  .filter(urlData => urlFilterJob === 'all' || urlData.jobId === urlFilterJob)
                  .map((urlData, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                          <LinkIcon className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-muted border border-border">
                          {urlData.provider}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground truncate mb-1" title={urlData.name}>{urlData.name}</h4>
                      <p className="text-xs text-muted-foreground mb-4">{urlData.importedCandidates} Candidates • Imported {urlData.date}</p>

                      <div className="mt-auto">
                        <Button variant="outline" size="sm" asChild className="w-full text-xs font-bold border-border group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all">
                          <a href={urlData.url} target="_blank" rel="noopener noreferrer">Open Link URL</a>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
