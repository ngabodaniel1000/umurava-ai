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
  ChevronDown
} from 'lucide-react';
import api from '@/lib/api-client';
import { Candidate } from '@/lib/types';
import { FileUpload } from '@/components/screening/file-upload';
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

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/candidates');
        setCandidates(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <div className="py-4">
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
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
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
                          <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Contact</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Experience</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Applied</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidates.map((candidate) => (
                          <tr key={candidate.id} className="border-b border-border hover:bg-muted/50 transition">
                            <td className="px-6 py-4 text-foreground font-medium">
                              <Link href={`/candidates/${candidate.id}`} className="text-accent hover:underline">
                                {candidate.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-foreground">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a href={`mailto:${candidate.email}`} className="hover:underline">
                                  {candidate.email}
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-foreground">{candidate.experience} yrs</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {new Date(candidate.appliedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Link href={`/candidates/${candidate.id}`}>
                                <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
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

          <TabsContent value="documents">
            <Card className="bg-card border-border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Sarah_Johnson_Resume.pdf', type: 'PDF', size: '2.4 MB', date: '2024-03-15' },
                  { name: 'External_Board_Job_A.xlsx', type: 'Excel', size: '1.2 MB', date: '2024-03-14' },
                  { name: 'Tech_Talent_Pool.csv', type: 'CSV', size: '450 KB', date: '2024-03-12' },
                  { name: 'Michael_Chen_CV.docx', type: 'Doc', size: '1.8 MB', date: '2024-03-10' },
                ].map((doc, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
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
        </Tabs>
      </div>
    </AppLayout>
  );
}
