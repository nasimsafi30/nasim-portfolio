"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/contact");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ApiResponse<Message[]> = await response.json();
      if (data.success) {
        setMessages(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch messages");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch messages";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark single as read
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      if (!response.ok) throw new Error("Failed to update");
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = messages.filter((m) => !m.read).map((m) => m.id);
      for (const id of unreadIds) {
        await fetch("/api/contact", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, read: true }),
        });
      }
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      toast.success("All marked as read");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  // Delete message
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Toggle expand
  const handleToggleExpand = (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (message && !message.read) {
      handleMarkAsRead(id);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter and search
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "unread") return !msg.read && matchesSearch;
    if (filter === "read") return msg.read && matchesSearch;
    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="sr-only">Loading messages...</span>
      </div>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to Load Messages</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchMessages}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="glass" className="shrink-0">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
            aria-label="Search messages"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f.value
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {f.label}
              {f.value === "unread" && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500/20">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {/* Fixed: Wrapped in button instead of onClick on LiquidCard */}
              <button
                onClick={() => handleToggleExpand(message.id)}
                className="w-full text-left"
              >
                <LiquidCard
                  className={`group ${
                    !message.read ? "border-blue-500/30" : ""
                  } hover:bg-white/5 transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        !message.read
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {message.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold ${
                              !message.read ? "text-blue-400" : ""
                            }`}
                          >
                            {message.name}
                          </h3>
                          {!message.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {expandedId === message.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {message.email}
                      </p>
                      {message.subject && (
                        <p className="text-sm font-medium mt-1 truncate">
                          {message.subject}
                        </p>
                      )}
                      {expandedId !== message.id && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {message.message}
                        </p>
                      )}
                    </div>
                  </div>
                </LiquidCard>
              </button>

              {/* Expanded Content - Moved outside the button */}
              <AnimatePresence>
                {expandedId === message.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        {!message.read && (
                          <Button
                            size="sm"
                            variant="glass"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(message.id);
                            }}
                          >
                            <MailOpen className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="glass"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${message.email}${message.subject ? `?subject=Re: ${message.subject}` : ''}`;
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        {deleteConfirmId === message.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                            >
                              Confirm Delete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(message.id);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || filter !== "all" ? "No Matching Messages" : "No Messages"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter"
                : "No messages yet"}
            </p>
            {(searchTerm || filter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => { setSearchTerm(""); setFilter("all"); }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}