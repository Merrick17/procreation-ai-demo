"use client";

import { UserButton } from "@/components/wallet/user-button";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Zap, Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ConnectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/studio");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glow-orb w-[500px] h-[500px] bg-primary/20 top-1/4 -left-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-secondary/20 bottom-1/4 -right-32" style={{ animationDelay: "-4s" }} />
        <div className="glow-orb w-[300px] h-[300px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: "-8s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-col items-center text-center space-y-10 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-primary"
        >
          <div className="relative">
            <Sparkles className="h-12 w-12" />
            <div className="absolute inset-0 bg-primary/40 blur-xl animate-pulse" />
          </div>
          <motion.h1
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-5xl md:text-6xl font-display font-bold tracking-tight gradient-text"
          >
            PROCREATION AI
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-muted-foreground font-sans max-w-2xl leading-relaxed"
        >
          The <span className="text-primary font-medium">neon frontier</span> of Web3 AI creativity. <br />
          Generate, Mint, and Trade unique digital assets on Solana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-10 glass-strong border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.15)] w-full max-w-md"
        >
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-foreground">Connect Your Wallet</h2>
              <p className="text-sm text-muted-foreground">Sign in with your Solana wallet to start creating</p>
            </div>
            <div className="flex justify-center">
              <UserButton />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-3 gap-12 pt-8 text-sm font-mono uppercase tracking-widest"
        >
          <div className="flex flex-col gap-2 items-center group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="text-foreground font-bold">AI Powered</span>
            <span className="text-muted-foreground text-xs">Generative Art</span>
          </div>
          <div className="flex flex-col gap-2 items-center group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-secondary" />
            </div>
            <span className="text-foreground font-bold">Solana</span>
            <span className="text-muted-foreground text-xs">Lightning Fast</span>
          </div>
          <div className="flex flex-col gap-2 items-center group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <span className="text-foreground font-bold">Ollama</span>
            <span className="text-muted-foreground text-xs">Smart Assistant</span>
          </div>
        </motion.div>
        
        {/* Loading indicator for auth check */}
        {loading && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking connection...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
