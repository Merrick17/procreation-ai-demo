import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/wallet/wallet-provider";
import { AuthProvider } from "@/lib/use-auth";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import "@payai/x402-solana-react/dist/style.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3003"),
  title: {
    default: "Procreation AI - Generate, Edit, and Trade AI Masterpieces",
    template: "%s | Procreation AI"
  },
  description: "Create, mint, and trade AI-powered masterpieces on Solana. The world's first decentralized generative art suite with integrated NFT marketplace.",
  keywords: ["AI art", "NFT", "Solana", "generative art", "blockchain", "Metaplex", "crypto art", "digital art"],
  authors: [{ name: "Procreation Engineering" }],
  creator: "Procreation Engineering",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://procreation.ai",
    siteName: "Procreation AI",
    title: "Procreation AI - Decentralized Generative Art Suite",
    description: "Create, mint, and trade AI-powered masterpieces on Solana.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Procreation AI - Generative Art Suite"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Procreation AI",
    description: "Create, mint, and trade AI-powered masterpieces on Solana.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/30">
        <SolanaWalletProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="bottom-right" />
            </AuthProvider>
          </QueryProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
