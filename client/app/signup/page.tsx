'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import api from '@/lib/api-client';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        role: 'recruiter'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (formData.password.length > 30) {
            setError('Password must be no more than 30 characters long');
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/users', formData);
            localStorage.setItem('user', JSON.stringify(data));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Navigation */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground">Umurava</span>
                </Link>
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join Umurava AI Screening platform</p>
                </div>

                <Card className="p-8 bg-card border border-border shadow-sm">
                    {error && (
                        <div className="mb-6 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="company" className="text-sm font-medium text-foreground">
                                Company Name
                            </label>
                            <Input
                                id="company"
                                placeholder="Acme Inc."
                                value={formData.company}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </Card>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-accent hover:text-accent/80 transition-colors font-medium">
                        Sign in
                    </Link>
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} {" "} Umurava AI. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
