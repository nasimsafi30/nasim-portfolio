"use client";

import { useState } from "react";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2, Eye, EyeOff, AlertCircle, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => { window.location.replace("/admin"); }, 500);
      } else {
        setError(data.error || "Invalid email or password");
        setLoading(false);
      }
    } catch {
      setError("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
        </Link>

        <LiquidCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Login</span>
            </h1>
            <p className="text-muted-foreground text-sm">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Enter your email" required autoFocus />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Enter your password" required />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Signing in...</> : <><LogIn className="h-5 w-5 mr-2" />Sign In</>}
            </Button>
          </form>
        </LiquidCard>
      </div>
    </div>
  );
}