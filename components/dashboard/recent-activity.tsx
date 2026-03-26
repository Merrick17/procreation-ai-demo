"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Wallet,
  Zap,
  Clock,
  Plus,
  ImageIcon,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import type { CreditTransaction } from "@prisma/client";
import Link from "next/link";

interface RecentActivityProps {
  transactions: (CreditTransaction & { type: string })[];
  isLoading?: boolean;
}

const getActivityConfig = (type: string, amount: number) => {
  const isPositive = amount > 0;

  switch (type) {
    case "PURCHASE":
      return {
        icon: Wallet,
        label: "Credit Purchase",
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/20",
        amountColor: "text-green-400",
        iconBg: "bg-green-400/10",
      };
    case "SPEND":
      return {
        icon: Zap,
        label: "Generation",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/20",
        amountColor: "text-amber-400",
        iconBg: "bg-amber-400/10",
      };
    case "REFUND":
      return {
        icon: RefreshCw,
        label: "Refund",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
        amountColor: "text-blue-400",
        iconBg: "bg-blue-400/10",
      };
    case "MINT":
      return {
        icon: ImageIcon,
        label: "NFT Minted",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/20",
        amountColor: "text-amber-400",
        iconBg: "bg-purple-400/10",
      };
    default:
      return {
        icon: Clock,
        label: type,
        color: "text-gray-400",
        bgColor: "bg-gray-400/10",
        borderColor: "border-gray-400/20",
        amountColor: isPositive ? "text-green-400" : "text-amber-400",
        iconBg: "bg-gray-400/10",
      };
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function RecentActivity({ transactions, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#13151F] border-white/[0.06]">
        <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/[0.04]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-14" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white/20" />
            </div>
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Transactions will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {transactions.slice(0, 5).map((tx, index) => {
              const config = getActivityConfig(tx.type, tx.amount);
              const Icon = config.icon;
              const isPositive = tx.amount > 0;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${config.borderColor} ${config.iconBg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{config.label}</p>
                    <p className="text-xs text-muted-foreground/70">{formatTimeAgo(tx.createdAt)}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold tabular-nums ${config.amountColor}`}>
                      {isPositive ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground/60">credits</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {transactions.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <Link href="/settings">
              <button className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
                View All Activity
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/[0.04]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
