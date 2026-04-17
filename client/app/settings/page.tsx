'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Save, Bell, Shield, Palette, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: 'Umurava Inc.',
    email: 'recruiter@umurava.com',
    fullName: 'John Doe',
    notifications: true,
    theme: 'dark',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your account and preferences</p>
        </div>

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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border text-foreground"
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

        {/* Notification Settings */}
        <Card className="p-8 bg-card border-border mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="font-semibold text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground mt-1">Receive updates on screening progress</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="w-5 h-5 accent-accent cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="font-semibold text-foreground">Screening Alerts</p>
                <p className="text-sm text-muted-foreground mt-1">Get notified when screening is complete</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-5 h-5 accent-accent cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="font-semibold text-foreground">Weekly Summary</p>
                <p className="text-sm text-muted-foreground mt-1">Receive weekly screening report</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-5 h-5 accent-accent cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-8 bg-card border-border mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
              <div className="flex gap-3">
                {[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, theme: option.value })}
                    className={`px-4 py-2 rounded-lg font-medium transition ${formData.theme === option.value
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted border border-border text-foreground hover:bg-muted/80'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
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
              <p className="text-foreground mb-4">Once you delete your account, there is no going back. Be certain.</p>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
