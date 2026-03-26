import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey as toUmiPublicKey } from "@metaplex-foundation/umi";
import { mplTokenMetadata, fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createGenericFile } from "@metaplex-foundation/umi";

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

export const fetchNFT = async (mintAddress: string) => {
  const umi = createUmi(SOLANA_RPC_URL)
    .use(dasApi())
    .use(mplTokenMetadata());
  
  const mint = toUmiPublicKey(mintAddress);
  return fetchDigitalAsset(umi, mint);
};