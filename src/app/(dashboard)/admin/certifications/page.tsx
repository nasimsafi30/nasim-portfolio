"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Award,
  Loader2,
  Calendar,
  ExternalLink,
  Shield,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  expiryDate: z.string(),
  credentialId: z.string(),
  credentialUrl: z.string(),
  image: z.string(),
  category: z.string().min(1, "Category is required"),
  skills: z.string(),
  order: z.number(),
});

type CertificationForm = z.infer<typeof certificationSchema>;

const defaultFormValues: CertificationForm = {
  title: "",
  issuer: "",
  date: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  image: "",
  category: "",
  skills: "",
  order: 0,
};

const categories = [
  "Cloud Computing",
  "Networking",
  "Security",
  "Web Development",
  "Database",
  "DevOps",
  "Project Management",
  "Other",
];

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const form = useForm<CertificationForm>({
    resolver: zodResolver(certificationSchema),
    defaultValues: defaultFormValues,
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch("/api/certifications");
      const data = await response.json();
      if (data.success) {
        setCertifications(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch certifications");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CertificationForm) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        expiryDate: data.expiryDate,
        credentialId: data.credentialId,
        credentialUrl: data.credentialUrl,
        image: data.image,
        category: data.category,
        skills: data.skills
          ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        order: data.order,
      };

      const url = editingId
        ? `/api/certifications/${editingId}`
        : "/api/certifications";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingId ? "Certification updated" : "Certification added");
        setEditingId(null);
        setIsAdding(false);
        reset(defaultFormValues);
        fetchCertifications();
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
    setIsAdding(false);
    reset({
      title: cert.title || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
      expiryDate: cert.expiryDate || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      image: cert.image || "",
      category: cert.category || "",
      skills: Array.isArray(cert.skills) ? cert.skills.join(", ") : cert.skills || "",
      order: cert.order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      toast.success("Certification deleted");
      fetchCertifications();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const filteredCerts = certifications.filter((cert) => {
    const matchesSearch =
      cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || cert.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Certifications
          </h1>
          <p className="text-muted-foreground mt-2">Manage your professional certifications</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); reset(defaultFormValues); }}>
          <Plus className="h-4 w-4 mr-2" />Add Certification
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingId !== null) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8">
            <LiquidCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{editingId ? "Edit Certification" : "Add New Certification"}</h2>
                <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setIsAdding(false); reset(defaultFormValues); }}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Certification Title *</label>
                    <input {...register("title")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g., AWS Solutions Architect" />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                    <input {...register("issuer")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g., Amazon Web Services" />
                    {errors.issuer && <p className="text-red-400 text-sm mt-1">{errors.issuer.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="cert-category" className="block text-sm font-medium mb-2">Category *</label>
                    <select id="cert-category" {...register("category")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors">
                      <option value="">Select category</option>
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Earned *</label>
                    <input {...register("date")} type="date" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" />
                    {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input {...register("expiryDate")} type="date" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Credential ID</label>
                    <input {...register("credentialId")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g., AWS-ASA-12345" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification URL</label>
                    <input {...register("credentialUrl")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://www.credly.com/badges/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                    <input {...register("skills")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="AWS, Cloud Architecture, DevOps" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input {...register("image")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://example.com/badge.png" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button type="submit" disabled={saving}>
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingId ? "Update" : "Save"}</>}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setIsAdding(false); reset(defaultFormValues); }}>Cancel</Button>
                </div>
              </form>
            </LiquidCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search certifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" />
        </div>
        <div>
          <label htmlFor="filter-category" className="sr-only">Filter by category</label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter certifications by category"
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCerts.map((cert, index) => (
            <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}>
              <LiquidCard className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20"><Award className="h-6 w-6 text-green-400" /></div>
                  {cert.expiryDate && new Date(cert.expiryDate) > new Date() ? (
                    <Badge variant="green" className="flex items-center gap-1"><Shield className="h-3 w-3" />Active</Badge>
                  ) : cert.expiryDate ? <Badge variant="red">Expired</Badge> : <Badge variant="blue">No Expiry</Badge>}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-green-400 transition-colors">{cert.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{cert.issuer}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(cert.date).toLocaleDateString()}</span>
                  {cert.expiryDate && <><span>→</span><span>{new Date(cert.expiryDate).toLocaleDateString()}</span></>}
                </div>
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10">{skill}</span>
                    ))}
                    {cert.skills.length > 3 && <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10">+{cert.skills.length - 3}</span>}
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  {cert.credentialUrl && <Button variant="ghost" size="sm" className="flex-1" onClick={() => window.open(cert.credentialUrl, "_blank")}><ExternalLink className="h-3 w-3 mr-1" />Verify</Button>}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </LiquidCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-20">
          <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Certifications</h3>
          <p className="text-muted-foreground mb-6">{searchTerm || filterCategory !== "all" ? "No certifications match your filters" : "Add your first certification"}</p>
          {!searchTerm && filterCategory === "all" && <Button onClick={() => { setIsAdding(true); reset(defaultFormValues); }}><Plus className="h-4 w-4 mr-2" />Add Certification</Button>}
        </div>
      )}
    </div>
  );
}