"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // Silently fail
      }
    };

    if (pathname) {
      trackPageView();
    }
  }, [pathname]);

  return null;
}