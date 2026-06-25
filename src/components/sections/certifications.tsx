"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, ExternalLink, Layers } from "lucide-react";

export function CertificationsSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/certifications")
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="certifications" className="py-32">
      <div className="container mx-auto px-4"><div className="h-64 bg-foreground/5 rounded-xl animate-pulse" /></div>
    </section>
  );

  if (data.length === 0) return null;

  const categories = ["all", ...new Set(data.map(c => c.category))];
  const filtered = filter === "all" ? data : data.filter(c => c.category === filter);

  return (
    <section id="certifications" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-bl from-green-500/5 to-blue-500/5" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <Award className="h-4 w-4" />Professional Credentials
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Certifications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">Professional credentials & achievements</p>
          </motion.div>
        </div>

        {categories.length > 2 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border border-foreground/10 bg-foreground/2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {filter === cat && <motion.div layoutId="certCategory" className="absolute inset-0 bg-green-500/15 border border-green-500/20 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-10 flex items-center gap-2">{cat === "all" ? <Layers className="h-4 w-4" /> : null}{cat === "all" ? "All" : cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filtered.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}>
              <LiquidCard className="h-full group p-6 hover:border-green-500/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/15 group-hover:bg-green-500/15 transition-colors"><Award className="h-6 w-6 text-green-500 dark:text-green-400" /></div>
                  {cert.expiryDate ? (new Date(cert.expiryDate) > new Date() ? (
                    <Badge variant="green" className="flex items-center gap-1.5 px-2.5 py-1">
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>Active
                    </Badge>) : <Badge variant="red">Expired</Badge>) : <Badge variant="blue">No Expiry</Badge>}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors leading-snug">{cert.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{cert.issuer}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3.5 w-3.5 text-green-400" />
                  <span>Issued {new Date(cert.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  {cert.expiryDate && <><span className="text-foreground/20">•</span><span>Expires {new Date(cert.expiryDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span></>}
                </div>
                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.slice(0, 4).map((skill: string) => <span key={skill} className="px-2.5 py-1 text-xs rounded-lg bg-foreground/3 border border-foreground/10 text-muted-foreground">{skill}</span>)}
                    {cert.skills.length > 4 && <span className="px-2.5 py-1 text-xs rounded-lg bg-foreground/3 border border-foreground/10 text-muted-foreground">+{cert.skills.length - 4}</span>}
                  </div>
                )}
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors group/link mt-auto">
                    Verify Credential<ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </LiquidCard>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-12">
          Showing {filtered.length} of {data.length} certification{data.length !== 1 ? 's' : ''}
        </motion.p>
      </div>
    </section>
  );
}