"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Download, Mail, MapPin, Globe, FileText, Printer, Briefcase, GraduationCap, Award, Star, Sparkles, ArrowRight } from "lucide-react";

export function CVSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const downloadCV = () => {
    const cvHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data?.name || "CV"}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a1a;background:#fff}h1{color:#2563eb}h2{color:#7c3aed;border-bottom:2px solid #e5e7eb;padding-bottom:8px}.skill-tag{display:inline-block;background:#eff6ff;color:#2563eb;padding:4px 12px;border-radius:20px;margin:3px;font-size:13px}.contact{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;color:#4b5563}.summary{background:#f8fafc;padding:20px;border-radius:12px;border-left:4px solid #2563eb;margin-bottom:20px}@media print{body{margin:0;padding:15px}}</style></head><body><h1>${data?.name || ""}</h1><p style="font-size:18px;color:#6b7280">${data?.title || ""}</p><div class="contact">${data?.email ? `<span>📧 ${data.email}</span>` : ""}${data?.phone ? `<span>📱 ${data.phone}</span>` : ""}${data?.location ? `<span>📍 ${data.location}</span>` : ""}</div><div class="summary"><h2>Professional Summary</h2><p>${data?.longBio || data?.bio || ""}</p></div><div>${data?.github ? `<a href="${data.github}" style="color:#2563eb">🔗 GitHub</a>` : ""}${data?.linkedin ? ` | <a href="${data.linkedin}" style="color:#2563eb">🔗 LinkedIn</a>` : ""}</div><p style="text-align:center;margin-top:30px;color:#9ca3af;font-size:12px">© ${new Date().getFullYear()} ${data?.name || ""}</p></body></html>`;

    const blob = new Blob([cvHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data?.name || "CV").replace(/\s+/g, "_")}_CV.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <section id="cv" className="py-32">
      <div className="container mx-auto px-4">
        <div className="h-96 bg-foreground/5 rounded-xl animate-pulse" />
      </div>
    </section>
  );

  const stats = [
    { icon: Briefcase, label: "Experience", value: "6+ Years", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: GraduationCap, label: "Education", value: "B.Sc. CS", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: Star, label: "Projects", value: "20+", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: Award, label: "Certifications", value: "CCNA, MTCNA", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <section id="cv" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <FileText className="h-4 w-4" />
              Curriculum Vitae
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              My{" "}
              <span className="bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Resume
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Download my CV or view a quick summary of my professional background
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden group">
              <div className={`absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-foreground/10 shadow-xl">
                      {data?.avatar ? (
                        <img src={data.avatar} alt={data?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <UserIcon className="h-10 w-10 text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {data?.name || "Your Name"}
                    </h3>
                    <p className="text-lg text-blue-500 dark:text-blue-400 font-medium mt-1">
                      {data?.title || "Professional Title"}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 text-sm text-muted-foreground">
                      {data?.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-blue-400" />{data.email}
                        </span>
                      )}
                      {data?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-purple-400" />{data.location}
                        </span>
                      )}
                      {data?.website && (
                        <span className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-emerald-400" />{data.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-10 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group/summary">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-transparent opacity-0 group-hover/summary:opacity-100 transition-opacity duration-500" />
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />Professional Summary
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {data?.longBio || data?.bio || "No summary available."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`text-center p-5 rounded-2xl ${stat.bg} border border-foreground/5 transition-all duration-300 cursor-default`}
                    >
                      <stat.icon className={`h-6 w-6 mx-auto mb-3 ${stat.color}`} />
                      <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                      <p className="font-bold text-sm">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadCV} size="lg" className="group gap-2 bg-linear-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                    <Download className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />Download CV
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                  </Button>
                  <Button onClick={() => window.print()} variant="glass" size="lg" className="gap-2">
                    <Printer className="h-5 w-5" />Print CV
                  </Button>
                </div>
              </div>
            </LiquidCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}