import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border-4 border-white/10 animate-pulse" />
          
          {/* Inner ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-orange-500 animate-spin" />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-2 text-gradient">
          Loading
        </h2>
        <p className="text-muted-foreground animate-pulse">
          Preparing something amazing...
        </p>
      </div>
    </div>
  );
}