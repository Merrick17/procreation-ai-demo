"use client";

import { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, Filter, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useBuyPromptMutation, type PromptListingWithRelations } from "@/hooks/use-prompts";

interface PromptsListProps {
  initialPrompts: PromptListingWithRelations[];
}

export function PromptsList({ initialPrompts }: PromptsListProps) {
  const [promptListings, setPromptListings] = useState(initialPrompts);
  const [search, setSearch] = useState("");
  const buyMutation = useBuyPromptMutation();

  const handleBuy = async (promptListing: PromptListingWithRelations) => {
    buyMutation.mutate(promptListing);
  };

  const filteredPrompts = promptListings.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Prompt Marketplace</h1>
          <p className="text-muted-foreground font-sans">Level up your AI generations with professional-grade prompt templates.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-border/40 bg-card/40"
            />
          </div>
          <Button variant="outline" size="icon">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-border/40 rounded-2xl bg-card/10 text-muted-foreground font-sans">
          No prompt templates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden glass border-none group hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
              <div className="aspect-video relative overflow-hidden bg-muted/20">
                {prompt.previewUrl ? (
                   <img 
                     src={prompt.previewUrl} 
                     alt={prompt.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   />
                ) : (
                   <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-primary/20" />
                   </div>
                )}
                <div className="absolute top-3 right-3">
                   <Badge className="bg-primary/20 backdrop-blur-md text-primary border-primary/20">
                     {prompt.priceSOL} SOL
                   </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate">{prompt.title}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {prompt.description}
                </p>
              </CardHeader>
              <CardFooter className="flex gap-2">
                 <Button 
                   className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                   onClick={() => handleBuy(prompt)}
                 >
                   <ShoppingCart className="h-4 w-4 mr-2" />
                   Buy
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
