'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import api from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users/login', { email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Umurava account</p>
        </div>

        <Card className="p-8 bg-card border border-border shadow-sm">
          {error && (
            <div className="mb-6 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>


        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent/80 transition-colors font-medium">
            Sign up
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 Umurava. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
