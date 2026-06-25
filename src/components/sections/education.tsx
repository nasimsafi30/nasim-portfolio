"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";

export function EducationSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/education")
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="education" className="py-32">
      <div className="container mx-auto px-4">
        <div className="h-64 bg-foreground/5 rounded-xl animate-pulse" />
      </div>
    </section>
  );

  if (data.length === 0) return null;

  return (
    <section id="education" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-bl from-purple-500/5 to-blue-500/5" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <GraduationCap className="h-4 w-4" />
              Academic Journey
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              My{" "}
              <span className="bg-linear-to-r from-purple-500 via-violet-500 to-blue-500 dark:from-purple-400 dark:via-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                Education
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Academic background & qualifications
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-blue-500/30 via-purple-500/30 to-violet-500/30 hidden md:block" />

            <div className="space-y-8 md:space-y-12">
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-purple-500/30 items-center justify-center z-10 shadow-lg shadow-purple-500/10">
                    <GraduationCap className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <LiquidCard className="group p-6 hover:border-purple-500/20 transition-all duration-300">
                      {/* Field Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {item.field || "General"}
                        </span>
                      </div>

                      {/* Degree */}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                        {item.degree}
                      </h3>

                      {/* Institution */}
                      <p className="text-muted-foreground font-medium mb-3">
                        {item.institution}
                      </p>

                      {/* Date & Location */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-purple-400" />
                          {item.startDate} - {item.endDate || "Present"}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-400" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </LiquidCard>
                  </div>

                  {/* Mobile Timeline Dot */}
                  <div className="flex md:hidden absolute left-4 w-8 h-8 rounded-full bg-background border-2 border-purple-500/30 items-center justify-center z-10">
                    <GraduationCap className="h-4 w-4 text-purple-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}