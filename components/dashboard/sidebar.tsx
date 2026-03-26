"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  LayoutDashboard,
  Image as ImageIcon,
  ShoppingBag,
  Zap,
  Settings,
  Layers,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Studio", href: "/studio", icon: Sparkles, highlight: true },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "My NFTs", href: "/my-nfts", icon: ImageIcon },
  { name: "Prompts", href: "/prompts", icon: Layers },
  { name: "Credits", href: "/credits", icon: Zap },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "#", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0B0D14] border-r border-white/[0.06] hidden lg:flex flex-col z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-white/[0.06] flex items-center px-4 relative">
          <Link href="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-base font-semibold text-white tracking-tight whitespace-nowrap">Procreation</span>
                  <span className="block text-[10px] text-primary font-medium tracking-widest uppercase whitespace-nowrap">AI Studio</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1A1D26] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] z-50"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.div
                  key="chevron-right"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="chevron-left"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronLeft className="h-3 w-3 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className={cn("space-y-1", isCollapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-lg transition-all duration-200 group",
                    isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full"
                      transition={{ type: "spring", duration: 0.3 }}
                    />
                  )}
                  <div className={cn(
                    "rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isCollapsed ? "w-10 h-10" : "w-9 h-9",
                    isActive ? "bg-primary/10" : "bg-white/[0.04] group-hover:bg-white/[0.06]"
                  )}>
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 flex items-center justify-between overflow-hidden"
                      >
                        <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                        {item.highlight && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/20 text-primary whitespace-nowrap">
                            NEW
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className={cn("border-t border-white/[0.06] py-3 space-y-1", isCollapsed ? "px-2" : "px-3")}>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-colors",
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={cn(
                  "rounded-lg flex items-center justify-center",
                  isCollapsed ? "w-10 h-10" : "w-9 h-9"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* Wallet Status - Expanded Only */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 mx-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-white">Wallet Connected</span>
                </div>
                <p className="text-xs text-muted-foreground/70 truncate">
                  View on Solscan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Spacer div that adjusts with sidebar */}
      <div
        className={cn(
          "hidden lg:block transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      />
    </>
  );
}
