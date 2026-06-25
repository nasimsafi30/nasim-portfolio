import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "glass" | "blue" | "purple" | "green" | "orange" | "yellow" | "red" | "pink";
}

const variantClasses: Record<string, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "border-white/10 text-foreground",
  glass: "glass text-foreground border-white/10",
  blue: "border-transparent bg-blue-500/20 text-blue-400",
  purple: "border-transparent bg-purple-500/20 text-purple-400",
  green: "border-transparent bg-green-500/20 text-green-400",
  orange: "border-transparent bg-orange-500/20 text-orange-400",
  yellow: "border-transparent bg-yellow-500/20 text-yellow-400",
  red: "border-transparent bg-red-500/20 text-red-400",
  pink: "border-transparent bg-pink-500/20 text-pink-400",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}