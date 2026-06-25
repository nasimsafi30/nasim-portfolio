"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/social-icons";
import {
  ExternalLink, Star, GitFork, RefreshCw, Loader2,
  Code2, Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/github/projects"); // GET - just read
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setSyncing(true);
    toast.info("Syncing from GitHub...");
    try {
      // Step 1: Sync (POST - deletes all then inserts fresh)
      const syncRes = await fetch("/api/github/projects", { method: "POST" });
      const syncData = await syncRes.json();
      
      if (syncData.success) {
        toast.success(syncData.message || `✅ ${syncData.count} projects synced!`);
        // Step 2: Fetch updated list (GET)
        await fetchProjects();
      } else {
        toast.error(syncData.message || "Sync failed");
      }
    } catch (error) { 
      toast.error("Sync failed"); 
    } finally { 
      setSyncing(false); 
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            GitHub Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            {projects.length} projects synced from{" "}
            <a 
              href="https://github.com/nasimsafi30" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline"
            >
              github.com/nasimsafi30
            </a>
          </p>
        </div>
        <Button onClick={handleSync} disabled={syncing} size="lg">
          {syncing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Syncing...</> : <><RefreshCw className="h-4 w-4 mr-2" />Sync from GitHub</>}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: projects.length, icon: GitHubIcon, color: "purple" },
          { label: "Total Stars", value: projects.reduce((a: number, p: any) => a + (p.stars || 0), 0), icon: Star, color: "yellow" },
          { label: "Total Forks", value: projects.reduce((a: number, p: any) => a + (p.forks || 0), 0), icon: GitFork, color: "green" },
          { label: "Languages", value: [...new Set(projects.map((p: any) => p.language).filter(Boolean))].length, icon: Code2, color: "blue" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <LiquidCard>
              <stat.icon className={`h-5 w-5 text-${stat.color}-400 mb-2`} />
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </LiquidCard>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20">
            <GitHubIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">Click Sync to fetch your repositories from GitHub</p>
            <Button onClick={handleSync}><RefreshCw className="h-4 w-4 mr-2" />Sync from GitHub</Button>
          </div>
        )}
        {projects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <LiquidCard className="group h-full">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-40 object-cover rounded-lg mb-4" 
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=No+Preview"; }} 
              />
              <h3 className="font-semibold truncate mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description || "No description"}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {project.topics?.slice(0, 3).map((topic: string) => (
                  <span key={topic} className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400">{topic}</span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-white/5">
                {project.language && (
                  <span className="flex items-center gap-1"><Code2 className="h-3 w-3" />{project.language}</span>
                )}
                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{project.stars}</span>
                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{project.forks}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(project.githubData?.updated_at || Date.now()).toLocaleDateString()}</span>
              </div>

              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 mt-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors"
              >
                <GitHubIcon className="h-3.5 w-3.5" />View on GitHub
              </a>
            </LiquidCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}