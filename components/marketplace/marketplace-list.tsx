"use client";

import { useState, useMemo } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Search,
  Filter,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useBuyListingMutation, type MarketplaceListing } from "@/hooks/use-marketplace";

interface MarketplaceListProps {
  initialListings: MarketplaceListing[];
}

type FilterTab = "all" | "images" | "prompts" | "recent" | "popular";

export function MarketplaceList({ initialListings }: MarketplaceListProps) {
  const [listings, setListings] = useState(initialListings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const buyMutation = useBuyListingMutation();

  const handleBuy = async (listing: MarketplaceListing) => {
    buyMutation.mutate(listing, {
      onSuccess: () => {
        setListings(prev => prev.filter(l => l.id !== listing.id));
      }
    });
  };

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchesSearch =
        l.nft?.generation?.prompt?.toLowerCase().includes(search.toLowerCase()) ||
        l.nft?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.user?.walletAddress?.toLowerCase().includes(search.toLowerCase());

      if (activeTab === "all") return matchesSearch;
      if (activeTab === "images") {
        return matchesSearch &&
          l.nft?.metadata?.attributes?.some(
            (a) => a.trait_type === "Type" && a.value === "image"
          );
      }
      if (activeTab === "prompts") {
        return matchesSearch &&
          l.nft?.metadata?.attributes?.some(
            (a) => a.trait_type === "Type" && a.value === "prompt"
          );
      }
      if (activeTab === "recent") {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return matchesSearch && new Date(l.createdAt) > oneDayAgo;
      }

      return matchesSearch;
    });
  }, [listings, search, activeTab]);

  const tabs: { id: FilterTab; label: string; icon: typeof LayoutGrid }[] = [
    { id: "all", label: "All Items", icon: LayoutGrid },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "prompts", label: "Prompts", icon: FileText },
    { id: "recent", label: "Recently Listed", icon: Clock },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1d29] to-[#13151f] border border-white/5 p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-30" />
        <div className="relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />
                  Live
                </Badge>
              </div>
              <h1 className="text-4xl font-display font-bold text-white">Explore Marketplace</h1>
              <p className="text-muted-foreground max-w-lg">
                Discover and collect unique AI-generated art and prompts from the Procreation community.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{listings.length}</p>
                <p className="text-muted-foreground">Active Listings</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{listings.reduce((acc, l) => acc + l.priceSOL, 0).toFixed(2)}</p>
                <p className="text-muted-foreground">Total Volume</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-16 z-30 bg-[#0A0C10]/95 backdrop-blur-xl py-4 -mx-6 px-6 border-y border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, prompt or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-white/20" />
            </div>
            <p className="text-xl font-display text-white mb-2">No listings found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden bg-[#13151f] border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={listing.nft.generation.imageUrl}
                      alt={listing.nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/50 backdrop-blur-md text-white border-white/10 text-[10px] uppercase">
                        {listing.nft.metadata?.attributes?.find((a) => a.trait_type === "Type")?.value || "IMAGE"}
                      </Badge>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(listing.id)}
                      className={cn(
                        "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        likedItems.has(listing.id)
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-black/50 text-white border border-white/10 hover:bg-white/20"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", likedItems.has(listing.id) && "fill-current")} />
                    </button>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3">
                      <div className="glass px-3 py-1.5 rounded-xl border border-white/10 font-bold text-sm text-white flex items-center gap-1 shadow-lg">
                        <span className="text-secondary">✦</span>
                        {listing.priceSOL}
                        <span className="text-xs text-white/60">SOL</span>
                      </div>
                    </div>

                    {/* Quick Action on Hover */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Button
                        className="w-full h-11 bg-white text-black hover:bg-white/90 font-semibold"
                        onClick={() => handleBuy(listing)}
                        disabled={buyMutation.isPending}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="p-4 space-y-3">
                    {/* Creator */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-white">
                        {listing.user?.walletAddress?.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {listing.user?.walletAddress?.slice(0, 4)}...{listing.user?.walletAddress?.slice(-4)}
                      </span>
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    </div>

                    {/* Title */}
                    <CardTitle className="text-base font-bold text-white truncate group-hover:text-primary transition-colors">
                      {listing.nft.name}
                    </CardTitle>

                    {/* Prompt Preview */}
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      &ldquo;{listing.nft.generation.prompt.slice(0, 60)}
                      {listing.nft.generation.prompt.length > 60 && "..."}&rdquo;
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
