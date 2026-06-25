import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/5 rounded",
        {
          "h-4 w-full": variant === "text",
          "h-12 w-12 rounded-full": variant === "circular",
          "h-48 w-full": variant === "rectangular",
          "h-64 w-full rounded-xl": variant === "card",
        },
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 p-6 space-y-4">
      <Skeleton variant="rectangular" className="h-48" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-20 h-6" />
        <Skeleton variant="text" className="w-20 h-6" />
        <Skeleton variant="text" className="w-20 h-6" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" className="w-48 h-8" />
          <Skeleton variant="text" className="w-32 h-4 mt-2" />
        </div>
        <Skeleton variant="text" className="w-32 h-10" />
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}