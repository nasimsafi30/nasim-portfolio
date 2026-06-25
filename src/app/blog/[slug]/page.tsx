"use client";

import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageSquare,
  User,
  Send,
  Loader2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  featured: boolean;
}

interface Comment {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (params?.slug) fetchPost();
  }, [params?.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.slug}`);
      const data = await response.json();
      if (data.success) setPost(data.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, ...commentForm }),
      });
      if (response.ok) {
        toast.success("Comment submitted for review!");
        setCommentForm({ name: "", email: "", content: "" });
      }
    } catch (error) {
      toast.error("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => setLiked(!liked);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-foreground/10 rounded w-3/4" />
            <div className="h-4 bg-foreground/10 rounded w-1/2" />
            <div className="h-96 bg-foreground/10 rounded-xl" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-foreground/10 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog"><Button><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <article className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="blue">{post.category}</Badge>
            {post.featured && <Badge variant="yellow">Featured</Badge>}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime} min read</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{post.views} views</span>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <Button variant="glass" size="sm" onClick={handleLike} className={liked ? "text-red-400" : ""}>
              <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-red-400" : ""}`} />{post.likes + (liked ? 1 : 0)}
            </Button>
            <Button variant="glass" size="sm" onClick={handleShare}><Share2 className="h-4 w-4 mr-2" />Share</Button>
          </div>
        </motion.div>

        {post.coverImage && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
            <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl object-cover max-h-[500px]" />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>

        {post.tags?.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Tag className="h-5 w-5 text-blue-400" />Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${tag}`} className="px-3 py-1.5 text-sm rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all">#{tag}</Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-foreground/10 pt-12">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><MessageSquare className="h-6 w-6" />Comments</h3>
          <LiquidCard className="mb-8">
            <form onSubmit={handleCommentSubmit} className="space-y-4" noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comment-name" className="block text-sm font-medium mb-2">Name *</label>
                  <input id="comment-name" type="text" value={commentForm.name} onChange={e => setCommentForm({ ...commentForm, name: e.target.value })} required
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="comment-email" className="block text-sm font-medium mb-2">Email *</label>
                  <input id="comment-email" type="email" value={commentForm.email} onChange={e => setCommentForm({ ...commentForm, email: e.target.value })} required
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="comment-content" className="block text-sm font-medium mb-2">Comment *</label>
                <textarea id="comment-content" value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })} required rows={4}
                  className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors resize-none" placeholder="Share your thoughts..." />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : <><Send className="h-4 w-4 mr-2" />Submit Comment</>}
                </Button>
              </div>
            </form>
          </LiquidCard>

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <LiquidCard key={comment.id}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{comment.name}</h4>
                        <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </LiquidCard>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </article>
    </div>
  );
}