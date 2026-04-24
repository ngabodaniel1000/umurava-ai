'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Save, Shield, LogOut, Loader2, Trash2, AlertTriangle, X } from 'lucide-react';
import api from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    fullName: '',
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const CONFIRM_PHRASE = 'delete my account';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setFormData({
          fullName: data.name,
          email: data.email,
          companyName: data.company,
        });
      } catch (err: any) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaved(false);
    setError('');
    try {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError('Failed to update settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== CONFIRM_PHRASE) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete('/users/account');
      // Redirect to login after successful deletion
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your account and preferences</p>
        </div>

        {error && (
          <div className="p-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-center">
            {error}
          </div>
        )}

        {/* Account Settings */}
        <Card className="p-6 md:p-8 bg-card border-border">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 md:w-6 md:h-6" />
            Account Settings
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-input border-border text-foreground opacity-60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                Company Name
              </label>
              <Input
                id="company"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 bg-red-500/5 border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <LogOut className="w-6 h-6" />
            Danger Zone
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-foreground mb-1">Once you delete your account, there is no going back. Be certain.</p>
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete your account, <strong className="text-red-400">all your job postings</strong>, and <strong className="text-red-400">all associated candidates</strong>.
              </p>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(''); }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning list */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 space-y-2">
              <p className="text-sm font-semibold text-red-400">The following will be permanently deleted:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Your user account and profile</li>
                <li>All job postings you created</li>
                <li>All candidates linked to those jobs</li>
              </ul>
            </div>

            {/* Confirm input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Type <span className="font-mono text-red-400">"{CONFIRM_PHRASE}"</span> to confirm
              </label>
              <Input
                id="delete-confirm-input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                className="bg-input border-border text-foreground"
                onKeyDown={(e) => { if (e.key === 'Enter' && deleteConfirmText.toLowerCase() === CONFIRM_PHRASE) handleDeleteAccount(); }}
              />
            </div>

            {deleteError && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {deleteError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent/10 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.toLowerCase() !== CONFIRM_PHRASE || deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete Forever</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
