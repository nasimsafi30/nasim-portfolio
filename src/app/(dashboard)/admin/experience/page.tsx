"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Briefcase, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    technologies: "",
    order: 0,
  });

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      if (data.success) setExperiences(data.data);
    } catch (error) { toast.error("Failed to load experiences"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies ? form.technologies.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        endDate: form.current ? "Present" : form.endDate,
      };
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(editingId ? "Updated!" : "Added!"); setEditingId(null); setIsAdding(false); resetForm(); fetchExperiences(); }
      else { toast.error("Failed to save"); }
    } catch (error) { toast.error("Error saving"); } finally { setSaving(false); }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id); setIsAdding(true);
    setForm({ title: exp.title || "", company: exp.company || "", location: exp.location || "", type: exp.type || "Full-time", startDate: exp.startDate || "", endDate: exp.endDate === "Present" ? "" : exp.endDate || "", current: exp.current || false, description: exp.description || "", technologies: Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies || "", order: exp.order || 0 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try { const res = await fetch(`/api/experience/${id}`, { method: "DELETE" }); if (res.ok) { toast.success("Deleted!"); fetchExperiences(); } else { toast.error("Failed to delete"); } } catch (error) { toast.error("Error deleting"); }
  };

  const resetForm = () => setForm({ title: "", company: "", location: "", type: "Full-time", startDate: "", endDate: "", current: false, description: "", technologies: "", order: 0 });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Work Experience
          </h1>
          <p className="text-muted-foreground mt-2">Manage your professional experience</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}>
          <Plus className="h-4 w-4 mr-2" />Add Experience
        </Button>
      </div>

      {isAdding && (
        <LiquidCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Experience" : "Add New Experience"}</h2>
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="exp-title" className="block text-sm mb-1">Job Title *</label>
                <input id="exp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Full Stack Developer" title="Job Title" required />
              </div>
              <div>
                <label htmlFor="exp-company" className="block text-sm mb-1">Company *</label>
                <input id="exp-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Company name" title="Company" required />
              </div>
              <div>
                <label htmlFor="exp-location" className="block text-sm mb-1">Location</label>
                <input id="exp-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="City, Country" title="Location" />
              </div>
              <div>
                <label htmlFor="exp-type" className="block text-sm mb-1">Employment Type</label>
                <select id="exp-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" title="Employment Type" aria-label="Employment Type">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label htmlFor="exp-start" className="block text-sm mb-1">Start Date *</label>
                <input id="exp-start" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="2022" title="Start Date" required />
              </div>
              <div>
                <label htmlFor="exp-end" className="block text-sm mb-1">End Date</label>
                <input id="exp-end" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="2024" title="End Date" disabled={form.current} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="exp-current" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? "Present" : form.endDate })} className="w-4 h-4" />
                <label htmlFor="exp-current" className="text-sm">I currently work here</label>
              </div>
              <div>
                <label htmlFor="exp-tech" className="block text-sm mb-1">Technologies (comma separated)</label>
                <input id="exp-tech" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="React, Node.js, PostgreSQL" title="Technologies" />
              </div>
            </div>
            <div>
              <label htmlFor="exp-desc" className="block text-sm mb-1">Description</label>
              <textarea id="exp-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none" placeholder="Describe your responsibilities..." title="Description" />
            </div>
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingId ? "Update" : "Save"}</>}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
            </div>
          </form>
        </LiquidCard>
      )}

      <div className="space-y-4">
        {experiences.length === 0 && !isAdding && (
          <div className="text-center py-20">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Experience Added</h3>
            <p className="text-muted-foreground mb-4">Add your first work experience</p>
            <Button onClick={() => { setIsAdding(true); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />Add Experience
            </Button>
          </div>
        )}
        {experiences.map((exp, index) => (
          <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <LiquidCard className="group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Briefcase className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      {exp.current && <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">Current</span>}
                    </div>
                    <p className="text-muted-foreground">{exp.company}</p>
                    {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.startDate} - {exp.endDate || "Present"}
                      {exp.type && <span className="ml-2">({exp.type})</span>}
                    </p>
                    {exp.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.technologies.map((tech: string) => (
                          <span key={tech} className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)} title="Edit experience">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)} title="Delete experience">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </LiquidCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}