"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Star, Quote, ChevronLeft, ChevronRight, User, MessageSquare } from "lucide-react";

export function TestimonialsSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials?featured=true", { cache: "no-store" })
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="testimonials" className="py-32">
      <div className="container mx-auto px-4">
        <div className="h-64 bg-foreground/5 rounded-xl animate-pulse" />
      </div>
    </section>
  );

  if (data.length === 0) return null;

  const next = () => setCurrent(p => (p + 1) % data.length);
  const prev = () => setCurrent(p => (p - 1 + data.length) % data.length);
  const item = data[current];

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-orange-500/5" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted-foreground mb-6">
              <MessageSquare className="h-4 w-4" />
              Client Feedback
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              What People{" "}
              <span className="bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Feedback from clients & colleagues
            </p>
          </motion.div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <LiquidCard className="text-center p-8 md:p-12 relative group">
                {/* Quote Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/15 mb-6">
                  <Quote className="h-7 w-7 text-yellow-400" />
                </div>

                {/* Content */}
                <p className="text-lg md:text-xl text-muted-foreground mb-8 italic leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-3 mb-5">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <User className="h-7 w-7 text-yellow-400" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.position}{item.company && ` at ${item.company}`}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (item.rating || 5)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </LiquidCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {data.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {data.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === current ? "w-8 bg-yellow-400" : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}