"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Users,
  Loader2,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter");
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const activeSubscribers = subscribers
      .filter((s) => s.active)
      .map((s) => s.email)
      .join("\n");

    const blob = new Blob([activeSubscribers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Subscribers exported");
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && s.active) ||
      (filter === "inactive" && !s.active);
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.filter((s) => !s.active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Newsletter Subscribers
          </h1>
          <p className="text-muted-foreground mt-2">
            {activeCount} active, {inactiveCount} unsubscribed
          </p>
        </div>
        <Button onClick={handleExport} variant="glass">
          <Mail className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f.value
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscribers List */}
      <div className="space-y-2">
        {filteredSubscribers.map((subscriber, index) => (
          <motion.div
            key={subscriber.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <LiquidCard>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    subscriber.active
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {subscriber.active ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{subscriber.email}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Subscribed:{" "}
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </span>
                    {subscriber.unsubscribedAt && (
                      <span className="flex items-center gap-1 text-red-400">
                        Unsubscribed:{" "}
                        {new Date(subscriber.unsubscribedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    subscriber.active
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {subscriber.active ? "Active" : "Inactive"}
                </span>
              </div>
            </LiquidCard>
          </motion.div>
        ))}

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Subscribers</h3>
            <p className="text-muted-foreground">
              {filter !== "all"
                ? `No ${filter} subscribers found`
                : "No subscribers yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}