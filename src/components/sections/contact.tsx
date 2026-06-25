"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send, Loader2, CheckCircle2, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Message sent!");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "nasim.safi30@gmail.com", href: "mailto:nasim.safi30@gmail.com", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/15" },
    { icon: MapPin, label: "Location", value: "Nangarhar, Afghanistan", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/15" },
    { icon: Clock, label: "Response", value: "Within 24 hours", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/15" },
  ];

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <MessageSquare className="h-4 w-4" />
              Let&apos;s Connect
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Get In{" "}
              <span className="bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Have a project in mind? Let&apos;s work together to make it happen
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                {item.href ? (
                  <a href={item.href} className="block">
                    <LiquidCard className={`flex items-center gap-4 p-5 group border ${item.borderColor} hover:border-foreground/20 transition-all duration-300`}>
                      <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="font-semibold text-sm mt-0.5 group-hover:text-foreground transition-colors">{item.value}</p>
                      </div>
                    </LiquidCard>
                  </a>
                ) : (
                  <LiquidCard className={`flex items-center gap-4 p-5 group border ${item.borderColor}`}>
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                    </div>
                  </LiquidCard>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <LiquidCard className="p-5 border border-emerald-500/15 bg-emerald-500/5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-emerald-500 dark:text-emerald-400">Available for Opportunities</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Open to freelance & full-time roles</p>
                  </div>
                </div>
              </LiquidCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <LiquidCard className="p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {sent ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                      <CheckCircle2 className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground text-lg">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
                    <Button onClick={() => setSent(false)} variant="ghost" className="mt-8">Send Another Message</Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Full Name <span className="text-red-400">*</span></label>
                        <input id="contact-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 bg-foreground/3 border border-foreground/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-sm" placeholder="John Doe" title="Your name" required />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email <span className="text-red-400">*</span></label>
                        <input id="contact-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 bg-foreground/3 border border-foreground/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-sm" placeholder="john@example.com" title="Your email" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">Subject</label>
                      <input id="contact-subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-foreground/3 border border-foreground/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-sm" placeholder="What's this about?" title="Subject" />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message <span className="text-red-400">*</span></label>
                      <textarea id="contact-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                        className="w-full px-4 py-3 bg-foreground/3 border border-foreground/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors resize-none text-sm"
                        placeholder="Tell me about your project, idea, or just say hello..." title="Your message" required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full group gap-2 bg-linear-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25" size="lg">
                      {loading ? (
                        <><Loader2 className="h-5 w-5 animate-spin" />Sending Message...</>
                      ) : (
                        <>Send Message<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </LiquidCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}