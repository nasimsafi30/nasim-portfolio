"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center"
        >
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-2">
          We encountered an unexpected error.
        </p>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="group">
            <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
          {/* Fixed: Removed asChild, wrapped Button in Link instead */}
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          If the problem persists, please contact support.
        </p>
      </motion.div>
    </div>
  );
}