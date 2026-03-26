"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function UserButton() {
  const { publicKey, connected } = useWallet();
  const { user, loading, login, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!connected) {
    return <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !h-10 !px-4 !py-2 !transition-all" />;
  }

  if (loading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Authenticating...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={login} variant="default" className="bg-primary hover:bg-primary/90">
        Sign In With Solana
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-foreground">
          {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
        </span>
        <span className="text-xs text-accent font-bold">
          {user.credits} Credits
        </span>
      </div>
      <Button onClick={logout} variant="ghost" size="icon" className="hover:text-destructive">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
