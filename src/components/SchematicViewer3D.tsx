"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  Expand,
  Layers3,
  LoaderCircle,
  Power,
  RotateCcw,
  Shrink,
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

function extractMaterials(blocks: ReturnType<typeof normalizeSchematic>["blocks"]): FarmMaterialItem[] {
  const counts = new Map<string, number>();
  blocks.forEach((block) => {
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
  const [hiddenBlocks, setHiddenBlocks] = useState<Set<string>>(new Set());
  const materialsCallbackRef = useRef(onMaterialsExtracted);
  materialsCallbackRef.current = onMaterialsExtracted;
  const [materials, setMaterials] = useState(farm.materials);
  const [search, setSearch] = useState("");
  const shouldExtractMaterialsRef = useRef(farm.materials.length === 0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [bounds, setBounds] = useState<SchematicBounds | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBlockControls, setShowBlockControls] = useState(false);
  const [activation, setActivation] = useState<"idle" | "paused" | "activating" | "active" | "unsupported" | "error">("idle");
  const [resourcePackName, setResourcePackName] = useState("Loading Minecraft resource pack");

  const persistMaterials = useCallback(async (materials: FarmMaterialItem[]) => {
    materialsCallbackRef.current?.(materials);
    try {
      await fetch("/api/farm-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dn: farm.dn, materials }),
      });
    } catch {
      return;
    }
  }, [farm.dn]);

  useEffect(() => {
    setStatus("loading");
    setActivation("idle");
    let cancelled = false;
    const controller = new AbortController();
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    let renderer: SchematicRenderer | null = null;
    let releaseContext: (() => void) | undefined;
    async function load() {
      if (cancelled) return;
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
        if (cancelled) return;
        const context = await SchematicRendererContext.acquire(CONTEXT_KEY, () => SchematicRendererContext.create({
          vanillaPack: async () => {
            const packResponse = await fetch("/minecraft-pack.zip?v=fluid-levels-1", { cache: "force-cache" });
            if (!packResponse.ok) throw new Error(`Minecraft resource pack failed to load (${packResponse.status})`);
            return packResponse.blob();
          },
        }, { sharedRenderer: false }));
        releaseContext = () => SchematicRendererContext.release(CONTEXT_KEY);
        if (cancelled) { releaseContext(); releaseContext = undefined; return; }
        renderer = new SchematicRenderer(canvas, {}, {}, {
          context,
          backgroundColor: 0x090a12,
          showGrid: false,
          showAxes: false,
          showRenderingBoundsHelper: false,
          enableDragAndDrop: false,
          enableGizmos: false,
          enableProgressBar: true,
          enableAdaptiveFPS: true,
          // Texture frames advance independently of redstone simulation.
          enableAnimatedTextures: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          interactionOptions: { enableBlockSelection: true },
          simulationOptions: { enableSimulation: true, autoInitialize: false },
          targetFPS: mobile ? 30 : 60,
          idleFPS: 1,
          maxPixelRatio: mobile ? 1.25 : 2,
          meshBuildingMode: "instanced",
          wasmMeshBuilderOptions: { enabled: true, maxWorkers: 0 },
          postProcessingOptions: { enabled: !mobile, enableSSAO: !mobile, enableSMAA: !mobile, enableGamma: true, ssaoPresets: { isometric: { aoRadius: 0.3, distanceFalloff: 0.1, intensity: 0.8 }, perspective: { aoRadius: 1, distanceFalloff: 0.4, intensity: 2 } } },
          cameraOptions: { defaultCameraPreset: "isometric", useTightBounds: true, enableZoomInOnLoad: false },
          showSlicerOverlay: false,
          callbacks: {
            onSimulationTicked: (tick) => {
              if (cancelled || !renderer) return;
              // Refresh the mesh twice per second during playback and after every manual step.
              if (tick % 10 === 0 || !renderer.getSimulationState()?.autoTickEnabled) {
                renderer.simulationManager?.syncToSchematic();
              }
            },
            onLoadingProgress: (_file, value) => { if (!cancelled) setProgress(Math.round(value * 100)); },
            onResourcePackLoaded: (name) => { if (!cancelled) setResourcePackName(name); },
          },
        });
        rendererRef.current = renderer;
        // The library leaves a queued resize callback alive after disposal.
        // Guard its entry point before it can access a missing active camera.
        const manager = renderer.renderManager;
        if (manager) {
          const resize = manager.updateCanvasSize.bind(manager);
          manager.updateCanvasSize = () => {
            if (!cancelled && renderer?.cameraManager?.activeCamera && canvas.parentElement?.clientHeight) resize();
          };
        }
        const response = await fetch(schematicUrl, { signal: controller.signal });
        if (cancelled) return;
        if (!response.ok) throw new Error(`Schematic download failed (${response.status})`);
        const bytes = await response.arrayBuffer();
        if (cancelled) return;
        await renderer.schematicManager?.loadSchematic(farm.dn, bytes, undefined, {
          onProgress: ({ progress: value }) => { if (!cancelled) setProgress(Math.round(value * 100)); },
        });
        if (cancelled) return;
        const loaded = renderer.schematicManager?.getSchematic(farm.dn)?.schematicWrapper;
        const normalized = normalizeSchematic(loaded);
        const extracted = extractMaterials(normalized.blocks);
        setMaterials(extracted);
        if (shouldExtractMaterialsRef.current) {
          const materials = extracted;
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
      controller.abort();
      renderer?.stopAutoTick();
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

  useEffect(() => {
    const updateVisibility = () => {
      const renderer = rendererRef.current;
      if (document.hidden) {
        renderer?.stopAutoTick();
        renderer?.suspend();
      } else if (status === "ready") {
        renderer?.resume();
        if (activation === "active") renderer?.startAutoTick();
      }
    };
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, [status, activation]);

  const resetCamera = () => {
    if (!rendererRef.current || !bounds) return;
    const camera = topCornerCamera(bounds);
    rendererRef.current.setCameraMode("isometric");
    rendererRef.current.cameraManager.activeCamera.setPositionLookAt(camera.position, camera.target);
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
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (containerRef.current.requestFullscreen) await containerRef.current.requestFullscreen();
      else setIsFullscreen(value => !value);
    } catch {
      setIsFullscreen(value => !value);
    }
  };
  const toggleBlockControls = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    if (showBlockControls) renderer.hideSlicerOverlay();
    else renderer.showSlicerOverlay({ corner: "bottom-left" });
    setShowBlockControls(!showBlockControls);
  };
  const activateFarm = async () => {
    const renderer = rendererRef.current;
    if (!renderer || activation === "activating") return;
    setActivation("activating");
    try {
      const initialized = await renderer.initializeSimulation();
      if (rendererRef.current !== renderer) return;
      if (!initialized) {
        setActivation("unsupported");
        return;
      }
      setActivation("active");
    } catch {
      if (rendererRef.current === renderer) setActivation("error");
    }
  };
  const togglePlayback = () => {
    if (activation === "active") {
      rendererRef.current?.stopAutoTick();
      rendererRef.current?.simulationManager?.syncToSchematic();
      setActivation("paused");
    } else if (activation === "paused") {
      setActivation("active");
    } else {
      void activateFarm();
    }
  };
  const toggleBlock = (name: string) => {
    const id = name.replace(/ /g, "_");
    const hidden = new Set(hiddenBlocks);
    if (hidden.has(id)) hidden.delete(id); else hidden.add(id);
    rendererRef.current?.schematicManager?.getSchematic(farm.dn)?.group.traverse((object: { userData: Record<string, unknown>; visible: boolean }) => {
      const key = object.userData.blockTypeKey;
      if (typeof key === "string" && key.replace(/^minecraft:/, "").split("[")[0] === id) object.visible = !hidden.has(id);
    });
    rendererRef.current?.invalidate();
    setHiddenBlocks(hidden);
  };
  return (
    <div ref={containerRef} className={`relative flex w-full flex-col overflow-hidden border border-[var(--rule)] bg-[#080b0e] ${isFullscreen ? "fixed inset-0 z-[60] h-[100dvh] rounded-none" : "h-full min-h-0"}`}>
      <p id="schematic-gestures" className="hidden [@media(any-pointer:coarse)]:block shrink-0 border-b border-white/10 px-3 py-2 text-center text-xs leading-snug text-white/80">
        Drag with one finger to rotate. Drag with two to pan, or pinch to zoom.
      </p>
      <div className="flex min-h-0 flex-1">
      <div className="relative min-w-0 flex-1">
        <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-describedby="schematic-gestures" aria-label={`Interactive 3D schematic for ${farm.title}`} />
        {status === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-xs space-y-3"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#4CADD0]" /><p className="text-sm font-semibold text-ink">Preparing farm preview</p><div className="h-1.5 overflow-hidden rounded-full bg-bg-elev"><div className="h-full bg-[#4CADD0] transition-all" style={{ width: `${progress}%` }} /></div><p className="font-mono text-[11px] text-ink-dim">{progress ? `${progress}%` : "Loading Minecraft textures"}</p></div></div>}
        {status === "error" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-md space-y-3"><TriangleAlert className="mx-auto h-8 w-8 text-[#FBBF24]" /><p className="text-sm font-semibold text-ink">Schematic preview unavailable</p><p className="text-xs leading-relaxed text-ink-muted">{error}</p></div></div>}
        {status === "ready" && <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-full border border-white/10 bg-[#17181b]/90 px-3 py-2 text-white shadow-lg backdrop-blur sm:left-5 sm:top-4 sm:px-4">
            <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen preview" : "Open fullscreen preview"} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="pointer-events-auto text-white/50 transition hover:text-white">{isFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}</button>
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/55 sm:text-[10px]">Preview build</span>
            <span className="h-4 w-px bg-white/15" />
            <span className="max-w-36 truncate text-xs font-semibold sm:max-w-64 sm:text-sm">{farm.title}</span>
            {bounds && <span className="hidden font-mono text-[9px] text-white/45 md:inline">{bounds.maxX - bounds.minX + 1}×{bounds.maxY - bounds.minY + 1}×{bounds.maxZ - bounds.minZ + 1}</span>}
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 font-mono text-[9px] font-bold text-emerald-400">MC {farm.version || "1.21+"}</span>
            {activation === "active" && <span className="rounded-full bg-[#4CADD0]/15 px-2 py-1 font-mono text-[9px] font-bold text-[#9FEBF6]">Redstone running</span>}
            <button onClick={takeScreenshot} aria-label="Download screenshot" title="Download screenshot" className="pointer-events-auto ml-1 text-white/50 transition hover:text-white"><Download className="size-4" /></button>
          </div>


          <p className="pointer-events-none absolute left-3 top-16 text-[10px] text-white/60"><span className="hidden [@media(pointer:fine)]:inline">Drag to rotate · Scroll to zoom · Right drag to pan</span></p>
          <div className="absolute bottom-3 left-1/2 z-20 flex w-max max-w-full -translate-x-1/2 flex-wrap justify-center items-center gap-1 rounded-full border border-white/10 bg-[#17181b]/90 p-1.5 text-white shadow-lg backdrop-blur sm:bottom-4 sm:gap-2 sm:px-2">
            <button onClick={togglePlayback} disabled={activation === "activating"} aria-label={activation === "active" ? "Pause simulation" : "Activate farm simulation"} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-emerald-400 hover:bg-white/5"><Power className="size-4" /><span>{activation === "active" ? "Pause" : activation === "activating" ? "Starting" : activation === "paused" ? "Resume" : "Run redstone"}</span></button>
            {activation === "paused" && <button onClick={() => rendererRef.current?.tickSimulation()} className="min-h-11 whitespace-nowrap rounded-full px-2 text-xs hover:bg-white/5">+1 tick</button>}
            {<button onClick={toggleBlockControls} aria-label={showBlockControls ? "Hide block visibility controls" : "Show block visibility controls"} title={showBlockControls ? "Hide block visibility controls" : "Show block visibility controls"} className={`grid size-11 place-items-center rounded-full transition sm:size-11 ${showBlockControls ? "bg-emerald-500/15 text-emerald-400" : "text-white/50 hover:bg-white/5 hover:text-white"}`}><Layers3 className="size-4" /></button>}
            <button onClick={resetCamera} aria-label="Reset camera" title="Reset camera" className="grid size-11 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-11"><RotateCcw className="size-4" /></button>
            <button onClick={takeScreenshot} aria-label="Download screenshot" title="Download screenshot" className="grid size-11 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-11"><Download className="size-4" /></button>
            <button onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen" className="grid size-11 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white sm:size-11">{isFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}</button>
          </div>
        </>}
      </div>
      {status === "ready" && <aside className="hidden w-72 shrink-0 flex-col border-l border-white/10 bg-[#181818] text-white/70 lg:flex">
        <div className="space-y-4 border-b border-white/10 p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400">Build · {materials.length} materials</h3>
          <button onClick={toggleBlockControls} aria-pressed={showBlockControls} className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 p-3 text-xs hover:bg-white/10"><Layers3 className="size-4" />{showBlockControls ? "Hide layers" : "Show layer controls"}</button>
          <input aria-label="Find a material" value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a block…" className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-4">{materials.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map(item => <li key={item.name} className="border-b border-white/5 py-3 text-xs"><label className="flex items-center gap-3"><input type="checkbox" checked={!hiddenBlocks.has(item.name.replace(/ /g, "_"))} onChange={() => toggleBlock(item.name)} aria-label={`Show ${item.name}`} /><span className="flex-1 capitalize">{item.name}</span><span className="font-mono text-white/40">{item.count.toLocaleString()}</span></label></li>)}</ul>
        <button onClick={() => void navigator.clipboard.writeText(materials.map(item => `${item.count} ${item.name}`).join("\n"))} className="m-4 rounded-full bg-white/5 p-3 font-mono text-xs hover:bg-white/10">Copy material list</button>
      </aside>}
      </div>
      {activation === "unsupported" && <p className="border-t border-white/10 bg-[#111216] px-3 py-2 text-center text-[11px] text-ink-muted">This schematic has no supported browser simulation. You can still inspect every block in 3D.</p>}
      {activation === "error" && <p className="border-t border-white/10 bg-[#111216] px-3 py-2 text-center text-[11px] text-[#FBBF24]">The browser could not activate this farm simulation. The 3D build remains available.</p>}
      <span className="sr-only">Resource pack: {resourcePackName}</span>
    </div>
  );
}
