'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Users, Zap, Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/users/profile');
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Umurava Ai</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-linear-to-b from-background to-muted/20 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            AI-Powered Talent Screening Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-3xl mx-auto">
            Discover the perfect candidates 10x faster. Umurava uses advanced AI to screen, score, and match top talent to your open positions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full sm:w-auto">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full sm:w-auto">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Powerful Features for Modern Recruiting
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Everything you need to streamline your hiring process and find top talent faster.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Intelligent Screening</h3>
              <p className="text-muted-foreground">
                AI-powered resume analysis that identifies key skills and qualifications automatically.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Match candidates to jobs based on skills, experience, and cultural fit with precision.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Data Insights</h3>
              <p className="text-muted-foreground">
                Comprehensive analytics to understand hiring trends and optimize recruitment strategy.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Share candidate feedback and collaborate seamlessly with your hiring team in real-time.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quality Candidates</h3>
              <p className="text-muted-foreground">
                Filter and screen only the most qualified candidates tailored to your job skills needed.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Leverage cutting-edge machine learning to continuously improve candidate matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            Why Choose Umurava?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Save 80% on Screening Time</h3>
                  <p className="text-muted-foreground">
                    Automate the entire initial screening process and focus on candidates that matter.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Reduce Bad Hires by 60%</h3>
                  <p className="text-muted-foreground">
                    AI-powered matching improves hire quality and reduces costly hiring mistakes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Fill Positions 3x Faster</h3>
                  <p className="text-muted-foreground">
                    Dramatically reduce time-to-hire and get your best people on board quicker.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Zero Setup Required</h3>
                  <p className="text-muted-foreground">
                    Start screening candidates in minutes. No complex integrations or training needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Enterprise Security</h3>
                  <p className="text-muted-foreground">
                    Your candidate data is protected with enterprise-grade encryption and compliance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">24/7 Support Team</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is always available to help you succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-accent py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent-foreground mb-2">10K+</div>
              <p className="text-accent-foreground/80">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-foreground mb-2">500K+</div>
              <p className="text-accent-foreground/80">Candidates Screened</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-foreground mb-2">95%</div>
              <p className="text-accent-foreground/80">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-foreground mb-2">2M+</div>
              <p className="text-accent-foreground/80">Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of companies using Umurava to find their next great hire.
          </p>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                Start Your Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">Umurava</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered talent screening for modern hiring teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Umurava. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
