"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  featured: boolean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const categories = ["all", "Web Development", "Networking", "DevOps", "Career", "Tutorial", "Technology"];

  useEffect(() => { fetchPosts(); }, [activeCategory, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ published: "true", limit: "9", page: currentPage.toString() });
      if (activeCategory !== "all") params.append("category", activeCategory);

      const response = await fetch(`/api/blog?${params}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      const data = await response.json();

      if (data?.success && data.data) {
        setPosts(data.data);
        setTotalPages(data?.pagination?.totalPages || 1);
        setTotalPosts(data?.pagination?.total || data.data.length || 0);
      } else {
        setPosts([]); setTotalPages(1); setTotalPosts(0);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); setTotalPages(1); setTotalPosts(0);
    } finally { setLoading(false); }
  };

  const filteredPosts = searchTerm
    ? posts.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || p.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase())))
    : posts;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <BookOpen className="h-4 w-4" /><span>{totalPosts} Article{totalPosts !== 1 ? 's' : ''}</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              My{" "}<span className="bg-linear-to-r from-blue-500 via-violet-500 to-purple-500 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Thoughts, tutorials, and insights on technology and development</p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-foreground/3 border border-foreground/10 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-colors text-sm" aria-label="Search articles" />
            {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-foreground/10 transition-colors" aria-label="Clear search"><X className="h-4 w-4 text-muted-foreground" /></button>}
          </div>

          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border border-foreground/10 bg-foreground/2">
              {categories.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {activeCategory === cat && <motion.div layoutId="blogCategory" className="absolute inset-0 bg-blue-500/15 border border-blue-500/20 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-10 flex items-center gap-2">{cat === "all" ? <Layers className="h-4 w-4" /> : null}{cat === "all" ? "All Posts" : cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" key="loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-foreground/5 animate-pulse">
                  <div className="h-48 bg-foreground/10 rounded-t-2xl" />
                  <div className="p-5 space-y-3"><div className="h-4 w-20 bg-foreground/10 rounded-full" /><div className="h-5 w-3/4 bg-foreground/10 rounded-lg" /><div className="h-4 w-full bg-foreground/10 rounded-lg" /></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div key="posts" layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post, index) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <LiquidCard className="h-full group overflow-hidden p-0 hover:border-blue-500/20 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-52 bg-linear-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center"><BookOpen className="h-10 w-10 text-blue-400 opacity-40" /></div>
                        )}
                        {post.featured && <div className="absolute top-3 left-3"><Badge variant="yellow" className="flex items-center gap-1"><Sparkles className="h-3 w-3" />Featured</Badge></div>}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="blue" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                        </div>
                        <h2 className="font-bold text-lg mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">{post.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.slice(0, 3).map(tag => <span key={tag} className="px-2.5 py-1 text-xs rounded-lg bg-foreground/3 border border-foreground/10 text-muted-foreground">{tag}</span>)}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-400" />{post.readTime || 5} min</span>
                            <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-purple-400" />{post.views || 0}</span>
                          </div>
                          <span className="text-sm font-medium text-blue-500 dark:text-blue-400 group-hover:underline flex items-center gap-1">Read <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></span>
                        </div>
                      </div>
                    </LiquidCard>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
              <p className="text-muted-foreground">{searchTerm ? "No posts match your search criteria" : "No posts in this category yet"}</p>
              {(searchTerm || activeCategory !== "all") && <Button variant="ghost" onClick={() => { setSearchTerm(""); setActiveCategory("all"); }} className="mt-4">Clear Filters</Button>}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center mt-16 gap-2">
            <Button variant="glass" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" />Prev</Button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1 ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/20" : "text-muted-foreground hover:bg-foreground/5"}`}>{i + 1}</button>
              ))}
            </div>
            <Button variant="glass" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}