"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, GraduationCap, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminEducation() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState({
    degree: "", institution: "", field: "", startDate: "", endDate: "",
    description: "", location: "", order: 0,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/education");
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        toast.success(editingId ? "Updated!" : "Added!");
        setEditingId(null); setIsAdding(false); resetForm(); fetchData();
      }
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setIsAdding(true);
    setForm({
      degree: item.degree || "", institution: item.institution || "",
      field: item.field || "", startDate: item.start_date || item.startDate || "",
      endDate: item.end_date || item.endDate || "", description: item.description || "",
      location: item.location || "", order: item.order || 0,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/education/${id}`, { method: "DELETE" });
      toast.success("Deleted!"); fetchData();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleteConfirmId(null); }
  };

  const resetForm = () => setForm({ degree: "", institution: "", field: "", startDate: "", endDate: "", description: "", location: "", order: 0 });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Education</h1>
          <p className="text-muted-foreground mt-2">Manage your education history</p>
        </div>
        {!isAdding && <Button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}><Plus className="h-4 w-4 mr-2" />Add Education</Button>}
      </div>

      {isAdding && (
        <LiquidCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{editingId ? "Edit" : "Add"} Education</h2>
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "edu-degree", label: "Degree *", value: form.degree, set: (v: string) => setForm({...form, degree: v}), placeholder: "Bachelor of Science" },
                { id: "edu-inst", label: "Institution *", value: form.institution, set: (v: string) => setForm({...form, institution: v}), placeholder: "University name" },
                { id: "edu-field", label: "Field", value: form.field, set: (v: string) => setForm({...form, field: v}), placeholder: "Computer Science" },
                { id: "edu-loc", label: "Location", value: form.location, set: (v: string) => setForm({...form, location: v}), placeholder: "City, Country" },
                { id: "edu-start", label: "Start Date *", value: form.startDate, set: (v: string) => setForm({...form, startDate: v}), placeholder: "2017" },
                { id: "edu-end", label: "End Date", value: form.endDate, set: (v: string) => setForm({...form, endDate: v}), placeholder: "2021" },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm mb-1">{f.label}</label>
                  <input id={f.id} value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder={f.placeholder} title={f.label} required={f.label.includes("*")} />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="edu-desc" className="block text-sm mb-1">Description</label>
              <textarea id="edu-desc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none" placeholder="Brief description..." title="Description" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingId ? "Update" : "Save"}</>}</Button>
              <Button type="button" variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>Cancel</Button>
            </div>
          </form>
        </LiquidCard>
      )}

      <div className="space-y-4">
        {data.length === 0 && !isAdding && (
          <div className="text-center py-20">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Education Added</h3>
            <Button onClick={() => { setIsAdding(true); resetForm(); }}><Plus className="h-4 w-4 mr-2" />Add Education</Button>
          </div>
        )}
        {data.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <LiquidCard>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20"><GraduationCap className="h-6 w-6 text-blue-400" /></div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.degree}</h3>
                    {item.field && <p className="text-sm text-blue-400/80">{item.field}</p>}
                    <p className="text-muted-foreground">{item.institution}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.start_date || item.startDate} - {item.end_date || item.endDate || "Present"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {deleteConfirmId === item.id ? (
                    <>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete?</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>No</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} aria-label="Edit"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(item.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </>
                  )}
                </div>
              </div>
            </LiquidCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}