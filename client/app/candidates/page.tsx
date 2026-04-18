'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search, Mail, Phone, Briefcase, Loader2 } from 'lucide-react';
import api from '@/lib/api-client';
import { Candidate } from '@/lib/types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
          <Link href="/candidates/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
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
            {/* Candidates Table */}
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
                        <td className="px-6 py-4">
                          <Link href={`/candidates/${candidate.id}`}>
                            <p className="font-medium text-accent hover:underline cursor-pointer">{candidate.name}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${candidate.email}`} className="hover:underline">
                                {candidate.email}
                              </a>
                            </div>
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
      </div>
    </AppLayout>
  );
}
