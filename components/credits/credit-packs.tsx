"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/lib/use-auth";
import axios from "axios";
import { toast } from "sonner";
import { Coins, Zap, Sparkles, Crown, Loader2, CheckCircle2, ArrowRight, CreditCard, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { X402Paywall } from "@payai/x402-solana-react";
import "@payai/x402-solana-react/dist/style.css";

const CREDIT_PACKS = [
  { 
    id: "starter", 
    credits: 100, 
    priceUSD: 10,
    label: "Starter", 
    description: "Perfect for trying out the platform",
    icon: Zap,
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "hover:border-violet-500/50",
    features: ["20 generations", "Basic support", "Community access"],
  },
  { 
    id: "creator", 
    credits: 500, 
    priceUSD: 40,
    label: "Creator", 
    description: "For regular creators and artists",
    icon: Sparkles,
    gradient: "from-cyan-500/20 to-blue-500/20",
    borderColor: "hover:border-cyan-500/50",
    popular: true,
    features: ["100 generations", "Priority support", "Early access", "NFT minting"],
  },
  { 
    id: "studio", 
    credits: 1500, 
    priceUSD: 100,
    label: "Studio", 
    description: "For professional artists and studios",
    icon: Crown,
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "hover:border-amber-500/50",
    features: ["300 generations", "Priority support", "All models", "Bulk NFT minting", "Analytics"],
  },
];

export function CreditPacks() {
  const { publicKey } = useWallet();
  const { refreshUser } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const buyCredits = async (pack: typeof CREDIT_PACKS[0], signature: string) => {
    try {
      setLoadingId(pack.id);
      
      const res = await axios.post("/api/credits/purchase", {
        packId: pack.id,
        txSignature: signature,
      });

      if (res.data.success) {
        toast.success(`Successfully purchased ${pack.credits} credits!`);
        await refreshUser();
      } else if (res.data.paymentRequired) {
        toast.info("Payment required via x402");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Credit Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKS.map((pack, index) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md ${pack.borderColor} transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5`}>
              {pack.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />
              )}
              
              {pack.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    POPULAR
                  </span>
                </div>
              )}

              <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-50`} />
              
              <CardHeader className="relative text-center pt-8">
                <motion.div 
                  className="mx-auto bg-card/80 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <pack.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl font-display font-bold">{pack.label}</CardTitle>
                <CardDescription className="text-muted-foreground/80">{pack.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="relative text-center py-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {pack.credits}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">credits</span>
                </div>
                
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50">
                    <span className="text-2xl font-bold text-foreground">${pack.priceUSD}</span>
                    <span className="text-sm text-muted-foreground uppercase">USD</span>
                  </div>
                </div>
              
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {pack.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground/70 bg-card/50 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-primary/70" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="relative pb-8">
                <X402Paywall
                  amount={pack.priceUSD}
                  description={`Buy ${pack.credits} Credits`}
                  network="solana-devnet"
                  onPaymentSuccess={(sig) => buyCredits(pack, sig)}
                >
                  <Button 
                    className={`w-full h-12 text-base font-semibold ${pack.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400' : ''}`}
                    variant={pack.popular ? "default" : "outline"}
                    disabled={loadingId === pack.id}
                  >
                    {loadingId === pack.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Coins className="h-5 w-5 mr-2" />
                        Purchase
                        <ArrowRight className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </>
                    )}
                  </Button>
                </X402Paywall>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pricing Info */}
      <Card className="bg-muted/30 border-border/40">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Credit Usage Rates</p>
                <p className="text-sm text-muted-foreground">Pay per use with x402 (USDC)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">$0.05</span>
                <span className="text-muted-foreground">/ imagen-4.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">$0.02</span>
                <span className="text-muted-foreground">/ flux-schnell</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">$0.002</span>
                <span className="text-muted-foreground">/ prompt enhance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}