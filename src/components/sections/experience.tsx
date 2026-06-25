"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Briefcase, Calendar, MapPin, Code2, Building2, ArrowRight } from "lucide-react";

export function ExperienceSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch("/api/experience")
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="experience" className="py-32">
      <div className="container mx-auto px-4">
        <div className="h-64 bg-foreground/5 rounded-xl animate-pulse" />
      </div>
    </section>
  );

  if (data.length === 0) return null;

  const currentExp = data[activeTab];

  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-tr from-orange-500/5 via-amber-500/5 to-purple-500/5" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <Briefcase className="h-4 w-4" />Professional Journey
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Work{" "}
              <span className="bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              My professional journey and career highlights
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border border-foreground/10 bg-foreground/2 backdrop-blur-sm">
              {data.map((exp, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeTab === i && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-orange-500/15 border border-orange-500/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />{exp.company}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LiquidCard className="p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-8 w-8 text-orange-500 dark:text-orange-400" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl md:text-3xl font-bold">{currentExp.title}</h3>
                        {currentExp.current && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-medium">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xl text-orange-500 dark:text-orange-400 font-medium">{currentExp.company}</p>
                    </div>

                    {currentExp.type && (
                      <span className="px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground shrink-0">{currentExp.type}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-5 mb-8 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      <span className="font-medium">{currentExp.startDate}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{currentExp.endDate || "Present"}</span>
                    </span>
                    {currentExp.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />{currentExp.location}
                      </span>
                    )}
                  </div>

                  <div className="mb-8">
                    <p className="text-muted-foreground leading-relaxed text-base">{currentExp.description}</p>
                  </div>

                  {currentExp.technologies?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                        <Code2 className="h-4 w-4 text-blue-400" />Technologies & Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentExp.technologies.map((tech: string) => (
                          <span key={tech} className="px-3.5 py-2 rounded-xl bg-foreground/3 border border-foreground/10 text-sm hover:bg-foreground/6 hover:border-foreground/20 transition-all cursor-default">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </LiquidCard>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`h-2 rounded-full transition-all duration-300 ${activeTab === i ? "w-8 bg-orange-500" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
                aria-label={`View experience at ${data[i].company}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}