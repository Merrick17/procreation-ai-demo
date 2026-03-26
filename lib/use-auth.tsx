"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { createContext, useContext, useCallback } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface User {
  id: string;
  walletAddress: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, signMessage, disconnect } = useWallet();
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        return res.data.user as User;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [queryClient]);

  const login = async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected. Please connect your Solana wallet first.");
      return;
    }

    try {
      // Show loading state
      toast.loading("Generating nonce...", { id: "auth-nonce" });

      // 1. Get nonce
      const nonceRes = await axios.get("/api/auth/nonce");
      const nonce = nonceRes.data.nonce;

      // Update toast
      toast.loading("Signing message...", { id: "auth-nonce" });

      // 2. Sign message
      const message = `Sign in to Procreation AI: ${nonce}`;
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);
      const signatureBase58 = bs58.encode(signature);

      // 3. Verify
      toast.loading("Verifying signature...", { id: "auth-nonce" });

      const verifyRes = await axios.post("/api/auth/verify", {
        signature: signatureBase58,
        publicKey: publicKey.toBase58(),
      });

      if (verifyRes.data.success) {
        queryClient.setQueryData(["user"], verifyRes.data.user);
        toast.success("Successfully connected!", { id: "auth-nonce" });
      } else {
        toast.error("Authentication failed. Please try again.", { id: "auth-nonce" });
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error(
        err.response?.data?.error ||
        err.message ||
        "Authentication failed. Please check your wallet connection and try again.",
        { id: "auth-nonce" }
      );
    }
  };

  const logout = async () => {
    try {
      toast.loading("Logging out...", { id: "auth-logout" });
      await axios.post("/api/auth/logout");
      await disconnect();
      queryClient.setQueryData(["user"], null);
      toast.success("Logged out successfully", { id: "auth-logout" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", { id: "auth-logout" });
    }
  };

  return (
    <AuthContext.Provider value={{ user: user || null, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
