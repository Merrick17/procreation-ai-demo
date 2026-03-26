"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Sparkles, ShoppingBag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import type { PromptListing } from "@prisma/client";

export default function PromptMarketplacePage() {
  const { user, refreshUser } = useAuth();
  const [prompts, setPrompts] = useState<PromptListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get("/api/marketplace/prompts");
        setPrompts(res.data.prompts);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const handleBuyPrompt = async (promptId: string) => {
    try {
      const res = await axios.post("/api/marketplace/prompts/buy", { promptId });
      if (res.data.success) {
        toast.success("Prompt purchased!");
        await refreshUser();
      }
    } catch (error) {
       toast.error("Failed to buy prompt.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-bold text-foreground">Prompt Marketplace</h1>
        <p className="text-muted-foreground font-sans">High-performance AI prompts for consistent expert results.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((p) => (
            <Card key={p.id} className="bg-card/40 border-primary/10 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="flex justify-between items-center">
                   <Badge variant="outline" className="border-accent/20 text-accent uppercase tracking-widest text-[10px]">
                     {p.tags?.[0] || "General"}
                   </Badge>
                   <span className="text-sm font-bold text-primary">{p.priceSOL} SOL</span>
                </div>
                <CardTitle className="mt-4 text-xl font-display">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic line-clamp-3">
                  "{p.description}..."
                </p>
              </CardContent>
              <CardFooter>
                 <Button 
                   className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                   onClick={() => handleBuyPrompt(p.id)}
                 >
                   <ShoppingBag className="h-4 w-4 mr-2" />
                   Unlock Prompt
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
