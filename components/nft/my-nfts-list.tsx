"use client";

import { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ExternalLink,
  ShoppingBag,
  Image as ImageIcon,
  Tag,
  Loader2,
  Search,
  Grid3X3,
  List,
  Filter,
  Sparkles,
  Crown,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useListNFTMutation } from "@/hooks/use-nfts";
import type { NFT, Generation } from "@prisma/client";

type NFTWithGeneration = NFT & {
  generation: Generation;
};

interface MyNFTsListProps {
  initialNfts: NFTWithGeneration[];
}

type ViewMode = "grid" | "list";
type FilterStatus = "all" | "minted" | "listed" | "sold";

export function MyNFTsList({ initialNfts }: MyNFTsListProps) {
  const [nfts, setNfts] = useState(initialNfts);
  const [listingNft, setListingNft] = useState<NFTWithGeneration | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const listMutation = useListNFTMutation();

  const handleList = async () => {
    if (!listingNft || !listingPrice) return;
    listMutation.mutate(
      {
        nftId: listingNft.id,
        priceSOL: parseFloat(listingPrice),
      },
      {
        onSuccess: () => {
          setListingNft(null);
          setListingPrice("");
          setNfts((prev) =>
            prev.map((n) => (n.id === listingNft.id ? { ...n, status: "LISTED" } : n))
          );
        },
      }
    );
  };

  const filteredNfts = nfts.filter((nft) => {
    const matchesSearch =
      nft.name?.toLowerCase().includes(search.toLowerCase()) ||
      nft.generation.prompt.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "minted") return matchesSearch && nft.status === "MINTED";
    if (filterStatus === "listed") return matchesSearch && nft.status === "LISTED";
    if (filterStatus === "sold") return matchesSearch && nft.status === "SOLD";

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MINTED":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">MINTED</Badge>
        );
      case "LISTED":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LISTED</Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">SOLD</Badge>
        );
      default:
        return null;
    }
  };

  const filters: { id: FilterStatus; label: string; count: number }[] = [
    { id: "all", label: "All", count: nfts.length },
    { id: "minted", label: "Minted", count: nfts.filter((n) => n.status === "MINTED").length },
    { id: "listed", label: "Listed", count: nfts.filter((n) => n.status === "LISTED").length },
    { id: "sold", label: "Sold", count: nfts.filter((n) => n.status === "SOLD").length },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1d29] to-[#13151f] border border-white/5 p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-30" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                <Flame className="h-3 w-3 mr-1" />
                {nfts.length} Items
              </Badge>
            </div>
            <h1 className="text-4xl font-display font-bold text-white">My Collection</h1>
            <p className="text-muted-foreground max-w-lg">
              View and manage your AI-generated NFTs. List them on the marketplace to start earning.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{nfts.filter((n) => n.status === "LISTED").length}</p>
              <p className="text-muted-foreground">Listed</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{nfts.filter((n) => n.status === "SOLD").length}</p>
              <p className="text-muted-foreground">Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                filterStatus === f.id
                  ? "bg-white text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  filterStatus === f.id ? "bg-black/10" : "bg-white/10"
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your NFTs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredNfts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-white/20" />
            </div>
            <p className="text-xl font-display text-white mb-2">No NFTs found</p>
            <p className="text-muted-foreground mb-6">Start creating in the Studio to build your collection</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Sparkles className="mr-2 h-4 w-4" />
              Create NFT
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredNfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden bg-[#13151f] border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={nft.generation.imageUrl}
                      alt={nft.name || "NFT"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 left-3">{getStatusBadge(nft.status)}</div>

                    <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 bg-white/90 text-black hover:bg-white"
                          asChild
                        >
                          <a
                            href={`https://solscan.io/token/${nft.mintAddress}?cluster=devnet`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => setListingNft(nft)}
                          disabled={nft.status === "LISTED"}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {nft.status === "LISTED" ? "Listed" : "List"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-bold text-white truncate">
                        {nft.name || `NFT #${nft.mintAddress.slice(0, 8)}`}
                      </CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
                      &ldquo;{nft.generation.prompt.slice(0, 80)}
                      {nft.generation.prompt.length > 80 && "..."}&rdquo;
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredNfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-[#13151f] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={nft.generation.imageUrl}
                    alt={nft.name || "NFT"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{nft.name || `NFT #${nft.mintAddress.slice(0, 8)}`}</p>
                  <p className="text-xs text-muted-foreground truncate">{nft.generation.prompt.slice(0, 60)}...</p>
                </div>
                <div className="flex items-center gap-3">{getStatusBadge(nft.status)}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://solscan.io/token/${nft.mintAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setListingNft(nft)}
                    disabled={nft.status === "LISTED"}
                  >
                    {nft.status === "LISTED" ? "Listed" : "List"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Modal */}
      <Dialog open={!!listingNft} onOpenChange={() => setListingNft(null)}>
        <DialogContent className="bg-[#13151f] border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Tag className="h-5 w-5 text-primary" />
              List NFT for Sale
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {listingNft && (
              <div className="flex gap-4 p-4 bg-white/5 rounded-xl">
                <img
                  src={listingNft.generation.imageUrl}
                  alt="NFT"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{listingNft.name || "Your NFT"}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{listingNft.generation.prompt}</p>
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Price (SOL)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white pl-4 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">SOL</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Platform fee: 2.5%</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setListingNft(null)} className="border-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleList}
              disabled={listMutation.isPending || !listingPrice}
              className="bg-primary hover:bg-primary/90"
            >
              {listMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  List NFT
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
