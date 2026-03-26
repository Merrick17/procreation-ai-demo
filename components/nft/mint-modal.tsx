"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import type { SignerWalletAdapterProps, MessageSignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Zap, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";

// Metaplex Static Imports
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata, createNft } from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { generateSigner, percentAmount, createGenericFile } from "@metaplex-foundation/umi";

import { getCreditCost, getPriceUSD } from "@/lib/x402";

// Payment Library (Removed X402Paywall)

interface MintModalProps {
  generationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

export function MintModal({ generationId, isOpen, onClose, onSuccess }: MintModalProps) {
  const { publicKey, signTransaction, signAllTransactions, signMessage } = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mintType, setMintType] = useState<"image" | "prompt" | "bundle">("image");
  const [royalty, setRoyalty] = useState(5);
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState<"form" | "sign" | "confirming" | "success">("form");

  const handleMint = async () => {
    if (!name || !publicKey || !signTransaction || !signAllTransactions) return;

    try {
      setIsMinting(true);
      setStep("sign");

      // Step 1: Get Generation Info
      const genRes = await axios.get(`/api/generate/status/${generationId}`);
      const imageUrl = genRes.data.imageUrl;
      if (!imageUrl) throw new Error("Generation image not found");

      // Step 2: Initialize Umi
      const umi = createUmi(SOLANA_RPC_URL)
        .use(mplTokenMetadata())
        .use(irysUploader({ address: "https://devnet.irys.xyz" }))
        .use(walletAdapterIdentity({
            publicKey: publicKey,
            signTransaction: signTransaction as SignerWalletAdapterProps['signTransaction'],
            signAllTransactions: signAllTransactions as SignerWalletAdapterProps['signAllTransactions'],
            signMessage: signMessage as MessageSignerWalletAdapterProps['signMessage'],
        }));

      // Step 3: Metadata Upload
      let imageUri = imageUrl;
      if (mintType !== "prompt") {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = new Uint8Array(await imageBlob.arrayBuffer());
        const imageFile = createGenericFile(imageBuffer, "image.png", { contentType: "image/png" });
        const [uploadedUri] = await umi.uploader.upload([imageFile]);
        imageUri = uploadedUri;
      }

      const metadataJson = {
        name,
        description,
        image: imageUri,
        attributes: [
          { trait_type: "Type", value: mintType },
          { trait_type: "AI Model", value: "Imagen" },
        ],
        properties: {
          files: mintType !== "prompt" ? [{ uri: imageUri, type: "image/png" }] : [],
          category: mintType === "prompt" ? "text" : "image",
          prompt: mintType !== "image" ? genRes.data.prompt : undefined,
        }
      };

      const [metadataUri] = await umi.uploader.uploadJson(metadataJson);

      // Step 4: Mint NFT
      setStep("confirming");
      const mint = generateSigner(umi);
      const { signature } = await createNft(umi, {
        mint,
        name,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(royalty),
      }).sendAndConfirm(umi);

      const txid = bs58.encode(signature);

      // Step 5: Finalize
      await axios.post("/api/nft/mint/confirm", {
        mintAddress: mint.publicKey.toString(),
        txid,
        metadataUri,
        generationId,
        name,
        description,
        type: mintType,
      });

      setStep("success");
      toast.success("NFT minted successfully!");

      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 2000);

    } catch (error: unknown) {
      console.error("Mint error:", error);
      const err = error as { message?: string };
      toast.error(err.message || "Failed to mint NFT");
      setStep("form");
    } finally {
      setIsMinting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStep("form");
  };

  const steps = [
    { id: "form", label: "Details", icon: Zap },
    { id: "sign", label: "Sign", icon: Wallet },
    { id: "confirming", label: "Minting", icon: Loader2 },
    { id: "success", label: "Done", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 bg-card border-primary/20 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Mint Your Creation
          </DialogTitle>
          <DialogDescription>
            Your connected wallet will be the fee payer for this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4 px-6 border-b border-white/5 shrink-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                ${i <= currentStepIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"}
              `}>
                {i < currentStepIndex ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <s.icon className={`h-3 w-3 ${step === s.id && s.id === "confirming" ? "animate-spin" : ""}`} />
                )}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === "form" && (
            <div className="grid gap-4 py-4 px-6">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Wallet (Fee Payer)</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {publicKey ? `${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-4)}` : "Not connected"}
                  </p>
                </div>
                {!publicKey && (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </div>

              {/* Mint Type Selection */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Mint Assets</label>
                <div className="flex gap-2">
                  {[
                    { id: "image", label: "Image Only", icon: "🖼️" },
                    { id: "prompt", label: "Prompt Only", icon: "🔒" },
                    { id: "bundle", label: "Bundle (Both)", icon: "📦" }
                  ].map(t => (
                    <Button
                      key={t.id}
                      variant={mintType === t.id ? "default" : "outline"}
                      className="flex-1 h-16 flex flex-col gap-1 text-[10px]"
                      onClick={() => setMintType(t.id as "image" | "prompt" | "bundle")}
                    >
                      <span className="text-lg">{t.icon}</span>
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cyberpunk Samurai #001"
                  className="border-primary/20 focus:border-primary"
                />
                {!name && (
                  <p className="text-xs text-destructive mt-1">NFT name is required</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A unique digital asset generated with Procreation AI..."
                  className="w-full min-h-[100px] bg-background border border-primary/20 rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                />
                {!description && (
                  <p className="text-xs text-destructive mt-1">Description is required</p>
                )}
              </div>

              <div className="grid gap-4">
                <div className="flex justify-between text-sm">
                  <label className="font-medium">Secondary Royalty</label>
                  <span className="text-primary font-bold">{royalty}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="15" step="0.5"
                  value={royalty}
                  onChange={(e) => setRoyalty(parseFloat(e.target.value))}
                  className="accent-primary"
                />
                <p className="text-[10px] text-muted-foreground">Percentage you earn on all future secondary sales.</p>
              </div>

            </div>
          )}

          {step === "sign" && (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <p className="text-lg font-medium">Sign with your wallet</p>
              <p className="text-sm text-muted-foreground">
                Approve the transaction in your wallet to mint your NFT
              </p>
            </div>
          )}

          {step === "confirming" && (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-lg font-medium">Confirming on chain...</p>
              <p className="text-sm text-muted-foreground">
                Please wait while your NFT is being minted
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-lg font-medium text-green-500">NFT Minted!</p>
              <p className="text-sm text-muted-foreground">
                Your creation is now on the blockchain
              </p>
            </div>
          )}
        </div>

        {step === "form" && (
          <DialogFooter className="px-6 pb-6 pt-4 border-t border-white/5 shrink-0 gap-2">
            <Button variant="outline" onClick={onClose} disabled={isMinting}>
              Cancel
            </Button>
            <Button
              disabled={isMinting || !name || !description || !publicKey || name.length < 3 || name.length > 50 || description.length < 10 || description.length > 500}
              className="bg-primary hover:bg-primary/90"
              onClick={handleMint}
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
