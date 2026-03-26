"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Palette, Maximize2, Sparkles, Wand2, Image as ImageIcon, Download,
  Loader2, Zap, Settings2, ChevronDown, CheckCircle2, Copy, RotateCcw,
  Layers, Cpu, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { MintModal } from "@/components/nft/mint-modal";
import { AssistantChat } from "@/components/assistant/chat-window";
import { useGenerateImageMutation, useEnhancePromptMutation, useGenerationStatus, useAvailableModels } from "@/hooks/use-studio";

const STYLE_PRESETS = [
  { id: "none", label: "None" },
  { id: "cinematic", label: "Cinematic" },
  { id: "anime", label: "Anime" },
  { id: "fantasy", label: "Fantasy" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "abstract", label: "Abstract" },
  { id: "photorealism", label: "Photo Real" },
];

const ASPECT_RATIOS = [
  { label: "1:1", w: 512, h: 512 },
  { label: "4:3", w: 768, h: 576 },
  { label: "16:9", w: 896, h: 512 },
  { label: "9:16", w: 512, h: 896 },
];

export default function StudioPage() {
  const { user, refreshUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("none");
  const [activeRatio, setActiveRatio] = useState("1:1");
  const [steps, setSteps] = useState(20);
  const [cfg, setCfg] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [overrideImage, setOverrideImage] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState("imagen-4.0");
  const [directImageUrl, setDirectImageUrl] = useState<string | null>(null);

  const generateMutation = useGenerateImageMutation();
  const enhanceMutation = useEnhancePromptMutation();
  const statusQuery = useGenerationStatus(jobId);
  const modelsQuery = useAvailableModels();

  const currentRatio = ASPECT_RATIOS.find(r => r.label === activeRatio) || ASPECT_RATIOS[0];

  const handleEnhance = () => {
    if (!prompt) return;
    enhanceMutation.mutate(prompt, {
      onSuccess: (data) => setPrompt(data.enhancedPrompt),
    });
  };

  const handleGenerate = () => {
    if (!prompt) return;
    generateMutation.mutate({
      prompt: activePreset !== "none" ? `${prompt}, ${activePreset} style` : prompt,
      width: currentRatio.w,
      height: currentRatio.h,
      modelId: selectedModelId,
      steps,
      cfg,
    }, {
      onSuccess: (data) => {
        // If imageUrl is returned immediately (sync generation), use it directly
        if (data.imageUrl) {
          setDirectImageUrl(data.imageUrl);
        }
        setJobId(data.jobId);
      },
    });
  };

  const handleCanvasSave = (dataUrl: string) => {
    setOverrideImage(dataUrl);
    setStep(3);
    setIsMintModalOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied!");
  };

  const handleReset = () => {
    setPrompt("");
    setJobId(null);
    setOverrideImage(null);
    setDirectImageUrl(null);
    setStep(1);
  };

  const isGenerating = generateMutation.isPending || statusQuery.data?.status === "GENERATING";
  const resultImage = overrideImage || directImageUrl || (statusQuery.data?.status === "DONE" ? statusQuery.data.imageUrl : null);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <AssistantChat />
      <MintModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        generationId={jobId || ""}
        onSuccess={refreshUser}
      />

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-[340px] shrink-0 flex flex-col border-r border-white/6 bg-[#080B14] overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-sm">
              {step === 1 ? "Generate" : step === 2 ? "Canvas Editor" : "Mint NFT"}
            </span>
          </div>
          <Badge className="bg-primary/10 border-primary/20 text-primary text-xs font-mono">
            <Zap className="h-2.5 w-2.5 mr-1" />
            {user?.credits ?? "—"} cr
          </Badge>
        </div>

        <div className="flex-1 px-5 py-5 space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${step === s ? "bg-primary text-white" : step > s ? "bg-primary/30 text-primary" : "bg-white/5 text-[#6B7280]"}`}>
                  {step > s ? <CheckCircle2 className="h-3 w-3" /> : s}
                </div>
                {s < 3 && <div className={`h-px flex-1 w-8 ${step > s ? "bg-primary/40" : "bg-white/8"}`} />}
              </div>
            ))}
            <span className="text-xs text-[#6B7280] ml-2">
              {step === 1 ? "Prompt" : step === 2 ? "Edit" : "Mint"}
            </span>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Prompt box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">Prompt</label>
                  <div className="flex items-center gap-1">
                    <button onClick={handleCopy} disabled={!prompt} className="p-1 rounded hover:bg-white/5 text-[#6B7280] hover:text-foreground transition-colors disabled:opacity-30">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button onClick={handleReset} className="p-1 rounded hover:bg-white/5 text-[#6B7280] hover:text-foreground transition-colors">
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision in detail..."
                    rows={5}
                    className="w-full bg-white/3 border border-white/8 rounded-xl px-4 pt-3 pb-10 text-sm text-foreground placeholder:text-[#4B5563] focus:outline-none focus:border-primary/40 resize-none transition-colors"
                  />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <span className="text-[10px] text-[#4B5563]">{prompt.length}/1000</span>
                    <Button
                      size="sm"
                      onClick={handleEnhance}
                      disabled={enhanceMutation.isPending || !prompt}
                      className="h-6 px-2 text-[10px] bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg"
                    >
                      {enhanceMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
                      Enhance
                    </Button>
                  </div>
                </div>
              </div>

              {/* Style presets */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setActivePreset(p.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        activePreset === p.id
                          ? "bg-primary text-white"
                          : "bg-white/4 border border-white/8 text-[#6B7280] hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect ratio */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {ASPECT_RATIOS.map(r => (
                    <button
                      key={r.label}
                      onClick={() => setActiveRatio(r.label)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeRatio === r.label
                          ? "bg-primary/15 border border-primary/40 text-primary"
                          : "bg-white/3 border border-white/8 text-[#6B7280] hover:border-white/15"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">Model</label>
                <div className="grid grid-cols-1 gap-1.5">
                  <select 
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    disabled={modelsQuery.isLoading}
                    className="w-full bg-[#080B14] border border-white/8 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/40 transition-colors cursor-pointer hover:border-white/20 disabled:opacity-50"
                  >
                    {modelsQuery.isLoading ? (
                      <option>Loading models...</option>
                    ) : (
                      modelsQuery.data?.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.id.replace(/-/g, ' ').toUpperCase()} ({m.priceUSD === "$0.00" ? "FREE" : m.priceUSD})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-foreground transition-colors w-full"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Advanced Settings
                <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#6B7280]">Steps</span>
                        <span className="font-mono text-foreground">{steps}</span>
                      </div>
                      <Slider value={[steps]} onValueChange={(v) => setSteps(v[0])} min={10} max={50} step={5} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#6B7280]">CFG Scale</span>
                        <span className="font-mono text-foreground">{cfg}</span>
                      </div>
                      <Slider value={[cfg]} onValueChange={(v) => setCfg(v[0])} min={1} max={15} step={0.5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate CTA */}
              <Button
                className="w-full h-12 font-display font-black text-sm gradient-primary text-white hover:opacity-90 transition-opacity rounded-xl"
                disabled={isGenerating || !prompt}
                onClick={handleGenerate}
              >
                {isGenerating
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
                  : <><Sparkles className="mr-2 h-4 w-4" /> Generate Image</>
                }
              </Button>

              {/* Model info */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/2 border border-white/6">
                <Cpu className="h-4 w-4 text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-[#6B7280] uppercase">Active Model</p>
                  <p className="text-xs font-medium truncate">{selectedModelId.replace(/-/g, ' ')}</p>
                </div>
                <Badge className="ml-auto text-[9px] bg-secondary/10 border-secondary/20 text-secondary">
                  {selectedModelId.includes('free') ? 'FREE' : 'PRO'}
                </Badge>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/8 border border-secondary/15">
                <p className="text-sm text-[#9CA3AF] flex items-start gap-2">
                  <Layers className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  Use the canvas tools to refine your artwork. Add text, shapes, or adjust filters.
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep(1)} className="w-full border-white/10 text-[#6B7280] hover:text-foreground">
                ← Back to Prompt
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MAIN CANVAS AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas toolbar */}
        <div className="h-12 border-b border-white/6 flex items-center px-5 gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="font-mono">{currentRatio.w} × {currentRatio.h}</span>
            <span className="text-white/20">·</span>
            <span>{activePreset === "none" ? "No Style" : activePreset}</span>
          </div>
          <div className="flex-1" />
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={!resultImage}
              onClick={() => setStep(step === 2 ? 1 : 2)}
              className="h-8 px-3 text-xs border border-white/8 text-[#6B7280] hover:text-foreground hover:border-white/15"
            >
              <Palette className="h-3.5 w-3.5 mr-1.5" />
              {step === 2 ? "View Result" : "Open Canvas"}
            </Button>
            {resultImage && (
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs border border-white/8 text-[#6B7280] hover:text-foreground hover:border-white/15" asChild>
                <a href={resultImage} download={`procreation-${Date.now()}.png`}>
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                </a>
              </Button>
            )}
            <Button
              size="sm"
              disabled={!resultImage}
              onClick={() => setIsMintModalOpen(true)}
              className="h-8 px-4 text-xs gradient-primary text-white font-bold hover:opacity-90 transition-opacity rounded-lg"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Mint NFT
            </Button>
          </div>
        </div>

        {/* Canvas content */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#060810]">
          {/* Subtle grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

          <AnimatePresence mode="wait">
            {step === 2 && resultImage ? (
              <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <CanvasEditor imageUrl={resultImage} onSave={handleCanvasSave} />
              </motion.div>

            ) : isGenerating && !resultImage ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="h-9 w-9 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-display font-black text-xl">Crafting Your Vision</p>
                  <p className="text-sm text-[#6B7280] max-w-sm">Our AI is interpreting your prompt. Usually takes 30–60 seconds.</p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </motion.div>

            ) : resultImage ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group h-full flex items-center justify-center p-8">
                <img
                  src={resultImage}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded-xl border border-white/8 shadow-2xl"
                />
                {/* Hover actions */}
                <div className="absolute top-10 right-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  <button
                    onClick={() => setStep(step === 2 ? 1 : 2)}
                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur border border-white/12 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <a href={resultImage} download className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur border border-white/12 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
                    <Download className="h-4 w-4" />
                  </a>
                </div>
                {/* Bottom bar over image */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-xl bg-black/70 backdrop-blur border border-white/10">
                  <Lock className="h-3.5 w-3.5 text-secondary" />
                  <span className="text-xs text-[#9CA3AF]">Ready to mint · Solana · Metaplex</span>
                  <Button size="sm" onClick={() => setIsMintModalOpen(true)} className="h-7 px-3 text-[11px] gradient-primary text-white rounded-lg font-bold">
                    Mint Now
                  </Button>
                </div>
              </motion.div>

            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5 text-center max-w-xs">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                  <ImageIcon className="h-9 w-9 text-white/15" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display font-black text-lg">Ready to create</p>
                  <p className="text-sm text-[#6B7280]">Enter a prompt on the left and hit Generate. Your artwork will appear here.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Cyberpunk city at dusk", "Cosmic witch queen", "Crystal dragon"].map(ex => (
                    <button
                      key={ex}
                      onClick={() => setPrompt(ex)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-white/8 text-[#6B7280] hover:border-primary/30 hover:text-foreground transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
