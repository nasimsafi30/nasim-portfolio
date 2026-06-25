"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Code2, Save, X } from "lucide-react";
import { toast } from "sonner";

const categories = ["Frontend", "Backend", "DevOps", "Networking", "Database", "Tools", "Other"];
const colors = ["blue", "purple", "green", "orange", "red", "pink", "yellow", "teal"];

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Frontend", level: 75, color: "blue", order: 0 });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try { const res = await fetch("/api/skills"); const data = await res.json(); if (data.success) setSkills(data.data); } catch (error) { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(editingId ? "Updated!" : "Added!"); setEditingId(null); setIsAdding(false); resetForm(); fetchSkills(); } else { toast.error("Failed to save"); }
    } catch (error) { toast.error("Error saving"); } finally { setSaving(false); }
  };

  const handleEdit = (skill: any) => { setEditingId(skill.id); setIsAdding(true); setForm({ name: skill.name, category: skill.category, level: skill.level, color: skill.color || "blue", order: skill.order || 0 }); };
  const handleDelete = async (id: number) => { if (!confirm("Delete this skill?")) return; try { const res = await fetch(`/api/skills/${id}`, { method: "DELETE" }); if (res.ok) { toast.success("Deleted!"); fetchSkills(); } else { toast.error("Failed to delete"); } } catch (error) { toast.error("Error deleting"); } };
  const resetForm = () => setForm({ name: "", category: "Frontend", level: 75, color: "blue", order: 0 });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Skills
          </h1>
          <p className="text-muted-foreground mt-2">Manage your skills</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}>
          <Plus className="h-4 w-4 mr-2" />Add Skill
        </Button>
      </div>

      {isAdding && (
        <LiquidCard className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} Skill</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="skill-name" className="block text-sm mb-1">Name *</label>
                <input id="skill-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="React.js" title="Skill name" required />
              </div>
              <div>
                <label htmlFor="skill-category" className="block text-sm mb-1">Category</label>
                <select id="skill-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" title="Skill category" aria-label="Skill category">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="skill-color" className="block text-sm mb-1">Color</label>
                <select id="skill-color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" title="Skill color" aria-label="Skill color">
                  {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="skill-level" className="block text-sm mb-1">Level: {form.level}%</label>
                <input id="skill-level" type="range" value={form.level} onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })} min="0" max="100" className="w-full" title={`Skill level: ${form.level}%`} aria-label="Skill level" />
              </div>
            </div>
            <div className="flex gap-3">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.length === 0 && (
          <div className="col-span-full text-center py-20">
            <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Skills Added</h3>
            <Button onClick={() => { setIsAdding(true); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />Add Skill
            </Button>
          </div>
        )}
        {skills.map((skill, index) => (
          <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
            <LiquidCard className="group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{skill.name}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(skill)} title="Edit skill">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(skill.id)} title="Delete skill">
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{skill.category}</span>
                <span className="font-bold text-blue-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                {/* webhint-disable-next-line no-inline-styles */}
                <div 
                  className={`h-full bg-linear-to-r from-${skill.color || "blue"}-500 to-${skill.color || "blue"}-300 rounded-full`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </LiquidCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}