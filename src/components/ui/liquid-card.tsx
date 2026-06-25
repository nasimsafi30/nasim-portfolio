"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, MouseEvent } from "react";

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderGlow?: boolean;
}

export function LiquidCard({
  children,
  className,
  glowColor = "rgba(96, 165, 250, 0.4)",
  borderGlow = true,
}: LiquidCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        // FIXED: Changed bg-gradient-to-br to bg-linear-to-br and simplified opacity syntax
        "bg-linear-to-br from-white/8 to-white/2",
        "backdrop-blur-xl border border-white/5",
        "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        "hover:shadow-[0_8px_32px_rgba(96,165,250,0.15)]",
        "transition-all duration-500",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Liquid gradient overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Border glow effect */}
      {borderGlow && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.1),
                transparent 80%
              )
            `,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>

      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/5 to-transparent" />
    </motion.div>
  );
}