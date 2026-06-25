"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { CVSection } from "@/components/sections/cv";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { SkillsSection } from "@/components/sections/skills";
import { CertificationsSection } from "@/components/sections/certifications";
import { ProjectsSection } from "@/components/sections/projects";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { BlogSection } from "@/components/sections/blog";
import { NewsletterSection } from "@/components/sections/newsletter";
import { ContactSection } from "@/components/sections/contact";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [key, setKey] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(res => {
        if (res.success) setSettings(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [key]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    const handleFocus = () => {
      refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refresh]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (settings?.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>
          <p className="text-muted-foreground text-lg mb-2">
            {settings?.siteName || "The site"} is currently undergoing scheduled maintenance.
          </p>
          <p className="text-muted-foreground">We'll be back shortly. Thank you for your patience!</p>
        </div>
      </div>
    );
  }

  return (
    <div key={key}>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <CVSection />
        <EducationSection />
        <ExperienceSection />
        <SkillsSection />
        <CertificationsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <BlogSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}