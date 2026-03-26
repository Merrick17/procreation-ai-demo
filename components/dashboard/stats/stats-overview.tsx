"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
}

function StatCard({ label, value, change, changeLabel, prefix = '', suffix = '', loading }: StatCardProps) {
  if (loading) {
    return (
      <Card className="bg-[#13151F] border-white/[0.06]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-16 mt-2" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="bg-[#13151F] border-white/[0.06] hover:border-white/[0.1] transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground/80 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-white tabular-nums tracking-tight">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-muted-foreground/60">{changeLabel || 'vs last 7d'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsOverviewProps {
  stats?: {
    label: string;
    value: string | number;
    change?: number;
    prefix?: string;
    suffix?: string;
  }[];
  loading?: boolean;
}

export function StatsOverview({ stats, loading }: StatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <StatCard key={i} label="" value="" loading={true} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-[#13151F] border-white/[0.06]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-16 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
