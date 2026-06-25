"use client";

import { motion } from "framer-motion";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { ArrowDown, Mail, MapPin, Download, Sparkles, ChevronRight, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroData {
  name: string;
  title: string;
  bio: string;
  longBio?: string;
  avatar: string;
  location: string;
  email: string;
  phone?: string;
  github: string;
  linkedin: string;
  resume: string;
  website: string;
}

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/about")
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadCV = () => {
    const name = data?.name || "CV";
    const cvHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data?.name || ""} - CV</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a1a}h1{color:#2563eb}h2{color:#7c3aed;border-bottom:2px solid #e5e7eb;padding-bottom:8px}.skill-tag{display:inline-block;background:#eff6ff;color:#2563eb;padding:4px 12px;border-radius:20px;margin:3px;font-size:13px}.contact{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;color:#4b5563}.summary{background:#f8fafc;padding:20px;border-radius:12px;border-left:4px solid #2563eb;margin-bottom:20px}</style></head><body><h1>${data?.name || ""}</h1><p style="color:#6b7280;font-size:18px">${data?.title || ""}</p><div class="contact">${data?.email ? `<span>📧 ${data.email}</span>` : ""}${data?.phone ? `<span>📱 ${data.phone}</span>` : ""}${data?.location ? `<span>📍 ${data.location}</span>` : ""}</div><div class="summary"><h2>Professional Summary</h2><p>${data?.longBio || data?.bio || ""}</p></div><div>${data?.github ? `<a href="${data.github}">🔗 GitHub</a> | ` : ""}${data?.linkedin ? `<a href="${data.linkedin}">🔗 LinkedIn</a>` : ""}</div><p style="text-align:center;margin-top:30px;color:#9ca3af;font-size:12px">© ${new Date().getFullYear()} ${data?.name || ""}</p></body></html>`;
    const blob = new Blob([cvHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name.replace(/\s+/g, "_")}_CV.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse space-y-6 text-center">
        <div className="h-8 w-48 bg-foreground/10 rounded-full mx-auto" />
        <div className="h-12 w-72 bg-foreground/10 rounded-lg mx-auto" />
        <div className="h-8 w-64 bg-foreground/10 rounded-lg mx-auto" />
      </div>
    </section>
  );

  const heroName = data?.name || "Mohammad Nasim Safi";
  const heroTitle = data?.title || "Full Stack Developer & IT/Networking Engineer";
  const heroBio = data?.bio || "Building innovative solutions with expertise in modern software development.";
  const heroAvatar = data?.avatar || "/profile.jpg";
  const heroLocation = data?.location || "Nangarhar, Afghanistan";
  const heroEmail = data?.email || "nasimsafi30@gmail.com";
  const heroGithub = data?.github || "https://github.com/nasimsafi30";
  const heroLinkedin = data?.linkedin || "https://linkedin.com/in/nasimsafi";

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-size-[80px_80px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      
      <div 
        className="absolute w-175 h-175 rounded-full blur-3xl opacity-10 dark:opacity-20 transition-transform duration-1000 ease-out"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), rgba(147,51,234,0.3), rgba(236,72,153,0.2), transparent 70%)", left: mousePosition.x - 350, top: mousePosition.y - 350 }}
      />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block mb-8">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/3 backdrop-blur-sm text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="text-muted-foreground block text-lg md:text-xl font-medium mb-2">Hi, I&apos;m</span>
                <span className="bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500 dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">{heroName}</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-5 flex items-center gap-3">
              <div className="h-px w-12 bg-linear-to-r from-blue-500/50 to-transparent" />
              <p className="text-base md:text-lg text-muted-foreground font-medium">{heroTitle}</p>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-4 text-base text-muted-foreground max-w-xl leading-relaxed">{heroBio}</motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToSection("projects")} className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-foreground/10">
                View My Work<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollToSection("contact")} className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground font-semibold text-sm hover:bg-foreground/10 transition-all duration-300 backdrop-blur-sm">
                Get In Touch<Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={downloadCV} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground font-semibold text-sm hover:bg-foreground/10 transition-all duration-300 backdrop-blur-sm">
                <Download className="h-4 w-4" />Download CV
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-6 flex flex-wrap gap-3">
              {[{ icon: MapPin, text: heroLocation }, { icon: Mail, text: "Available for hire" }].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/5 bg-foreground/2 text-sm text-muted-foreground backdrop-blur-sm">
                  <item.icon className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />{item.text}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-7 flex items-center gap-3">
              {[{ icon: GitHubIcon, href: heroGithub, label: "GitHub" }, { icon: LinkedInIcon, href: heroLinkedin, label: "LinkedIn" }, { icon: Mail, href: `mailto:${heroEmail}`, label: "Email" }].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/5 bg-foreground/2 hover:bg-foreground/8 transition-all duration-300 group" aria-label={social.label}>
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{social.label}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-foreground/1 border border-foreground/5 backdrop-blur-xl" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-purple-500/20 rounded-full blur-3xl" />
              
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -inset-3 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-fuchsia-500 opacity-30 blur-xl" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 rounded-full border-2 border-dashed border-foreground/10" />

                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-foreground/10 shadow-2xl">
                  {!imgError ? (
                    <img src={heroAvatar} alt={heroName} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" onError={() => setImgError(true)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500/20 to-purple-500/20"><span className="text-6xl">👨‍💻</span></div>
                  )}
                </div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-2 -right-2 px-3 py-2 bg-background/90 backdrop-blur-xl border border-foreground/10 rounded-full shadow-2xl">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-yellow-500" />6+ Years Exp</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.button animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }} onClick={() => scrollToSection("about")} className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Scroll down">
            <span className="text-xs tracking-[0.3em] uppercase font-medium">Scroll</span>
            <ArrowDown className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}