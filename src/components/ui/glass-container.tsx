import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "liquid-glass";
  hover?: boolean;
}

export function GlassContainer({
  children,
  className,
  variant = "glass",
  hover = true,
  ...props
}: GlassContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-xl p-6",
        variant === "liquid-glass" ? "liquid-glass" : "glass",
        hover && (variant === "liquid-glass" ? "liquid-glass-hover" : "glass-hover"),
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}