"use client";

import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Zap, Sparkles, Layout, ShoppingBag, ArrowRight, Globe,
  ChevronRight, CheckCircle2, Star, Cpu, Lock, Coins, Check,
  Users, TrendingUp, ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroY = useTransform(scrollY, [0, 350], [0, -60]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  const handleCTA = () => {
    router.push(user ? "/studio" : "/connect");
  };

  const galleryItems = [
    { src: "/landing/gallery_mech.png", title: "Iron Epoch", category: "Sci-Fi", price: "4.2 SOL", creator: "AetherMech" },
    { src: "/landing/gallery_cosmic_queen.png", title: "Cosmos Reign", category: "Fantasy", price: "6.8 SOL", creator: "StarForge" },
    { src: "/landing/gallery_dragon_city.png", title: "Sapphire Storm", category: "Cyberpunk", price: "3.5 SOL", creator: "DragonLab" },
    { src: "/landing/gallery_void_nomad.png", title: "Void Walker", category: "Abstract", price: "5.1 SOL", creator: "VoidCraft" },
  ];

  const pricingPlans = [
    {
      name: "Explorer",
      price: "Free",
      period: "",
      description: "Start your creative journey",
      color: "border-white/10",
      badge: null,
      features: [
        "10 generations / month",
        "512×512 resolution",
        "Basic canvas editor",
        "1 NFT mint / month",
        "Community gallery access",
      ],
      cta: "Get Started",
      ctaStyle: "border border-white/15 hover:border-primary/40 hover:bg-primary/5",
    },
    {
      name: "Creator",
      price: "19",
      period: "/mo",
      description: "For serious digital artists",
      color: "border-primary/40",
      badge: "Most Popular",
      features: [
        "200 generations / month",
        "Up to 1024×1024",
        "Full Fabric.js canvas",
        "10 NFT mints / month",
        "Prompt NFT creation",
        "Priority AI queue",
        "Analytics dashboard",
      ],
      cta: "Start Creating",
      ctaStyle: "gradient-primary text-white",
    },
    {
      name: "Studio",
      price: "59",
      period: "/mo",
      description: "Built for power creators",
      color: "border-secondary/30",
      badge: null,
      features: [
        "Unlimited generations",
        "Up to 2048×2048",
        "Advanced canvas + layers",
        "Unlimited NFT mints",
        "Bundle NFT minting",
        "API access",
        "Dedicated support",
        "White-label options",
      ],
      cta: "Go Pro",
      ctaStyle: "border border-secondary/40 hover:border-secondary text-secondary hover:bg-secondary/5",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background — minimal, single orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="glow-orb w-[700px] h-[700px] bg-primary" style={{ top: "-180px", left: "-200px" }} />
        <div className="glow-orb w-[500px] h-[500px] bg-secondary" style={{ bottom: "-100px", right: "-150px", animationDelay: "-5s" }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-16" style={{
        paddingTop: scrolled ? "12px" : "22px",
        paddingBottom: scrolled ? "12px" : "22px",
        background: scrolled ? "rgba(8,11,20,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <div className="relative">
            <Zap className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 bg-primary/30 blur-lg" />
          </div>
          <span className="text-lg font-display font-black tracking-tight gradient-text">PROCREATION AI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {["Gallery", "Features", "Pricing", "Platform"].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              className="text-[#6B7280] hover:text-foreground transition-colors duration-200">
              {link}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Button variant="ghost" className="text-[#6B7280] hover:text-foreground text-sm hidden md:flex" onClick={handleCTA}>
            Sign In
          </Button>
          <Button
            onClick={handleCTA}
            className="gradient-primary text-white font-bold px-5 h-9 text-sm rounded-lg shadow-none hover:opacity-88 transition-opacity duration-200"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
              user ? <>Studio <ChevronRight className="ml-1 h-3.5 w-3.5" /></> : <>Launch App <ArrowRight className="ml-1 h-3.5 w-3.5" /></>
            }
          </Button>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Hero image — right side as product preview */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/hero_main.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: copy */}
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-mono text-primary tracking-widest uppercase">AI × NFT × Solana</span>
              </div>

              <h1 className="text-[56px] md:text-7xl font-display font-black tracking-tighter leading-[0.9]">
                Create.<br />
                <span className="gradient-text">Mint.</span><br />
                Trade.
              </h1>

              <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
                The world&apos;s first <span className="text-foreground font-medium">decentralized generative art studio</span>.
                Turn your imagination into on-chain assets — with AI that thinks like an artist.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={handleCTA}
                className="gradient-primary text-white font-bold h-12 px-8 rounded-xl text-base hover:opacity-90 transition-opacity"
              >
                Start Generating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                className="h-12 px-8 rounded-xl border-white/12 bg-white/3 hover:bg-white/6 text-[#6B7280] hover:text-foreground transition-all"
              >
                View Gallery
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 pt-2"
            >
              {[
                { label: "NFTs Minted", value: "124K+" },
                { label: "Volume", value: "850K SOL" },
                { label: "Creators", value: "12K+" },
              ].map((s, i) => (
                <div key={i} className="border-l border-white/8 pl-6 first:border-none first:pl-0">
                  <p className="text-xl font-display font-black text-foreground">{s.value}</p>
                  <p className="text-xs text-[#6B7280] tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: floating art cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[420px] h-[520px]">
              {/* Main card */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/landing/gallery_cosmic_queen.png"
                  alt="Featured NFT"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="text-[10px] font-mono text-secondary tracking-widest mb-1">FANTASY</p>
                  <p className="font-display font-black text-xl">Cosmos Reign</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold">S</div>
                      <span className="text-xs text-[#6B7280]">StarForge</span>
                    </div>
                    <span className="text-sm font-bold text-secondary">6.8 SOL</span>
                  </div>
                </div>
              </div>
              {/* Small floating card top-right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-8 w-36 h-44 rounded-xl overflow-hidden border border-white/10 shadow-xl"
              >
                <Image src="/landing/gallery_dragon_city.png" alt="" fill className="object-cover" sizes="144px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-[9px] font-mono text-accent">CYBERPUNK</p>
                  <p className="text-xs font-bold">Sapphire Storm</p>
                </div>
              </motion.div>
              {/* Small floating card bottom-left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-10 bottom-16 w-32 h-40 rounded-xl overflow-hidden border border-white/10 shadow-xl"
              >
                <Image src="/landing/gallery_void_nomad.png" alt="" fill className="object-cover" sizes="128px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-[9px] font-mono text-primary">ABSTRACT</p>
                  <p className="text-xs font-bold">Void Walker</p>
                </div>
              </motion.div>
              {/* Live badge */}
              <div className="absolute -top-4 left-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-white/10 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Live on Solana
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">Community Creations</p>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight">The Creative Archive</h2>
            </div>
            <Button variant="ghost" className="text-[#6B7280] hover:text-foreground hidden md:flex">
              Explore All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] border border-white/8 card-hover cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <span className="text-[9px] font-mono text-secondary uppercase tracking-widest">{img.category}</span>
                  <p className="font-display font-bold text-base mt-0.5">{img.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#6B7280]">{img.creator}</span>
                    <span className="text-xs font-bold text-primary">{img.price}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6 bg-white/[0.012]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">Everything You Need</h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              A complete creative stack — from ideation to on-chain ownership.
            </p>
          </motion.div>

          {/* Big feature: Studio UI preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6"
          >
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-white/8 bg-white/3 p-6 min-h-[300px] group">
              <div className="absolute inset-0">
                <Image
                  src="/landing/gallery_mech.png"
                  alt=""
                  fill
                  className="object-cover opacity-15 group-hover:opacity-20 transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-transparent" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-black">Infinite Studio</h3>
                <p className="text-[#6B7280] max-w-sm leading-relaxed">
                  Generate stunning, high-resolution AI art with state-of-the-art models. Enhance prompts with integrated LLM intelligence for perfect results.
                </p>
                <ul className="space-y-2 pt-2">
                  {["Google Imagen 3 integration", "Prompt enhancement with Gemini", "Style presets & LoRA support"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-rows-2 gap-6">
              {[
                {
                  icon: Layout,
                  color: "secondary",
                  title: "Layered Canvas",
                  desc: "Pro-grade Fabric.js editor. Layer, filter, and composite artwork with precision tools.",
                },
                {
                  icon: Cpu,
                  color: "accent",
                  title: "4-Step Wizard",
                  desc: "Guided flow from prompt → edit → mint → sell. Zero friction from idea to on-chain asset.",
                },
              ].map((f, i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-white/3 p-6 group card-hover">
                  <div className={`w-10 h-10 rounded-xl bg-${f.color}/15 border border-${f.color}/20 flex items-center justify-center mb-4`}>
                    <f.icon className={`h-5 w-5 text-${f.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom 3 feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingBag, color: "primary", title: "NFT Marketplace", desc: "List and trade with automated royalties via Metaplex. Near-zero gas on Solana." },
              { icon: Lock, color: "secondary", title: "Prompt NFTs", desc: "Encrypt and sell your prompts. The ultimate creative IP — revealed only to the buyer." },
              { icon: Coins, color: "accent", title: "Bundle Minting", desc: "Mint your image and its prompt together as a bundle NFT for maximum collector value." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/8 bg-white/3 p-6 card-hover group"
              >
                <div className={`w-10 h-10 rounded-xl bg-${f.color}/15 border border-${f.color}/20 flex items-center justify-center mb-4`}>
                  <f.icon className={`h-5 w-5 text-${f.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono text-accent uppercase tracking-widest mb-3">The Flow</p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">From Idea to On-Chain</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">Four seamless steps. Minutes, not hours.</p>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: "01", icon: "✍️", title: "Describe", desc: "Write your vision. Our AI amplifies your prompt." },
                { num: "02", icon: "🎨", title: "Generate", desc: "High-res art in seconds via Imagen 3." },
                { num: "03", icon: "✏️", title: "Edit", desc: "Refine on the Fabric.js canvas." },
                { num: "04", icon: "🪙", title: "Mint & Sell", desc: "On-chain in one click. Earn royalties forever." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center text-3xl mb-5 relative z-10 bg-background">
                    {s.icon}
                    <span className="absolute -top-2.5 -right-2.5 text-[10px] font-mono font-black text-primary bg-background border border-primary/30 rounded-full w-6 h-6 flex items-center justify-center">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed px-2">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-6 bg-white/[0.012]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ImageIcon, value: "124,500+", label: "NFTs Minted", color: "text-primary" },
              { icon: TrendingUp, value: "850K SOL", label: "Total Volume", color: "text-secondary" },
              { icon: Users, value: "12,200", label: "Active Creators", color: "text-accent" },
              { icon: Star, value: "4.9 / 5", label: "Creator Rating", color: "text-primary" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/6"
              >
                <s.icon className={`h-5 w-5 ${s.color} mb-3 opacity-70`} />
                <p className={`text-3xl font-display font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[#6B7280] mt-1 tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">Simple, Transparent Plans</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Start free. Scale when ready. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${plan.color} p-6 flex flex-col ${i === 1 ? "bg-primary/5 shadow-[0_0_40px_rgba(153,69,255,0.08)]" : "bg-white/3"}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold gradient-primary text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="font-display font-black text-lg mb-1">{plan.name}</p>
                  <p className="text-xs text-[#6B7280] mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    {plan.price === "Free" ? (
                      <span className="text-4xl font-display font-black">Free</span>
                    ) : (
                      <>
                        <span className="text-[#6B7280] text-lg mb-1">$</span>
                        <span className="text-4xl font-display font-black">{plan.price}</span>
                        <span className="text-[#6B7280] text-sm mb-1">{plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 1 ? "text-primary" : "text-[#6B7280]"}`} />
                      <span className={i === 1 ? "text-foreground" : "text-[#9CA3AF]"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleCTA}
                  className={`w-full h-11 rounded-xl font-bold ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/8 bg-white/3 p-12 lg:p-20 text-center"
          >
            {/* Subtle art background */}
            <div className="absolute inset-0">
              <Image
                src="/landing/gallery_mech.png"
                alt=""
                fill
                className="object-cover opacity-8"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-mono text-primary tracking-widest uppercase">Join 12,000+ Creators</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">
                Your Art.<br />
                <span className="gradient-text">Your Chain.</span>
              </h2>
              <p className="text-[#6B7280] text-lg max-w-lg mx-auto leading-relaxed">
                The future of digital art is decentralized. Start creating today — free, fast, and on-chain.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  size="lg"
                  onClick={handleCTA}
                  className="gradient-primary text-white font-bold h-13 px-10 rounded-xl text-base hover:opacity-90 transition-opacity"
                >
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-13 px-10 rounded-xl border-white/12 text-[#6B7280] hover:text-foreground hover:bg-white/4"
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative">
                  <Zap className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 blur-lg" />
                </div>
                <span className="text-lg font-display font-black gradient-text">PROCREATION AI</span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
                The world&apos;s first decentralized AI generative art suite. Built on Solana.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { icon: Globe, href: "#" },
                  {
                    icon: () => (
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                    href: "#",
                  },
                ].map((s, i) => (
                  <a key={i} href={s.href} className="w-8 h-8 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-[#6B7280] hover:text-primary hover:border-primary/30 transition-all">
                    <s.icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: ["Studio", "Marketplace", "My NFTs", "Dashboard"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Privacy Policy"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-mono text-[#6B7280] uppercase tracking-widest mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-[#9CA3AF] hover:text-foreground transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#6B7280]">© 2026 Procreation Engineering. All rights reserved.</p>
            <p className="text-xs font-mono text-[#4B5563] uppercase tracking-widest">Built on Solana</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
