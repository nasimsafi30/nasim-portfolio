"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, BookOpen, Save, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Web Development",
    tags: "",
    published: true,   // ✅ Default TRUE - show on main page
    featured: true,    // ✅ Default TRUE - show as featured
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog?limit=100", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchPosts();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || null,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        published: form.published,
        featured: form.featured,
        publishedAt: form.published ? new Date().toISOString() : null,
      };

      const url = editingId ? `/api/blog/${posts.find((p) => p.id === editingId)?.slug}` : "/api/blog";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        toast.success(editingId ? "Updated!" : "Created!");
        setEditingId(null);
        setIsAdding(false);
        resetForm();
        fetchPosts();
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setIsAdding(true);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.cover_image || post.coverImage || "",
      category: post.category || "Web Development",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""),
      published: post.published || false,
      featured: post.featured || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchPosts();
      }
    } catch (error) { toast.error("Error deleting"); }
  };

  const handleTogglePublish = async (post: any) => {
    try {
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: !post.published,
          publishedAt: !post.published ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        toast.success(post.published ? "Unpublished" : "Published!");
        fetchPosts();
      }
    } catch (error) { toast.error("Failed to update"); }
  };

  const resetForm = () => setForm({
    title: "", excerpt: "", content: "", coverImage: "",
    category: "Web Development", tags: "", 
    published: true,   // ✅ Default TRUE
    featured: true,    // ✅ Default TRUE
  });

  const categories = ["Web Development", "Networking", "DevOps", "Career", "Tutorial", "Technology"];

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
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          <p className="text-muted-foreground mt-2">
            {posts.filter((p) => p.published).length} published, {posts.filter((p) => !p.published).length} drafts
          </p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}>
          <Plus className="h-4 w-4 mr-2" />New Post
        </Button>
      </div>

      {isAdding && (
        <LiquidCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Post" : "New Post"}</h2>
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="blog-title" className="block text-sm mb-1">Title *</label>
              <input id="blog-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Post title" required />
            </div>
            <div>
              <label htmlFor="blog-excerpt" className="block text-sm mb-1">Excerpt *</label>
              <textarea id="blog-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none" placeholder="Brief description" required />
            </div>
            <div>
              <label htmlFor="blog-content" className="block text-sm mb-1">Content (HTML)</label>
              <textarea id="blog-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg resize-none font-mono text-sm" placeholder="<h2>Heading</h2><p>Content...</p>" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="blog-cover" className="block text-sm mb-1">Cover Image URL</label>
                <input id="blog-cover" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label htmlFor="blog-category" className="block text-sm mb-1">Category</label>
                <select id="blog-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="blog-tags" className="block text-sm mb-1">Tags (comma separated)</label>
                <input id="blog-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="react, nextjs" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
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
        {posts.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first blog post</p>
            <Button onClick={() => { setIsAdding(true); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />New Post
            </Button>
          </div>
        )}
        {posts.map((post, index) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <LiquidCard>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    {post.published ? <Badge variant="green">Published</Badge> : <Badge variant="orange">Draft</Badge>}
                    {post.featured && <Badge variant="yellow">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{post.category}</span>
                    <span>{post.read_time || post.readTime || 5} min read</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View post"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(post)} title={post.published ? "Unpublish" : "Publish"}>
                    {post.published ? <EyeOff className="h-4 w-4 text-orange-400" /> : <Eye className="h-4 w-4 text-green-400" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} title="Edit post"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post.slug)} title="Delete post"><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              </div>
            </LiquidCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}