"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  Expand,
  LoaderCircle,
  RotateCcw,
  Shrink,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { SchematicRenderer } from "schematic-renderer";
import type { FarmMaterialItem, FarmWithMetadata } from "@/types/farm";
import {
  normalizeSchematic,
  topCornerCamera,
  type SchematicBounds,
} from "@/lib/schematic-viewer";

export interface SchematicViewer3DProps {
  farm: FarmWithMetadata;
  selectedFormat?: string;
  onMaterialsExtracted?: (materials: FarmMaterialItem[]) => void;
}

const CONTEXT_KEY = "theysix-schematic-renderer";

function extractMaterials(schematic: unknown): FarmMaterialItem[] {
  const counts = new Map<string, number>();
  normalizeSchematic(schematic).blocks.forEach((block) => {
    counts.set(block.id, (counts.get(block.id) || 0) + 1);
  });
  return Array.from(counts, ([name, count]) => ({
    name: name.replace(/_/g, " "),
    count,
    stacks:
      count >= 64
        ? `${Math.floor(count / 64)} stack${count >= 128 ? "s" : ""}${count % 64 ? ` + ${count % 64}` : ""}`
        : `${count} items`,
  })).sort((a, b) => b.count - a.count);
}

export function SchematicViewer3D({ farm, onMaterialsExtracted }: SchematicViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SchematicRenderer | null>(null);
  const shouldExtractMaterialsRef = useRef(farm.materials.length === 0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState<"isometric" | "perspective" | "perspective_fpv">("isometric");
  const [bounds, setBounds] = useState<SchematicBounds | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resourcePackName, setResourcePackName] = useState("Loading Minecraft resource pack");

  const persistMaterials = useCallback(async (materials: FarmMaterialItem[]) => {
    onMaterialsExtracted?.(materials);
    try {
      await fetch("/api/farm-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dn: farm.dn, materials }),
      });
    } catch {
      return;
    }
  }, [farm.dn, onMaterialsExtracted]);

  useEffect(() => {
    let cancelled = false;
    let renderer: SchematicRenderer | null = null;
    let releaseContext: (() => void) | undefined;
    async function load() {
      const canvas = canvasRef.current;
      const isLocalSchematic = farm.schematicUrl?.startsWith("/api/local-schematic/");
      const schematicUrl = farm.schematicUrl
        ? isLocalSchematic
          ? farm.schematicUrl
          : `/api/schematic-proxy?url=${encodeURIComponent(farm.schematicUrl)}`
        : undefined;
      if (!canvas || !schematicUrl) {
        setError("This farm does not have a schematic available for preview.");
        setStatus("error");
        return;
      }
      if (!canvas.parentElement || canvas.parentElement.clientWidth === 0 || canvas.parentElement.clientHeight === 0) {
        window.requestAnimationFrame(() => void load());
        return;
      }
      try {
        const { SchematicRenderer, SchematicRendererContext } = await import("schematic-renderer");
        const context = await SchematicRendererContext.acquire(CONTEXT_KEY, () => SchematicRendererContext.create({
          vanillaPack: async () => {
            const packResponse = await fetch("/minecraft-pack.zip", { cache: "force-cache" });
            if (!packResponse.ok) throw new Error(`Minecraft resource pack failed to load (${packResponse.status})`);
            return packResponse.blob();
          },
        }, { sharedRenderer: false }));
        releaseContext = () => SchematicRendererContext.release(CONTEXT_KEY);
        renderer = new SchematicRenderer(canvas, {}, {}, {
          context,
          backgroundColor: 0x101216,
          showGrid: true,
          showAxes: false,
          showRenderingBoundsHelper: false,
          enableDragAndDrop: true,
          enableGizmos: false,
          enableProgressBar: true,
          enableAdaptiveFPS: true,
          targetFPS: 60,
          idleFPS: 8,
          maxPixelRatio: 2,
          meshBuildingMode: "batched",
          wasmMeshBuilderOptions: { enabled: true, maxWorkers: 0 },
          postProcessingOptions: { enabled: true, enableSSAO: true, enableSMAA: true, enableGamma: true, ssaoPresets: { isometric: { aoRadius: 0.3, distanceFalloff: 0.1, intensity: 0.8 }, perspective: { aoRadius: 1, distanceFalloff: 0.4, intensity: 2 } } },
          cameraOptions: { defaultCameraPreset: "isometric", useTightBounds: true, enableZoomInOnLoad: false },
          showSlicerOverlay: true,
          slicerOverlayOptions: { corner: "bottom-left" },
          callbacks: {
            onLoadingProgress: (_file, value) => { if (!cancelled) setProgress(Math.round(value * 100)); },
            onResourcePackLoaded: (name) => { if (!cancelled) setResourcePackName(name); },
          },
        });
        rendererRef.current = renderer;
        const response = await fetch(schematicUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`Schematic download failed (${response.status})`);
        await renderer.schematicManager?.loadSchematic(farm.dn, await response.arrayBuffer(), undefined, {
          onProgress: ({ progress: value }) => { if (!cancelled) setProgress(Math.round(value * 100)); },
        });
        if (cancelled) return;
        const loaded = renderer.schematicManager?.getSchematic(farm.dn)?.schematicWrapper;
        const normalized = normalizeSchematic(loaded);
        if (shouldExtractMaterialsRef.current) {
          const materials = extractMaterials(loaded);
          if (materials.length) void persistMaterials(materials);
        }
        if (normalized.bounds) {
          setBounds(normalized.bounds);
          const camera = topCornerCamera(normalized.bounds);
          renderer.cameraManager.activeCamera.setPositionLookAt(camera.position, camera.target);
        }
        renderer.resume();
        setStatus("ready");
        setResourcePackName(context.resourcePackManager.getEnabledPacks()[0]?.name ?? "Minecraft Default");
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "The schematic could not be rendered.");
          setStatus("error");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
      renderer?.suspend();
      renderer?.dispose();
      rendererRef.current = null;
      releaseContext?.();
    };
  }, [farm.dn, farm.schematicUrl, persistMaterials]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const resetCamera = () => {
    if (!rendererRef.current || !bounds) return;
    const camera = topCornerCamera(bounds);
    rendererRef.current.setCameraMode("isometric");
    rendererRef.current.cameraManager.activeCamera.setPositionLookAt(camera.position, camera.target);
    setCameraMode("isometric");
  };
  const switchCamera = (mode: "isometric" | "perspective" | "perspective_fpv") => {
    if (!rendererRef.current) return;
    rendererRef.current.setCameraMode(mode);
    void rendererRef.current.cameraManager.focusOnSchematics({ padding: 1.12, useTightBounds: true });
    setCameraMode(mode);
  };
  const takeScreenshot = async () => {
    const blob = await rendererRef.current?.takeScreenshot({ format: "image/png" });
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${farm.dn}-schematic.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await containerRef.current.requestFullscreen();
  };
  return (
    <div ref={containerRef} className={`relative flex w-full flex-col overflow-hidden border border-[var(--rule)] bg-[#080b0e] ${isFullscreen ? "h-screen rounded-none" : "h-full min-h-[420px] sm:min-h-[560px]"}`}>
      <div className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label={`Interactive 3D schematic for ${farm.title}`} />
        {status === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-xs space-y-3"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#4CADD0]" /><p className="text-sm font-semibold text-ink">Preparing farm preview</p><div className="h-1.5 overflow-hidden rounded-full bg-bg-elev"><div className="h-full bg-[#4CADD0] transition-all" style={{ width: `${progress}%` }} /></div><p className="font-mono text-[11px] text-ink-dim">{progress ? `${progress}%` : "Loading Minecraft textures"}</p></div></div>}
        {status === "error" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-md space-y-3"><TriangleAlert className="mx-auto h-8 w-8 text-[#FBBF24]" /><p className="text-sm font-semibold text-ink">Schematic preview unavailable</p><p className="text-xs leading-relaxed text-ink-muted">{error}</p></div></div>}
        {status === "ready" && <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-full border border-white/10 bg-[#17181b]/90 px-3 py-2 text-white shadow-lg backdrop-blur sm:left-5 sm:top-4 sm:px-4">
            <button onClick={toggleFullscreen} aria-label="Exit preview" title="Exit preview" className="pointer-events-auto text-white/50 transition hover:text-white"><RotateCcw className="size-4 -rotate-90" /></button>
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/55 sm:text-[10px]">Preview build</span>
            <span className="h-4 w-px bg-white/15" />
            <span className="max-w-36 truncate text-xs font-semibold sm:max-w-64 sm:text-sm">{farm.title}</span>
            {bounds && <span className="hidden font-mono text-[9px] text-white/45 md:inline">{bounds.maxX - bounds.minX + 1}×{bounds.maxY - bounds.minY + 1}×{bounds.maxZ - bounds.minZ + 1}</span>}
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 font-mono text-[9px] font-bold text-emerald-400">MC {farm.version || "1.21+"}</span>
            <button onClick={takeScreenshot} aria-label="Download screenshot" title="Download screenshot" className="pointer-events-auto ml-1 text-white/50 transition hover:text-white"><Download className="size-4" /></button>
          </div>


          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#17181b]/90 p-1.5 text-white shadow-lg backdrop-blur sm:bottom-4 sm:gap-2 sm:px-2">
            {(["isometric", "perspective", "perspective_fpv"] as const).map((mode, index) => <button key={mode} onClick={() => switchCamera(mode)} aria-label={`Use ${mode} camera`} title={mode.replaceAll("_", " ")} className={`grid size-8 place-items-center rounded-full text-[9px] font-bold transition sm:size-9 ${cameraMode === mode ? "bg-emerald-500/15 text-emerald-400" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>{index === 0 ? <GridIcon /> : index === 1 ? <BoxIcon /> : <PersonIcon />}</button>)}
            <span className="mx-1 h-5 w-px bg-white/10" />
            <button onClick={resetCamera} aria-label="Reset camera" title="Reset camera" className="grid size-8 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-9"><RotateCcw className="size-4" /></button>
            <button onClick={takeScreenshot} aria-label="Download screenshot" title="Download screenshot" className="grid size-8 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-9"><Download className="size-4" /></button>
            <button onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen" className="grid size-8 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-9">{isFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}</button>
          </div>
        </>}
      </div>
      <span className="sr-only">Resource pack: {resourcePackName}</span>
    </div>
  );
}

function GridIcon() { return <span className="font-mono text-[9px]">ISO</span>; }
function BoxIcon() { return <span className="font-mono text-[9px]">3D</span>; }
function PersonIcon() { return <span className="font-mono text-[9px]">FPV</span>; }
