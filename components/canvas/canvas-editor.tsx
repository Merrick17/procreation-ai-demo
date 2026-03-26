"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, IText, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Square, 
  Type, 
  Trash2, 
  Layers, 
  FlipHorizontal, 
  Undo,
  Save,
  Palette
} from "lucide-react";

interface CanvasEditorProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
}

export function CanvasEditor({ imageUrl, onSave }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const container = containerRef.current;
      const width = container?.clientWidth || 800;
      const height = container?.clientHeight || 600;

      const c = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#0a0a0f",
      });
      setFabricCanvas(c);

      FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
        const scale = Math.min((width * 0.8) / (img.width || 1), (height * 0.8) / (img.height || 1), 1);
        img.scale(scale);
        c.add(img);
        c.centerObject(img);
        c.setActiveObject(img);
        c.renderAll();
      }).catch(console.error);
    }

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [imageUrl, fabricCanvas]);

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new IText("Double click to edit", {
      left: 100,
      top: 100,
      fontFamily: "Space Grotesk",
      fill: "#7c3aed",
      fontSize: 40,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
  };

  const addRect = () => {
    if (!fabricCanvas) return;
    const rect = new Rect({
      left: 150,
      top: 150,
      fill: "transparent",
      stroke: "#06b6d4",
      strokeWidth: 4,
      width: 100,
      height: 100,
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    activeObjects.forEach(obj => fabricCanvas.remove(obj));
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      multiplier: 1,
    });
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-card/20 p-6 rounded-2xl border border-border/40 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={addText} title="Add Text" className="hover:bg-primary/20 hover:text-primary transition-all">
             <Type className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={addRect} title="Add Shape" className="hover:bg-accent/20 hover:text-accent transition-all">
             <Square className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-border/40 mx-2" />
          <Button variant="ghost" size="icon" onClick={deleteSelected} className="hover:bg-destructive/20 hover:text-destructive transition-all">
             <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="secondary" size="sm" onClick={handleExport} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Finalize for Minting
           </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 flex items-center justify-center bg-black/60 rounded-xl overflow-hidden border border-white/5 shadow-inner">
        <canvas ref={canvasRef} className="shadow-[0_0_40px_rgba(124,58,237,0.15)]" />
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> Drag to move</span>
        <span className="flex items-center gap-1"><FlipHorizontal className="h-3 w-3" /> Shift + Drag to scale</span>
      </div>
    </div>
  );
}