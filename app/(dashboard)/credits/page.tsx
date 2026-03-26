"use client";

import { CreditPacks } from "@/components/credits/credit-packs";
import { useAuth } from "@/lib/use-auth";
import {
  Coins,
  History,
  CreditCard,
  Zap,
  ArrowUpRight,
  Wallet,
  Sparkles,
  Crown,
  Gift,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CreditsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1d29] to-[#13151f] border border-white/5 p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] opacity-20" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Gift className="h-3 w-3 mr-1" />
                Bonus Credits
              </Badge>
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Credits Store</h1>
            <p className="text-muted-foreground max-w-lg">
              Purchase credits to generate AI art and mint NFTs. The more you buy, the more you save.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6 min-w-[280px]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Coins className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-display font-bold text-white">{user?.credits || 0}</p>
                <p className="text-xs text-primary">~{Math.floor((user?.credits || 0) / 5)} generations</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Select a Pack</h2>
        </div>
        <CreditPacks />
      </div>

      {/* Transaction History */}
      <Card className="bg-[#13151f] border-white/5">
        <CardHeader className="border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <History className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">Transaction History</CardTitle>
                <CardDescription className="text-muted-foreground">Your recent credit activity</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-lg font-medium text-white mb-1">No transactions yet</p>
            <p className="text-sm text-muted-foreground mb-4">Your credit purchase history will appear here</p>
            <Link href="/studio">
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Sparkles className="mr-2 h-4 w-4" />
                Start Creating
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
