"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface PortfolioChartProps {
  isLoading?: boolean;
}

export function PortfolioChart({ isLoading }: PortfolioChartProps) {
  // Mock portfolio value data over 30 days
  const data = useMemo(() => {
    const points = [];
    let value = 1500;
    for (let i = 0; i < 30; i++) {
      value = value + (Math.random() - 0.45) * 100;
      points.push({ day: i + 1, value: Math.max(value, 500) });
    }
    return points;
  }, []);

  const currentValue = data[data.length - 1]?.value || 0;
  const startValue = data[0]?.value || 0;
  const change = currentValue - startValue;
  const changePercent = ((change / startValue) * 100).toFixed(1);
  const isPositive = change >= 0;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  // Generate SVG path for sparkline
  const pathData = useMemo(() => {
    if (data.length === 0) return '';
    const width = 600;
    const height = 120;
    const padding = 10;

    const xScale = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / (maxValue - minValue || 1);

    return data.map((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.value - minValue) * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, maxValue, minValue]);

  if (isLoading) {
    return (
      <Card className="bg-[#13151F] border-white/[0.06]">
        <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground/80">Portfolio Value</p>
              <p className="text-xl font-semibold text-white tabular-nums">
                {currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} credits
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{changePercent}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="h-[120px] w-full">
          <svg
            viewBox="0 0 600 120"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#9945FF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under the line */}
            <motion.path
              d={`${pathData} L 590 110 L 10 110 Z`}
              fill="url(#sparklineGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* The line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={isPositive ? '#14F195' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Current value dot */}
            <motion.circle
              cx="590"
              cy={120 - 10 - (currentValue - minValue) * ((120 - 20) / (maxValue - minValue || 1))}
              r="4"
              fill={isPositive ? '#14F195' : '#ef4444'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </svg>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground/60 mt-2">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioChartSkeleton() {
  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Skeleton className="h-[120px] w-full" />
        <div className="flex justify-between mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
