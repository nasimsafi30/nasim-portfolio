"use client";

import { useState, useEffect } from "react";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Globe, Bell, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    emailNotifications: true,
    autoSyncProjects: true,
    maintenanceMode: false,
    footerText: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setSettings({
          siteName: data.data.siteName || "Mohammad Nasim Safi - Portfolio",
          siteDescription: data.data.siteDescription || "",
          siteUrl: data.data.siteUrl || "",
          emailNotifications: data.data.emailNotifications ?? true,
          autoSyncProjects: data.data.autoSyncProjects ?? true,
          maintenanceMode: data.data.maintenanceMode ?? false,
          footerText: data.data.footerText || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
        fetchSettings();
      } else {
        toast.error("Failed to save");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your site settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Settings</>}
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />General
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-name" className="block text-sm font-medium mb-2">Site Name</label>
              <input
                id="site-name"
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                placeholder="Mohammad Nasim Safi - Portfolio"
              />
            </div>
            <div>
              <label htmlFor="site-description" className="block text-sm font-medium mb-2">Site Description</label>
              <textarea
                id="site-description"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Full Stack Developer & IT Engineer Portfolio"
              />
            </div>
            <div>
              <label htmlFor="site-url" className="block text-sm font-medium mb-2">Site URL</label>
              <input
                id="site-url"
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                placeholder="https://nasimsafi.com"
              />
            </div>
            <div>
              <label htmlFor="footer-text" className="block text-sm font-medium mb-2">Footer Text</label>
              <input
                id="footer-text"
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                placeholder="© 2024 Mohammad Nasim Safi. All rights reserved."
              />
            </div>
          </div>
        </LiquidCard>

        {/* Notifications */}
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-400" />Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive emails for contact form submissions</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? "bg-blue-500" : "bg-white/10"}`}
                aria-label={`Email notifications: ${settings.emailNotifications ? "on" : "off"}`}
                title="Toggle email notifications"
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.emailNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </LiquidCard>

        {/* Automation */}
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-400" />Automation
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <p className="font-medium">Auto-Sync GitHub Projects</p>
                <p className="text-sm text-muted-foreground">Automatically sync projects every 24 hours</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoSyncProjects: !settings.autoSyncProjects })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.autoSyncProjects ? "bg-blue-500" : "bg-white/10"}`}
                aria-label={`Auto-sync GitHub projects: ${settings.autoSyncProjects ? "on" : "off"}`}
                title="Toggle auto-sync"
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoSyncProjects ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </LiquidCard>

        {/* Maintenance */}
        <LiquidCard className="border-red-500/20">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />Maintenance
          </h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="font-medium text-red-400">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? "bg-red-500" : "bg-white/10"}`}
              aria-label={`Maintenance mode: ${settings.maintenanceMode ? "on" : "off"}`}
              title="Toggle maintenance mode"
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </LiquidCard>
      </div>
    </div>
  );
}