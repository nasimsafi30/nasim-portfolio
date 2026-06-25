"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GitHubIcon } from "@/components/ui/social-icons";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Code2,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Award,
  BookOpen,
  Star,
  Users,
  TrendingUp,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  icon: LucideIcon | React.FC<{ className?: string }>;
  label: string;
  href: string;
  external?: boolean;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    section: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: Home, label: "View Site", href: "/", external: true },
    ],
  },
  {
    section: "Content",
    items: [
      { icon: User, label: "About", href: "/admin/about" },
      { icon: FileText, label: "CV / Resume", href: "/admin/cv" },
      { icon: GraduationCap, label: "Education", href: "/admin/education" },
      { icon: Briefcase, label: "Experience", href: "/admin/experience" },
      { icon: Code2, label: "Skills", href: "/admin/skills" },
      { icon: Award, label: "Certifications", href: "/admin/certifications" },
      { icon: GitHubIcon, label: "Projects", href: "/admin/projects" },
    ],
  },
  {
    section: "Blog",
    items: [
      { icon: BookOpen, label: "Blog Posts", href: "/admin/blog" },
    ],
  },
  {
    section: "Community",
    items: [
      { icon: Star, label: "Testimonials", href: "/admin/testimonials" },
      { icon: Mail, label: "Messages", href: "/admin/messages" },
      { icon: Users, label: "Subscribers", href: "/admin/subscribers" },
    ],
  },
  {
    section: "Insights",
    items: [
      { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-0 h-full glass border-r border-white/10 z-50 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin">
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Portfolio CMS
              </h1>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", collapsed && "mx-auto")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                      isActive
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    {/* FIXED: Changed flex-shrink-0 to shrink-0 */}
                    <IconComponent className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-400" : "")} />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.external && (
                      <ExternalLink className="h-3 w-3 opacity-50 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full",
            collapsed && "justify-center"
          )}
          aria-label="Sign out"
        >
          {/* FIXED: Changed flex-shrink-0 to shrink-0 */}
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}