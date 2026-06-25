"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Mail, Send, Loader2, CheckCircle2, ArrowRight, Bell } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        toast.success("Subscribed!");
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (error) {
      toast.error("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <LiquidCard className="p-10 md:p-14 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/15 mb-6">
                <Bell className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Stay{" "}
                <span className="bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Updated</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Get the latest tech insights, tutorials, and updates delivered straight to your inbox.
              </p>

              {subscribed ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">Successfully Subscribed!</h3>
                  <p className="text-sm text-muted-foreground">Welcome aboard! Check your inbox for confirmation.</p>
                  <Button onClick={() => setSubscribed(false)} variant="ghost" className="mt-6">Subscribe Another Email</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-foreground/3 border border-foreground/10 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                      placeholder="Enter your email"
                      aria-label="Email address"
                      title="Your email address"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="group gap-2 bg-linear-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 px-6" size="lg">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><>Subscribe<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></></>}
                  </Button>
                </form>
              )}

              {!subscribed && (
                <p className="text-xs text-muted-foreground mt-6">No spam, unsubscribe anytime. I respect your privacy.</p>
              )}
            </div>
          </LiquidCard>
        </motion.div>
      </div>
    </section>
  );
}