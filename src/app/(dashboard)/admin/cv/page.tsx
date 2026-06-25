"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Save, Loader2, Mail, MapPin, Phone, Globe, Calendar, Heart,
  Camera, AlertCircle, Eye, Edit3, Upload, Trash2, FileText,
  Download, Briefcase, GraduationCap, Code2, Award, Star, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const cvSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
  summary: z.string().min(10, "Summary is required"),
  skills: z.string(),
  experience: z.string(),
  education: z.string(),
  certifications: z.string(),
  languages: z.string(),
  avatar: z.string(),
});

type CVForm = z.infer<typeof cvSchema>;

export default function AdminCV() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<CVForm>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      fullName: "", title: "", email: "", phone: "", location: "",
      website: "", github: "", linkedin: "", summary: "",
      skills: "", experience: "", education: "", certifications: "", languages: "", avatar: "",
    },
  });

  const watchAll = watch();

  useEffect(() => { fetchCVData(); }, []);

  const fetchCVData = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        reset({
          fullName: d.name || "",
          title: d.title || "",
          email: d.email || "",
          phone: d.phone || "",
          location: d.location || "",
          website: d.website || "",
          github: d.github || "",
          linkedin: d.linkedin || "",
          summary: d.longBio || d.bio || "",
          avatar: d.avatar || "",
          skills: "",
          experience: "",
          education: "",
          certifications: "",
          languages: "",
        });
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally { setLoading(false); }
  };

  const onSubmit = async (data: CVForm) => {
    setSaving(true);
    try {
      await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName, title: data.title, email: data.email,
          phone: data.phone, location: data.location, website: data.website,
          github: data.github, linkedin: data.linkedin,
          longBio: data.summary, bio: data.summary?.substring(0, 150),
        }),
      });
      toast.success("CV data saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const downloadCV = () => {
    const cvHTML = `<!DOCTYPE html><html><head><title>${watchAll.fullName} - CV</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333}h1{color:#2563eb;margin-bottom:5px}h2{color:#7c3aed;border-bottom:2px solid #e5e7eb;padding-bottom:5px;margin-top:25px}.title{color:#6b7280;font-size:18px;margin-bottom:15px}.contact{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;color:#4b5563}.skill-tag{display:inline-block;background:#eff6ff;color:#2563eb;padding:4px 12px;border-radius:20px;margin:3px;font-size:13px}</style></head><body><h1>${watchAll.fullName}</h1><div class="title">${watchAll.title}</div><div class="contact"><span>📧 ${watchAll.email}</span><span>📱 ${watchAll.phone}</span><span>📍 ${watchAll.location}</span><span>🌐 ${watchAll.website}</span></div><h2>Professional Summary</h2><p>${watchAll.summary}</p><h2>Technical Skills</h2><div>${(watchAll.skills || "").split(",").map(s => `<span class="skill-tag">${s.trim()}</span>`).join("")}</div><h2>Experience</h2>${(watchAll.experience || "").split("\n").map(line => `<p>${line}</p>`).join("")}<h2>Education</h2>${(watchAll.education || "").split("\n").map(line => `<p>${line}</p>`).join("")}<h2>Certifications</h2>${(watchAll.certifications || "").split("\n").map(line => `<p>${line}</p>`).join("")}<h2>Languages</h2>${(watchAll.languages || "").split("\n").map(line => `<p>${line}</p>`).join("")}</body></html>`;
    const blob = new Blob([cvHTML], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${watchAll.fullName.replace(/\s+/g, "_")}_CV.html`;
    a.click();
    toast.success("CV downloaded!");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CV / Resume Manager</h1>
          <p className="text-muted-foreground mt-2">Edit and download your professional CV</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <><Edit3 className="h-4 w-4 mr-2" />Edit</> : <><Eye className="h-4 w-4 mr-2" />Preview</>}
          </Button>
          <Button onClick={downloadCV} variant="glass"><Download className="h-4 w-4 mr-2" />Download CV</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving || !isDirty}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save</>}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!previewMode ? (
            <>
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User className="h-5 w-5 text-blue-400" />Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name *", name: "fullName" },
                    { label: "Title *", name: "title" },
                    { label: "Email *", name: "email", type: "email" },
                    { label: "Phone", name: "phone" },
                    { label: "Location", name: "location" },
                    { label: "Website", name: "website" },
                    { label: "GitHub", name: "github" },
                    { label: "LinkedIn", name: "linkedin" },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm mb-1">{f.label}</label>
                      <input {...register(f.name as any)} type={f.type || "text"} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                    </div>
                  ))}
                </div>
              </LiquidCard>
              {[
                { icon: FileText, color: "text-green-400", title: "Professional Summary", name: "summary", rows: 5, placeholder: "Write your professional summary..." },
                { icon: Code2, color: "text-purple-400", title: "Technical Skills", name: "skills", rows: 3, placeholder: "Comma separated: React, Node.js..." },
                { icon: Briefcase, color: "text-orange-400", title: "Work Experience", name: "experience", rows: 5, placeholder: "Job Title (Date)\nDescription..." },
                { icon: GraduationCap, color: "text-blue-400", title: "Education", name: "education", rows: 3, placeholder: "Degree - Institution (Year)" },
                { icon: Award, color: "text-yellow-400", title: "Certifications", name: "certifications", rows: 3, placeholder: "Certification - Issuer (Year)" },
                { icon: Globe, color: "text-green-400", title: "Languages", name: "languages", rows: 2, placeholder: "Language (Level)" },
              ].map(section => (
                <LiquidCard key={section.name}>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <section.icon className={`h-5 w-5 ${section.color}`} />{section.title}
                  </h2>
                  <textarea {...register(section.name as any)} rows={section.rows} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg resize-none" placeholder={section.placeholder} />
                </LiquidCard>
              ))}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <LiquidCard className="p-8">
                <div className="text-center mb-6">
                  {watchAll.avatar && <img src={watchAll.avatar} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500/30" />}
                  <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{watchAll.fullName}</h1>
                  <p className="text-lg text-blue-400 mt-1">{watchAll.title}</p>
                  <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{watchAll.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{watchAll.phone}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{watchAll.location}</span>
                  </div>
                </div>
                {[
                  { icon: FileText, color: "text-green-400", title: "Summary", content: watchAll.summary },
                  { icon: Code2, color: "text-purple-400", title: "Skills", content: (watchAll.skills || "").split(",").map((s: string, i: number) => <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">{s.trim()}</span>), isTags: true },
                  { icon: Briefcase, color: "text-orange-400", title: "Experience", content: (watchAll.experience || "").split("\n").map((line: string, i: number) => <p key={i} className="text-muted-foreground text-sm mb-1">{line}</p>) },
                  { icon: GraduationCap, color: "text-blue-400", title: "Education", content: (watchAll.education || "").split("\n").map((line: string, i: number) => <p key={i} className="text-muted-foreground text-sm mb-1">{line}</p>) },
                  { icon: Award, color: "text-yellow-400", title: "Certifications", content: (watchAll.certifications || "").split("\n").map((line: string, i: number) => <p key={i} className="text-muted-foreground text-sm mb-1">{line}</p>) },
                  { icon: Globe, color: "text-green-400", title: "Languages", content: (watchAll.languages || "").split("\n").map((line: string, i: number) => <p key={i} className="text-muted-foreground text-sm mb-1">{line}</p>) },
                ].map((section, i) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><section.icon className={`h-5 w-5 ${section.color}`} />{section.title}</h3>
                    {section.isTags ? (
                      <div className="flex flex-wrap gap-2">{section.content}</div>
                    ) : (
                      <div>{section.content}</div>
                    )}
                  </div>
                ))}
              </LiquidCard>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <LiquidCard>
            <h3 className="font-semibold mb-4">CV Actions</h3>
            <div className="space-y-3">
              <Button onClick={downloadCV} className="w-full" variant="glass"><Download className="h-4 w-4 mr-2" />Download as HTML</Button>
              <Button onClick={() => window.print()} className="w-full" variant="glass"><FileText className="h-4 w-4 mr-2" />Print CV</Button>
            </div>
          </LiquidCard>
          <LiquidCard>
            <h3 className="font-semibold mb-4">Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Keep summary concise</li>
              <li>• List skills comma-separated</li>
              <li>• Use new lines for each item</li>
              <li>• Click Preview to see CV</li>
            </ul>
          </LiquidCard>
          {isDirty && (
            <LiquidCard>
              <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />Unsaved changes</p>
              </div>
            </LiquidCard>
          )}
        </div>
      </div>
    </div>
  );
}