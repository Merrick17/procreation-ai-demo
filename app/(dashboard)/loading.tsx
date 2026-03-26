import { Loader2, Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <Loader2 className="h-12 w-12 text-primary animate-spin absolute inset-0 opacity-20" />
      </div>
      <p className="text-lg font-display font-medium text-muted-foreground animate-pulse">
        Loading the creative engine...
      </p>
    </div>
  );
}
