'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, Mail, Phone, Briefcase } from 'lucide-react';

export default function CandidatesPage() {
  const [candidates] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      experience: 6,
      skills: ['React', 'TypeScript', 'Node.js'],
      education: 'B.S. Computer Science',
      appliedDate: '2024-03-20',
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      phone: '+1 (555) 234-5678',
      experience: 4,
      skills: ['React', 'Python', 'AWS'],
      education: 'M.S. Computer Science',
      appliedDate: '2024-03-19',
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      phone: '+1 (555) 345-6789',
      experience: 8,
      skills: ['React', 'Vue', 'GraphQL', 'Docker'],
      education: 'B.S. Software Engineering',
      appliedDate: '2024-03-18',
    },
    {
      id: '4',
      name: 'Alex Kumar',
      email: 'alex.kumar@example.com',
      phone: '+1 (555) 456-7890',
      experience: 3,
      skills: ['JavaScript', 'React', 'CSS'],
      education: 'Bootcamp Graduate',
      appliedDate: '2024-03-17',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

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

        {/* Candidates Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Experience</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Skills</th> */}
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
                      {/* <p className="text-xs text-muted-foreground">{candidate.education}</p> */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${candidate.email}`} className="hover:underline">
                            {candidate.email}
                          </a>
                        </div>
                        {/* <div className="flex items-center gap-2 text-sm text-foreground">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${candidate.phone}`} className="hover:underline">
                            {candidate.phone}
                          </a>
                        </div> */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">{candidate.experience} yrs</span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="px-2 py-1 text-xs text-muted-foreground">
                            +{candidate.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 text-xs text-muted-foreground">{candidate.appliedDate}</td>
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
      </div>
    </AppLayout>
  );
}
