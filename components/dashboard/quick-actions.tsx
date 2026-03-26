"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  ShoppingBag,
  ImageIcon,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const quickActions = [
  {
    id: "create",
    label: "Create",
    description: "Generate AI Art",
    icon: Sparkles,
    href: "/studio",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Buy & Sell",
    icon: ShoppingBag,
    href: "/marketplace",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "collection",
    label: "Collection",
    description: "My NFTs",
    icon: ImageIcon,
    href: "/my-nfts",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    id: "credits",
    label: "Credits",
    description: "Buy Credits",
    icon: Wallet,
    href: "/credits",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

interface QuickActionsProps {
  isLoading?: boolean;
}

export function QuickActions({ isLoading }: QuickActionsProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#13151F] border-white/[0.06]">
        <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <button className="w-full p-3 rounded-lg bg-[#1A1D26] hover:bg-[#1F232D] border border-white/[0.04] hover:border-white/[0.08] transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.bgColor} shrink-0`}>
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{action.label}</p>
                      <p className="text-xs text-muted-foreground/70 hidden sm:block">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-white transition-colors ml-auto shrink-0" />
                  </div>
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card className="bg-[#13151F] border-white/[0.06]">
      <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
