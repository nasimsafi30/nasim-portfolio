"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import {
  TrendingUp,
  Eye,
  Globe,
  Clock,
  Users,
  MousePointerClick,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalViews: number;
  recentViews: number;
  uniquePages: number;
  viewsByPage: { page: string; views: number }[];
  viewsByCountry: { country: string; views: number }[];
  recentPageViews: any[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground mb-6">
          Analytics data will appear once visitors start viewing your site.
        </p>
        <Button onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* FIXED: bg-gradient-to-r → bg-linear-to-r */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your portfolio performance
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="glass">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: data.totalViews.toLocaleString(), icon: Eye, color: "blue" },
          { label: "24h Views", value: data.recentViews.toLocaleString(), icon: Clock, color: "green" },
          { label: "Unique Pages", value: data.uniquePages, icon: Globe, color: "purple" },
          { label: "Countries", value: data.viewsByCountry.length, icon: Users, color: "orange" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LiquidCard>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </LiquidCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views by Page */}
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            Views by Page
          </h2>
          <div className="space-y-4">
            {data.viewsByPage.map((page, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground truncate mr-4">
                    {page.page === "/" ? "Home" : page.page}
                  </span>
                  <span className="font-medium">{page.views}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(page.views / data.totalViews) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    // FIXED: bg-gradient-to-r → bg-linear-to-r
                    className="h-full bg-linear-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </LiquidCard>

        {/* Views by Country */}
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-400" />
            Views by Country
          </h2>
          <div className="space-y-4">
            {data.viewsByCountry.map((country, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    {country.country || "Unknown"}
                  </span>
                  <span className="font-medium">{country.views}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(country.views / data.totalViews) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    // FIXED: bg-gradient-to-r → bg-linear-to-r
                    className="h-full bg-linear-to-r from-green-500 to-green-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </LiquidCard>
      </div>

      {/* Recent Page Views */}
      <div className="mt-8">
        <LiquidCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Recent Page Views
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Page</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Referrer</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Country</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPageViews.map((view: any, index: number) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {/* FIXED: max-w-[200px] → max-w-50 */}
                    <td className="py-3 px-4 truncate max-w-50">{view.page}</td>
                    <td className="py-3 px-4 text-muted-foreground">{view.referrer || "Direct"}</td>
                    <td className="py-3 px-4 text-muted-foreground">{view.country || "Unknown"}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(view.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LiquidCard>
      </div>
    </div>
  );
}