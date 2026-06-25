"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Code2, TrendingUp, Layers } from "lucide-react";

export function SkillsSection() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/skills")
      .then(r => r.json())
      .then(res => { if (res.success) setSkills(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="skills" className="py-32">
      <div className="container mx-auto px-4"><div className="h-64 bg-foreground/5 rounded-xl animate-pulse" /></div>
    </section>
  );

  if (skills.length === 0) return null;

  const grouped = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = ["all", ...Object.keys(grouped)];

  const getBarColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-linear-to-r from-blue-500 to-blue-400",
      purple: "bg-linear-to-r from-purple-500 to-purple-400",
      green: "bg-linear-to-r from-green-500 to-green-400",
      orange: "bg-linear-to-r from-orange-500 to-orange-400",
      red: "bg-linear-to-r from-red-500 to-red-400",
      pink: "bg-linear-to-r from-pink-500 to-pink-400",
      yellow: "bg-linear-to-r from-yellow-500 to-yellow-400",
      teal: "bg-linear-to-r from-teal-500 to-teal-400",
    };
    return colors[color] || colors.blue;
  };

  const filteredSkills = activeCategory === "all" ? skills : skills.filter(s => s.category === activeCategory);
  const filteredGrouped = activeCategory === "all" ? grouped : { [activeCategory]: grouped[activeCategory] };

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-tl from-green-500/5 to-blue-500/5" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <Code2 className="h-4 w-4" />Technical Expertise
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Technical{" "}
              <span className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Skills</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">Technologies and tools I work with daily</p>
          </motion.div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border border-foreground/10 bg-foreground/2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {activeCategory === cat && <motion.div layoutId="skillCategory" className="absolute inset-0 bg-green-500/15 border border-green-500/20 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                <span className="relative z-10 flex items-center gap-2">{cat === "all" ? <Layers className="h-4 w-4" /> : null}{cat === "all" ? "All Skills" : cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {Object.entries(filteredGrouped).map(([category, categorySkills]: [string, any], catIndex) => (
            <motion.div key={category} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: catIndex * 0.1 }} className="mb-14 last:mb-0">
              <div className="flex items-center gap-4 mb-7">
                <div className="h-10 w-1 rounded-full bg-linear-to-b from-green-500 to-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold">{category}</h3>
                  <p className="text-sm text-muted-foreground">{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill: any, i: number) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
                    <LiquidCard className="group p-5 hover:border-green-500/20 transition-all duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">{skill.name}</span>
                        <span className="text-sm font-bold text-green-500 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg">{skill.level}%</span>
                      </div>
                      <div className="relative h-2.5 bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                          className={`absolute inset-y-0 left-0 rounded-full ${getBarColor(skill.color || 'blue')}`} />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{skill.level < 30 ? "Beginner" : skill.level < 60 ? "Intermediate" : skill.level < 85 ? "Advanced" : "Expert"}</span>
                        {skill.yearsOfExperience && <span className="text-xs text-muted-foreground">{skill.yearsOfExperience}+ years</span>}
                      </div>
                    </LiquidCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 max-w-md mx-auto">
          <LiquidCard className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-black">{skills.length}</p>
            <p className="text-sm text-muted-foreground">Total Technologies</p>
            <p className="text-xs text-muted-foreground mt-1">Across {Object.keys(grouped).length} categories</p>
          </LiquidCard>
        </motion.div>
      </div>
    </section>
  );
}