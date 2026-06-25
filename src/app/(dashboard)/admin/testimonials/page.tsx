"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Star, Save, X, Quote, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", position: "", company: "", content: "", avatar: "", rating: 5, featured: false, order: 0 });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try { const res = await fetch("/api/testimonials"); const data = await res.json(); if (data.success) setTestimonials(data.data); } catch (error) { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(editingId ? "Updated!" : "Added!"); setEditingId(null); setIsAdding(false); resetForm(); fetchTestimonials(); } else { toast.error("Failed to save"); }
    } catch (error) { toast.error("Error saving"); } finally { setSaving(false); }
  };

  const handleEdit = (t: any) => { setEditingId(t.id); setIsAdding(true); setForm({ name: t.name || "", position: t.position || "", company: t.company || "", content: t.content || "", avatar: t.avatar || "", rating: t.rating || 5, featured: t.featured || false, order: t.order || 0 }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleDelete = async (id: number) => { if (!confirm("Delete?")) return; try { const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" }); if (res.ok) { toast.success("Deleted!"); fetchTestimonials(); } else { toast.error("Failed"); } } catch (error) { toast.error("Error"); } };
  const handleToggleFeatured = async (t: any) => { try { const res = await fetch(`/api/testimonials/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: !t.featured }) }); if (res.ok) { toast.success(t.featured ? "Removed" : "Featured!"); fetchTestimonials(); } } catch (error) { toast.error("Failed"); } };
  const resetForm = () => setForm({ name: "", position: "", company: "", content: "", avatar: "", rating: 5, featured: false, order: 0 });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Testimonials
          </h1>
          <p className="text-muted-foreground mt-2">Manage client feedback</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}>
          <Plus className="h-4 w-4 mr-2" />Add Testimonial
        </Button>
      </div>

      {isAdding && (
        <LiquidCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{editingId ? "Edit" : "Add"} Testimonial</h2>
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="test-name" className="block text-sm mb-1">Name *</label>
                <input id="test-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Client name" title="Name" required />
              </div>
              <div>
                <label htmlFor="test-position" className="block text-sm mb-1">Position</label>
                <input id="test-position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="CEO" title="Position" />
              </div>
              <div>
                <label htmlFor="test-company" className="block text-sm mb-1">Company</label>
                <input id="test-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Company name" title="Company" />
              </div>
              <div>
                <label htmlFor="test-avatar" className="block text-sm mb-1">Avatar URL</label>
                <input id="test-avatar" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="https://..." title="Avatar URL" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="test-content" className="block text-sm mb-1">Content *</label>
                <textarea id="test-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none" placeholder="What they said..." title="Content" required />
              </div>
              <div>
                <span className="block text-sm mb-1">Rating</span>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="focus:outline-none" aria-label={`${star} star${star > 1 ? 's' : ''}`} title={`Rate ${star} stars`}>
                      <Star className={`h-8 w-8 ${star <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test-featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="test-featured" className="text-sm">Featured</label>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingId ? "Update" : "Save"}</>}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </form>
        </LiquidCard>
      )}

      <div className="space-y-4">
        {testimonials.length === 0 && (
          <div className="text-center py-20">
            <Quote className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Testimonials</h3>
            <Button onClick={() => { setIsAdding(true); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />Add Testimonial
            </Button>
          </div>
        )}
        {testimonials.map((t, index) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <LiquidCard className="group">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {t.avatar ? <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center"><User className="h-6 w-6 text-yellow-400" /></div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{t.name}</h3>
                    {t.featured && <Badge variant="yellow">Featured</Badge>}
                  </div>
                  {(t.position || t.company) && <p className="text-sm text-muted-foreground">{t.position}{t.position && t.company && " at "}{t.company}</p>}
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />)}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(t)} title="Toggle featured">
                    <Star className={`h-4 w-4 ${t.featured ? "text-yellow-400 fill-yellow-400" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(t)} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} title="Delete">
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