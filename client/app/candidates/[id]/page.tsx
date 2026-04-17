'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, BookOpen, Award } from 'lucide-react';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  // Mock candidate data
  const candidate = {
    id: candidateId,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    experience: 6,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL'],
    education: 'B.S. Computer Science',
    appliedDate: '2024-03-20',
    location: 'San Francisco, CA',
    about:
      'Experienced React developer with a passion for building scalable web applications. Strong background in full-stack development and cloud technologies.',
    resumeUrl: 'https://example.com/resume-sarah-johnson.pdf',
  };

  return (
    <AppLayout>
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
                  <p className="text-muted-foreground mt-2">{candidate.experience} years of experience</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <p className="text-sm">Email</p>
                  </div>
                  <a href={`mailto:${candidate.email}`} className="text-accent hover:underline">
                    {candidate.email}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <p className="text-sm">Phone</p>
                  </div>
                  <a href={`tel:${candidate.phone}`} className="text-accent hover:underline">
                    {candidate.phone}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">Location</p>
                  </div>
                  <p className="font-semibold text-foreground">{candidate.location}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                <p className="text-foreground leading-relaxed">{candidate.about}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Education
                </h2>
                <p className="text-foreground">{candidate.education}</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold text-foreground mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Applied</p>
                  <p className="text-foreground font-medium">{candidate.appliedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Experience</p>
                  <p className="text-foreground font-medium">{candidate.experience} years</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {candidate.resumeUrl && (
                <Button
                  asChild
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full border-border hover:bg-muted">
                Screen Candidate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
