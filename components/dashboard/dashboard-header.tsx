"use client";

import { UserButton } from "@/components/wallet/user-button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0D0F14]/80 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search creations, NFTs, or prompts..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Only User Button */}
        <div className="flex items-center gap-3 shrink-0">
          <UserButton />
        </div>
      </div>
    </motion.header>
  );
}
