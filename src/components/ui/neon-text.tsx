"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonTextProps {
  text: string;
  className?: string;
  color?: "blue" | "purple" | "green" | "orange";
}

const colorMap = {
  blue: {
    primary: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.5)",
    text: "#93C5FD",
  },
  purple: {
    primary: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.5)",
    text: "#C4B5FD",
  },
  green: {
    primary: "#10B981",
    glow: "rgba(16, 185, 129, 0.5)",
    text: "#6EE7B7",
  },
  orange: {
    primary: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.5)",
    text: "#FCD34D",
  },
};

export function NeonText({ text, className, color = "blue" }: NeonTextProps) {
  const colors = colorMap[color];

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Glow effect */}
      <motion.span
        className="absolute inset-0"
        style={{
          color: colors.primary,
          textShadow: `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      >
        {text}
      </motion.span>

      {/* Base text */}
      <motion.span
        className="relative"
        style={{
          color: colors.text,
          textShadow: `0 0 5px ${colors.glow}`,
        }}
        animate={{
          textShadow: [
            `0 0 5px ${colors.glow}`,
            `0 0 20px ${colors.glow}`,
            `0 0 5px ${colors.glow}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}