"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { GitHubIcon } from "@/components/ui/social-icons";
import { useEffect, useState } from "react";
import { ExternalLink, Star, GitFork, Code2, Search, X, Eye, Clock, Scale, AlertCircle, FolderGit2, Sparkles, ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json();
      if (data.success) setProjects(data.data);
    } catch (error) { console.error("Error fetching projects:", error); } finally { setLoading(false); }
  };

  const filtered = projects.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <FolderGit2 className="h-4 w-4" />My Work
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Featured{" "}
              <span className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Projects synced from my GitHub repositories</p>
          </motion.div>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-foreground/3 border border-foreground/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-colors text-sm" aria-label="Search projects" />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-foreground/10 transition-colors" aria-label="Clear search">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl bg-foreground/5 animate-pulse h-72" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
                <div onClick={() => setSelectedProject(project)} className="cursor-pointer h-full">
                  <LiquidCard className="h-full group p-0 overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=No+Preview"; }} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium flex items-center gap-2">View Details <ArrowUpRight className="h-4 w-4" /></span>
                      </div>
                      {project.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3" />Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{project.description || "No description"}</p>

                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.slice(0, 4).map((tech: string) => (
                            <span key={tech} className="px-2.5 py-1 text-xs rounded-lg bg-foreground/3 border border-foreground/10 text-muted-foreground">{tech}</span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2.5 py-1 text-xs rounded-lg bg-foreground/3 border border-foreground/10 text-muted-foreground">+{project.technologies.length - 4}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-foreground/5">
                        {project.language && <span className="flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5 text-blue-400" />{project.language}</span>}
                        <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-yellow-400" />{project.stars || 0}</span>
                        <span className="flex items-center gap-1.5"><GitFork className="h-3.5 w-3.5 text-purple-400" />{project.forks || 0}</span>
                      </div>

                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl bg-foreground/3 hover:bg-foreground/8 border border-foreground/5 text-xs font-medium transition-all">
                        <GitHubIcon className="h-4 w-4" />View Source
                      </a>
                    </div>
                  </LiquidCard>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-foreground/10 bg-background p-6 md:p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/10 transition-colors z-10" aria-label="Close modal"><X className="h-5 w-5" /></button>
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-52 object-cover rounded-xl mb-6"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x300?text=No+Preview"; }} />
              <h2 className="text-2xl font-bold mb-3">{selectedProject.title}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{selectedProject.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Star, label: "Stars", value: selectedProject.stars || 0, color: "text-yellow-400" },
                  { icon: GitFork, label: "Forks", value: selectedProject.forks || 0, color: "text-blue-400" },
                  { icon: Eye, label: "Watchers", value: selectedProject.githubData?.watchers || 0, color: "text-green-400" },
                  { icon: AlertCircle, label: "Issues", value: selectedProject.githubData?.open_issues || 0, color: "text-orange-400" },
                  { icon: Clock, label: "Updated", value: selectedProject.githubData?.updated_at ? new Date(selectedProject.githubData.updated_at).toLocaleDateString() : "N/A", color: "text-purple-400" },
                  { icon: Scale, label: "License", value: selectedProject.githubData?.license || "None", color: "text-gray-400" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-foreground/3 border border-foreground/5">
                    <stat.icon className={`h-4 w-4 ${stat.color} mb-1`} />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
              <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 font-medium text-sm transition-all">
                <GitHubIcon className="h-4 w-4" />View on GitHub<ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}