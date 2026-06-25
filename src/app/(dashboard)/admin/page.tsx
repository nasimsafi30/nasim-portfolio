"use client";

import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/social-icons";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Eye,
  TrendingUp,
  Star,
  GitFork,
  Plus,
  Edit,
  RefreshCw,
  BookOpen,
  Award,
  Heart,
  Zap,
  User,
  MapPin,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [imgError, setImgError] = useState(false);
  const [stats, setStats] = useState({
    projects: 0, messages: 0, views: 0, githubStars: 0,
    blogPosts: 0, testimonials: 0, certifications: 0, unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [aboutRes, projectsRes, messagesRes, githubRes, blogRes, testimonialsRes, certificationsRes, analyticsRes] = await Promise.all([
        fetch("/api/about"),
        fetch("/api/projects"),
        fetch("/api/contact"),
        fetch("/api/github/projects"),
        fetch("/api/blog?published=true&limit=5"),
        fetch("/api/testimonials"),
        fetch("/api/certifications"),
        fetch("/api/analytics"),
      ]);

      const about = await aboutRes.json().catch(() => ({ success: false }));
      const projects = await projectsRes.json().catch(() => ({ success: false }));
      const messages = await messagesRes.json().catch(() => ({ success: false }));
      const github = await githubRes.json().catch(() => ({ success: false }));
      const blog = await blogRes.json().catch(() => ({ success: false }));
      const testimonials = await testimonialsRes.json().catch(() => ({ success: false }));
      const certifications = await certificationsRes.json().catch(() => ({ success: false }));
      const analyticsData = await analyticsRes.json().catch(() => ({ success: false, data: {} }));

      if (about?.success && about?.data) setAboutData(about.data);

      setStats({
        projects: projects?.data?.length || 0,
        messages: messages?.data?.length || 0,
        views: analyticsData?.data?.totalViews || 0,
        githubStars: github?.data?.reduce?.((acc: number, p: any) => acc + (p?.stars || 0), 0) || 0,
        blogPosts: blog?.data?.length || 0,
        testimonials: testimonials?.data?.length || 0,
        certifications: certifications?.data?.length || 0,
        unreadMessages: messages?.data?.filter?.((m: any) => !m?.read)?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const statCards = [
    { label: "Projects", value: stats.projects, icon: GitHubIcon, color: "blue", href: "/admin/projects" },
    { label: "Blog Posts", value: stats.blogPosts, icon: BookOpen, color: "purple", href: "/admin/blog" },
    { label: "Messages", value: stats.unreadMessages, icon: MessageSquare, color: "green", href: "/admin/messages", badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined },
    { label: "Testimonials", value: stats.testimonials, icon: Heart, color: "pink", href: "/admin/testimonials" },
    { label: "Certifications", value: stats.certifications, icon: Award, color: "orange", href: "/admin/certifications" },
    { label: "Page Views", value: (stats.views || 0).toLocaleString(), icon: Eye, color: "cyan", href: "/admin/analytics" },
    { label: "GitHub Stars", value: stats.githubStars, icon: Star, color: "yellow", href: "/admin/projects" },
  ];

  return (
    <div>
      {/* Profile Header */}
      <LiquidCard className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/30 bg-linear-to-br from-blue-500/20 to-purple-500/20">
              {!imgError && aboutData?.avatar ? (
                <img src={aboutData.avatar} alt={aboutData?.name || "Admin"} className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👨‍💻</div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">Welcome back, {aboutData?.name || "Admin"}!</h2>
            <p className="text-muted-foreground">{aboutData?.title || "Full Stack Developer"}</p>
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
              {aboutData?.location && <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" />{aboutData.location}</span>}
              {aboutData?.email && <span className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-4 w-4" />{aboutData.email}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/about"><Button variant="glass" size="sm"><Edit className="h-4 w-4 mr-2" />Edit Profile</Button></Link>
            <Link href="/" target="_blank" rel="noopener noreferrer"><Button variant="glass" size="sm"><Eye className="h-4 w-4 mr-2" />View Site</Button></Link>
          </div>
        </div>
      </LiquidCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Link href={stat.href}>
              <LiquidCard className="group cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}><stat.icon className={`h-5 w-5 text-${stat.color}-400`} /></div>
                  {stat.badge && <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 animate-pulse">{stat.badge}</span>}
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </LiquidCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <LiquidCard>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-400" />Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Plus, label: "New Blog Post", href: "/admin/blog", color: "blue" },
            { icon: Plus, label: "Sync Projects", href: "/admin/projects", color: "purple" },
            { icon: Plus, label: "Add Skill", href: "/admin/skills", color: "green" },
            { icon: Plus, label: "Add Certification", href: "/admin/certifications", color: "orange" },
            { icon: Edit, label: "Edit About", href: "/admin/about", color: "pink" },
            { icon: Edit, label: "Edit Education", href: "/admin/education", color: "cyan" },
            { icon: Star, label: "Testimonials", href: "/admin/testimonials", color: "yellow" },
            { icon: TrendingUp, label: "Analytics", href: "/admin/analytics", color: "red" },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`p-4 rounded-xl bg-${action.color}-500/10 hover:bg-${action.color}-500/20 border border-${action.color}-500/20 transition-all text-center cursor-pointer`}>
                <action.icon className={`h-6 w-6 mx-auto mb-2 text-${action.color}-400`} />
                <p className="text-xs font-medium">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </LiquidCard>
    </div>
  );
}