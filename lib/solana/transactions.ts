import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";

interface CreateMarketplaceTxParams {
  publicKey: PublicKey;
  sellerAddress: string;
  priceSOL: number;
  platformFeePercent?: number;
}

export const createMarketplaceTransaction = ({
  publicKey,
  sellerAddress,
  priceSOL,
  platformFeePercent = 0.025 // 2.5%
}: CreateMarketplaceTxParams) => {
  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET || "G6shTDP4j7jZtU9N5JgW9uC8Yp7b7qE2k2p6d2J2y3z1";
  const platformFee = priceSOL * platformFeePercent;
  const sellerAmount = priceSOL - platformFee;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(sellerAddress),
      lamports: Math.floor(sellerAmount * LAMPORTS_PER_SOL),
    }),
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(treasuryAddress),
      lamports: Math.floor(platformFee * LAMPORTS_PER_SOL),
    })
  );

  return transaction;
};

export const confirmTx = async (connection: Connection, signature: string) => {
  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature,
    ...latestBlockhash
  }, "confirmed");
};
