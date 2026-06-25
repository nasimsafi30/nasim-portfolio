"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { MapPin, Mail, Calendar, User, Code2, Network, GraduationCap, Briefcase, Star } from "lucide-react";

export function AboutSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about")
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section id="about" className="py-32"><div className="container mx-auto px-4"><div className="h-64 bg-white/5 rounded-xl animate-pulse" /></div></section>;
  if (!data) return null;

  const highlights = [
    { icon: Code2, label: "Full Stack Development", value: "3+ Years", color: "text-blue-400", bgColor: "bg-blue-500/20" },
    { icon: Network, label: "IT & Networking", value: "3+ Years", color: "text-purple-400", bgColor: "bg-purple-500/20" },
    { icon: GraduationCap, label: "Education", value: "B.Sc. CS", color: "text-green-400", bgColor: "bg-green-500/20" },
    { icon: Briefcase, label: "Experience", value: "6+ Years", color: "text-orange-400", bgColor: "bg-orange-500/20" },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              About{" "}
              {/* Simple gradient text - NO shadow */}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Get to know me better</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <LiquidCard className="h-full p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{data.name}</h3>
                  <p className="text-blue-400">{data.title}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{data.longBio || data.bio}</p>
              <div className="grid grid-cols-2 gap-4">
                {data.location && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-blue-400" />{data.location}</div>}
                {data.email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-green-400" />{data.email}</div>}
                {data.dob && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4 text-purple-400" />{data.dob}</div>}
              </div>
            </LiquidCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            {highlights.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <LiquidCard className="flex items-center gap-4 p-4 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </LiquidCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}