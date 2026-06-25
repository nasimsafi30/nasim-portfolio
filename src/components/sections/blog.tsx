"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export function BlogSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?published=true&limit=6&t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
      });
      const result = await res.json();
      setData(result?.data && Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Blog fetch error:", error);
      setData([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlog(); }, []);

  useEffect(() => {
    const handleVisibility = () => { if (document.visibilityState === "visible") fetchBlog(); };
    const handleFocus = () => fetchBlog();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <section id="blog" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-0 left-0 w-100 h-100 bg-blue-500/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <BookOpen className="h-4 w-4" />Latest Articles
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              My{" "}<span className="bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">Latest articles and tutorials on tech & development</p>
          </motion.div>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-foreground/5 animate-pulse">
                <div className="h-48 bg-foreground/10 rounded-t-2xl" />
                <div className="p-5 space-y-3"><div className="h-4 w-20 bg-foreground/10 rounded-full" /><div className="h-5 w-3/4 bg-foreground/10 rounded-lg" /><div className="h-4 w-full bg-foreground/10 rounded-lg" /></div>
              </div>
            ))}
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Blog Posts Yet</h3>
            <p className="text-muted-foreground">Coming soon! Check back later.</p>
          </div>
        )}

        {!loading && data.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <LiquidCard className="h-full group overflow-hidden p-0 hover:border-blue-500/20 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        {post.cover_image || post.coverImage ? (
                          <img src={post.cover_image || post.coverImage} alt={post.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-48 bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"><BookOpen className="h-10 w-10 text-blue-400 opacity-50" /></div>
                        )}
                        {post.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 backdrop-blur-sm"><Sparkles className="h-3 w-3" />Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="blue" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{post.published_at || post.publishedAt ? new Date(post.published_at || post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-foreground/5">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-400" />{post.read_time || post.readTime || 5} min read</span>
                          <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-purple-400" />{post.views || 0} views</span>
                        </div>
                      </div>
                    </LiquidCard>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-foreground/10 bg-foreground/2 hover:bg-foreground/6 text-sm font-medium transition-all group">
                View All Posts<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}