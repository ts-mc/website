"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Filter,
  Layers,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shrink,
  Sparkles,
  TriangleAlert,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { SchematicRenderer } from "schematic-renderer";
import type { FarmMaterialItem, FarmWithMetadata } from "@/types/farm";
import {
  blockLabel,
  normalizeSchematic,
  topCornerCamera,
  type BlockCategory,
  type SchematicBlock,
  type SchematicBounds,
} from "@/lib/schematic-viewer";

export interface SchematicViewer3DProps {
  farm: FarmWithMetadata;
  selectedFormat?: string;
  onMaterialsExtracted?: (materials: FarmMaterialItem[]) => void;
}

type LayerMode = "all" | "range" | "single";
type ViewMode = "preview" | "layers";
type FluidMode = "all" | "sources";
type Visibility = Record<string, boolean>;
type TextureMap = Map<string, HTMLImageElement>;

const CONTEXT_KEY = "theysix-schematic-renderer";
const CATEGORY_LABELS: Record<BlockCategory, string> = {
  building: "Building blocks",
  redstone: "Redstone",
  fluid: "Fluids",
  rail: "Rails",
  utility: "Utility",
  transparent: "Transparent / decorative",
};

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

function textureCandidates(block: SchematicBlock): string[] {
  const id = block.id.replace(/^minecraft:/, "");
  if (id === "water") return [block.isWaterSource ? "water_still" : "water_flow", "water_still"];
  if (id === "lava") return [block.isLavaSource ? "lava_still" : "lava_flow", "lava_still"];
  if (id === "redstone_dust") return ["redstone_dust_dot", "redstone_block"];
  if (id === "sticky_piston") return ["piston_top_sticky", "piston_side"];
  if (id === "piston") return ["piston_top", "piston_side"];
  if (id === "repeater") return ["repeater", "repeater_on"];
  if (id === "comparator") return ["comparator", "comparator_on"];
  if (id === "observer") return ["observer_front", "observer_side"];
  if (id === "hopper") return ["hopper_top", "hopper_outside"];
  if (id.endsWith("_door")) return [id, `${id}_bottom`];
  if (id.endsWith("_trapdoor")) return [id];
  if (id.endsWith("_slab")) return [id.replace(/_slab$/, "")];
  if (id.endsWith("_stairs")) return [id.replace(/_stairs$/, "")];
  return [id, id.replace(/_block$/, ""), "stone"];
}

async function loadTextureMap(context: any, blocks: SchematicBlock[]): Promise<TextureMap> {
  const manager = context?.cubane ?? context?.resourcePackManager;
  const pack = manager?.getEnabledPacks?.().at(-1);
  const textures: TextureMap = new Map();
  const previewTexture = manager?.previewPackTexture ?? manager?.previewTexture;
  if (!pack || !previewTexture) return textures;

  const uniqueBlocks = Array.from(new Map(blocks.map((block) => [block.id, block])).values());
  await Promise.all(
    uniqueBlocks.map(async (block) => {
      for (const candidate of textureCandidates(block)) {
        const url = await previewTexture.call(manager, pack.id, `block/${candidate}`);
        if (!url) continue;
        const image = new Image();
        image.decoding = "async";
        image.src = url;
        try {
          await image.decode();
          textures.set(block.id, image);
          return;
        } catch {
          URL.revokeObjectURL(url);
        }
      }
    }),
  );
  return textures;
}

function visibleBlock(block: SchematicBlock, layer: number, visibility: Visibility, fluidMode: FluidMode) {
  return (
    block.y === layer &&
    visibility[block.id] !== false &&
    (block.category !== "fluid" || fluidMode === "all" || block.isWaterSource || block.isLavaSource)
  );
}

function drawLayer(
  canvas: HTMLCanvasElement,
  blocks: SchematicBlock[],
  bounds: SchematicBounds,
  layer: number,
  visibility: Visibility,
  fluidMode: FluidMode,
  enhancedRedstone: boolean,
  textures: TextureMap,
  zoom: number,
  pan: { x: number; y: number },
) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 420;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = "#071019";
  context.fillRect(0, 0, width, height);

  const layerBlocks = blocks.filter((block) => visibleBlock(block, layer, visibility, fluidMode));
  const minX = layerBlocks.length ? Math.min(...layerBlocks.map((block) => block.x)) : bounds.minX;
  const maxX = layerBlocks.length ? Math.max(...layerBlocks.map((block) => block.x)) : bounds.maxX;
  const minZ = layerBlocks.length ? Math.min(...layerBlocks.map((block) => block.z)) : bounds.minZ;
  const maxZ = layerBlocks.length ? Math.max(...layerBlocks.map((block) => block.z)) : bounds.maxZ;
  const span = Math.max(maxX - minX + 1, maxZ - minZ + 1, 1);
  const baseCell = Math.max(7, Math.min((width - 96) / (span * 1.55), (height - 106) / (span * 0.82)));
  const cell = Math.max(7, baseCell * zoom);
  const originX = width / 2 + pan.x - ((maxX - minX) - (maxZ - minZ)) * cell * 0.38;
  const originY = height / 2 + pan.y - ((maxX - minX) + (maxZ - minZ)) * cell * 0.18;

  const drawFace = (points: [number, number][], image: HTMLImageElement | undefined, alpha = 1) => {
    context.save();
    context.globalAlpha = alpha;
    context.beginPath();
    points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
    context.closePath();
    context.clip();
    if (image) {
      const boundsX = Math.min(...points.map(([x]) => x));
      const boundsY = Math.min(...points.map(([, y]) => y));
      const boundsWidth = Math.max(...points.map(([x]) => x)) - boundsX;
      const boundsHeight = Math.max(...points.map(([, y]) => y)) - boundsY;
      context.imageSmoothingEnabled = false;
      context.drawImage(image, boundsX, boundsY, boundsWidth, boundsHeight);
    } else {
      context.fillStyle = "#64748b";
      context.fillRect(0, 0, width, height);
    }
    context.restore();
  };

  [...layerBlocks].sort((a, b) => a.x + a.z - (b.x + b.z)).forEach((block) => {
    const x = originX + (block.x - minX - (block.z - minZ)) * cell * 0.76;
    const y = originY + ((block.x - minX) + (block.z - minZ)) * cell * 0.38;
    const top = [[x, y], [x + cell * 0.76, y + cell * 0.38], [x, y + cell * 0.76], [x - cell * 0.76, y + cell * 0.38]] as [number, number][];
    const sideDepth = Math.max(3, cell * 0.2);
    const left = [top[3], top[2], [top[2][0], top[2][1] + sideDepth], [top[3][0], top[3][1] + sideDepth]] as [number, number][];
    const right = [top[1], top[2], [top[2][0], top[2][1] + sideDepth], [top[1][0], top[1][1] + sideDepth]] as [number, number][];
    const image = textures.get(block.id);
    const alpha = block.category === "fluid" || block.category === "transparent" ? 0.76 : 1;
    drawFace(left, image, alpha * 0.58);
    drawFace(right, image, alpha * 0.72);
    drawFace(top, image, alpha);
    context.strokeStyle = enhancedRedstone && block.category === "redstone" ? "#fca5a5" : "rgba(2, 6, 23, 0.6)";
    context.lineWidth = enhancedRedstone && block.category === "redstone" ? 1.5 : 0.7;
    context.beginPath();
    top.forEach(([pointX, pointY], index) => (index ? context.lineTo(pointX, pointY) : context.moveTo(pointX, pointY)));
    context.closePath();
    context.stroke();
  });

  context.fillStyle = "#cbd5e1";
  context.font = "11px ui-monospace, SFMono-Regular, monospace";
  context.fillText(`X ${minX}..${maxX}`, 18, 25);
  context.fillText(`Z ${minZ}..${maxZ}`, 18, 42);
  context.fillStyle = "#fbbf24";
  context.font = "700 13px ui-monospace, SFMono-Regular, monospace";
  context.fillText(`Y = ${layer}`, width - 76, 25);
  context.fillStyle = "#64748b";
  context.font = "11px ui-monospace, SFMono-Regular, monospace";
  context.fillText(`${layerBlocks.length} visible blocks`, 18, height - 18);
}

export function SchematicViewer3D({ farm, onMaterialsExtracted }: SchematicViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SchematicRenderer | null>(null);
  const contextRef = useRef<any>(null);
  const blocksRef = useRef<SchematicBlock[]>([]);
  const shouldExtractMaterialsRef = useRef(farm.materials.length === 0);
  const layerDragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState<"isometric" | "perspective" | "perspective_fpv">("isometric");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [layerMode, setLayerMode] = useState<LayerMode>("all");
  const [currentLayer, setCurrentLayer] = useState(0);
  const [bounds, setBounds] = useState<SchematicBounds | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fluidMode, setFluidMode] = useState<FluidMode>("all");
  const [enhancedRedstone, setEnhancedRedstone] = useState(true);
  const [visibility, setVisibility] = useState<Visibility>({});
  const [textures, setTextures] = useState<TextureMap>(new Map());
  const [layerZoom, setLayerZoom] = useState(1);
  const [layerPan, setLayerPan] = useState({ x: 0, y: 0 });

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
      const schematicUrl = farm.schematicUrl ? `/api/schematic-proxy?url=${encodeURIComponent(farm.schematicUrl)}` : undefined;
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
          vanilla: () => fetch("/minecraft-pack.zip", { cache: "force-cache" }).then((response) => response.blob()),
        }, { sharedRenderer: false }));
        contextRef.current = context;
        releaseContext = () => SchematicRendererContext.release(CONTEXT_KEY);
        renderer = new SchematicRenderer(canvas, {}, {}, {
          context,
          backgroundColor: 0x080d16,
          showGrid: false,
          showAxes: false,
          showRenderingBoundsHelper: false,
          enableDragAndDrop: false,
          enableGizmos: false,
          enableProgressBar: false,
          enableAdaptiveFPS: true,
          targetFPS: 60,
          idleFPS: 8,
          maxPixelRatio: 2,
          meshBuildingMode: "batched",
          wasmMeshBuilderOptions: { enabled: true, maxWorkers: 0 },
          postProcessingOptions: { enabled: true, enableSSAO: false, enableSMAA: true, enableGamma: true },
          cameraOptions: { defaultCameraPreset: "isometric", useTightBounds: true, enableZoomInOnLoad: false },
          sidebarOptions: { enabled: false },
          callbacks: { onLoadingProgress: (_file, value) => { if (!cancelled) setProgress(Math.round(value * 100)); } },
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
        blocksRef.current = normalized.blocks;
        if (shouldExtractMaterialsRef.current) {
          const materials = extractMaterials(loaded);
          if (materials.length) void persistMaterials(materials);
        }
        if (normalized.bounds) {
          setBounds(normalized.bounds);
          setCurrentLayer(normalized.bounds.maxY);
          const camera = topCornerCamera(normalized.bounds);
          renderer.cameraManager.activeCamera.setPositionLookAt(camera.position, camera.target);
        }
        renderer.resume();
        setStatus("ready");
        setTextures(await loadTextureMap(context, normalized.blocks));
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
      contextRef.current = null;
      releaseContext?.();
    };
  }, [farm.dn, farm.schematicUrl, persistMaterials]);

  useEffect(() => {
    if (!bounds || !layerCanvasRef.current || viewMode !== "layers") return;
    const render = () => drawLayer(layerCanvasRef.current!, blocksRef.current, bounds, currentLayer, visibility, fluidMode, enhancedRedstone, textures, layerZoom, layerPan);
    render();
    const observer = new ResizeObserver(render);
    observer.observe(layerCanvasRef.current);
    return () => observer.disconnect();
  }, [bounds, currentLayer, enhancedRedstone, fluidMode, layerPan, layerZoom, textures, viewMode, visibility]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const blockIds = useMemo(() => status === "ready" ? Array.from(new Set(blocksRef.current.map((block) => block.id))).sort() : [], [status]);
  const filteredIds = blockIds.filter((id) => id.includes(search.toLowerCase()));
  const grouped = (Object.keys(CATEGORY_LABELS) as BlockCategory[]).map((category) => ({
    category,
    ids: filteredIds.filter((id) => blocksRef.current.find((block) => block.id === id)?.category === category),
  })).filter((group) => group.ids.length);

  const updateLayers = useCallback((mode: LayerMode, layer: number) => {
    if (!rendererRef.current || !bounds) return;
    const next = Math.max(bounds.minY, Math.min(bounds.maxY, Math.round(layer)));
    setLayerMode(mode);
    setCurrentLayer(next);
    if (mode === "all") rendererRef.current.resetRenderingBounds(farm.dn, true);
    else rendererRef.current.setRenderingBoundsAxis(farm.dn, "y", mode === "single" ? next : bounds.minY, next);
    rendererRef.current.invalidate();
  }, [bounds, farm.dn]);

  useEffect(() => {
    if (!isPlaying || !bounds) return;
    const timer = window.setInterval(() => updateLayers("single", currentLayer >= bounds.maxY ? bounds.minY : currentLayer + 1), 350);
    return () => window.clearInterval(timer);
  }, [bounds, currentLayer, isPlaying, updateLayers]);

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
  const fitLayer = () => { setLayerZoom(1); setLayerPan({ x: 0, y: 0 }); };
  const setBlockVisibility = (id: string, visible: boolean) => setVisibility((current) => ({ ...current, [id]: visible }));
  const showAll = () => setVisibility(Object.fromEntries(blockIds.map((id) => [id, true])));
  const hideAll = () => setVisibility(Object.fromEntries(blockIds.map((id) => [id, false])));

  return (
    <div ref={containerRef} className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-hairline bg-[#071019] shadow-2xl ${isFullscreen ? "h-screen rounded-none" : ""}`}>
      <div className={`${isFullscreen ? "min-h-0 flex-1" : "aspect-[4/3] min-h-[320px] sm:aspect-[16/10] sm:min-h-[380px]"} relative`}>
        <canvas ref={canvasRef} className={`${viewMode === "preview" ? "block" : "hidden"} h-full w-full touch-none`} aria-label={`Interactive 3D schematic for ${farm.title}`} />
        <canvas
          ref={layerCanvasRef}
          className={`${viewMode === "layers" ? "block" : "hidden"} h-full w-full touch-none cursor-grab active:cursor-grabbing`}
          aria-label={`Textured schematic layer ${currentLayer}`}
          onWheel={(event) => { event.preventDefault(); setLayerZoom((value) => Math.max(0.55, Math.min(3, value * (event.deltaY > 0 ? 0.9 : 1.1)))); }}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); layerDragRef.current = { x: event.clientX, y: event.clientY, panX: layerPan.x, panY: layerPan.y }; }}
          onPointerMove={(event) => { const start = layerDragRef.current; if (start) setLayerPan({ x: start.panX + event.clientX - start.x, y: start.panY + event.clientY - start.y }); }}
          onPointerUp={() => { layerDragRef.current = null; }}
          onPointerCancel={() => { layerDragRef.current = null; }}
        />
        {status === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-xs space-y-3"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#4CADD0]" /><p className="text-sm font-semibold text-ink">Preparing farm preview</p><div className="h-1.5 overflow-hidden rounded-full bg-bg-elev"><div className="h-full bg-[#4CADD0] transition-all" style={{ width: `${progress}%` }} /></div><p className="font-mono text-[11px] text-ink-dim">{progress ? `${progress}%` : "Loading Minecraft textures"}</p></div></div>}
        {status === "error" && <div className="absolute inset-0 flex items-center justify-center bg-[#071019]/95 p-6 text-center"><div className="max-w-md space-y-3"><TriangleAlert className="mx-auto h-8 w-8 text-[#FBBF24]" /><p className="text-sm font-semibold text-ink">Schematic preview unavailable</p><p className="text-xs leading-relaxed text-ink-muted">{error}</p></div></div>}
        {status === "ready" && <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-xl border border-[#4CADD0]/30 bg-[#070A12]/85 px-3 py-1.5 text-[11px] font-bold text-[#9FEBF6] backdrop-blur"><Sparkles className="h-3.5 w-3.5" /> {viewMode === "preview" ? "360° Preview" : "Build layers"}</span>{bounds && <span className="rounded-xl border border-hairline bg-[#070A12]/85 px-2.5 py-1.5 font-mono text-[11px] text-ink backdrop-blur">Y {currentLayer}</span>}</div><div className="pointer-events-auto flex items-center gap-1.5"><button onClick={() => setSidebarOpen((open) => !open)} className="rounded-lg border border-hairline bg-[#070A12]/85 p-2 text-ink" title="Block filters" aria-label="Block filters"><Filter className="h-4 w-4" /></button>{viewMode === "preview" && (["isometric", "perspective", "perspective_fpv"] as const).map((mode) => <button key={mode} onClick={() => switchCamera(mode)} aria-label={`Use ${mode} camera`} title={`Use ${mode} camera`} className={`rounded-lg border p-2 ${cameraMode === mode ? "border-[#4CADD0]/50 bg-[#4CADD0]/20 text-[#9FEBF6]" : "border-hairline bg-[#070A12]/85 text-ink-muted"}`}><Camera className="h-4 w-4" /></button>)}{viewMode === "preview" && <><button onClick={resetCamera} aria-label="Reset camera" title="Reset camera" className="rounded-lg border border-hairline bg-[#070A12]/85 p-2 text-ink-muted"><RotateCcw className="h-4 w-4" /></button><button onClick={takeScreenshot} aria-label="Download screenshot" title="Download screenshot" className="rounded-lg border border-hairline bg-[#070A12]/85 p-2 text-ink-muted"><Download className="h-4 w-4" /></button></>}<button onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen" className="rounded-lg border border-hairline bg-[#070A12]/85 p-2 text-ink-muted">{isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}</button></div></div>}
        {isFullscreen && sidebarOpen && <aside className="absolute inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-hairline bg-[#070A12]/95 p-4 backdrop-blur"><div className="mb-4 flex items-center justify-between"><h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9FEBF6]">Block visibility</h3><button onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="text-ink-muted"><X className="h-4 w-4" /></button></div><div className="mb-3 flex gap-3"><button onClick={showAll} className="text-[11px] text-[#9FEBF6]">Show all</button><button onClick={hideAll} className="text-[11px] text-[#FBBF24]">Hide all</button><button onClick={() => setVisibility({})} className="text-[11px] text-ink-muted">Reset</button></div><label className="mb-4 flex items-center gap-2 rounded-lg border border-hairline bg-bg-elev px-2 py-2"><Search className="h-4 w-4 text-ink-dim" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search blocks" className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none" /></label>{grouped.map(({ category, ids }) => <section key={category} className="mb-4"><h4 className="mb-2 text-[10px] font-bold uppercase text-ink-dim">{CATEGORY_LABELS[category]}</h4>{ids.map((id) => <label key={id} className="flex items-center gap-2 py-1 text-xs text-ink"><input type="checkbox" checked={visibility[id] !== false} onChange={(event) => setBlockVisibility(id, event.target.checked)} className="accent-[#4CADD0]" />{blockLabel(id)}</label>)}</section>)}<hr className="my-4 border-hairline" /><h4 className="mb-2 text-[10px] font-bold uppercase text-ink-dim">Fluids</h4><div className="space-y-2 text-xs text-ink"><label className="flex gap-2"><input type="radio" checked={fluidMode === "all"} onChange={() => setFluidMode("all")} />Sources + flow</label><label className="flex gap-2"><input type="radio" checked={fluidMode === "sources"} onChange={() => setFluidMode("sources")} />Sources only</label></div><label className="mt-4 flex items-center gap-2 text-xs text-ink"><input type="checkbox" checked={enhancedRedstone} onChange={(event) => setEnhancedRedstone(event.target.checked)} className="accent-[#FF3B3B]" />Enhanced redstone</label></aside>}
      </div>
      {status === "ready" && bounds && <div className="relative z-30 flex-none border-t border-hairline bg-[#070A12]/95 px-3 py-3 backdrop-blur sm:px-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-1 rounded-xl bg-bg-elev p-1"><button onClick={() => { setViewMode("preview"); updateLayers("all", currentLayer); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${viewMode === "preview" ? "bg-[#4CADD0] text-slate-950" : "text-ink-muted"}`}>Preview</button><button onClick={() => { setViewMode("layers"); updateLayers("single", currentLayer); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${viewMode === "layers" ? "bg-[#FBBF24] text-slate-950" : "text-ink-muted"}`}><Layers className="mr-1 inline h-3.5 w-3.5" />Layers</button></div>{viewMode === "layers" ? <div className="flex items-center gap-1"><button disabled={currentLayer <= bounds.minY} onClick={() => updateLayers("single", currentLayer - 1)} title="Previous layer" aria-label="Previous layer" className="rounded-lg border border-hairline p-2 text-ink disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-[104px] text-center font-mono text-xs font-bold text-[#FBBF24]">Layer {currentLayer} / {bounds.maxY}</span><button disabled={currentLayer >= bounds.maxY} onClick={() => updateLayers("single", currentLayer + 1)} title="Next layer" aria-label="Next layer" className="rounded-lg border border-hairline p-2 text-ink disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div> : <span className="hidden text-xs text-ink-dim sm:block">Drag to orbit · scroll to zoom · shift-drag to pan</span>}{viewMode === "layers" && <div className="flex items-center gap-1"><button onClick={() => setLayerZoom((value) => Math.max(0.55, value / 1.2))} title="Zoom out" aria-label="Zoom out layer" className="rounded-lg p-2 text-ink-muted hover:bg-bg-elev"><ZoomOut className="h-4 w-4" /></button><button onClick={fitLayer} className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] text-ink">Fit layer</button><button onClick={() => setLayerZoom((value) => Math.min(3, value * 1.2))} title="Zoom in" aria-label="Zoom in layer" className="rounded-lg p-2 text-ink-muted hover:bg-bg-elev"><ZoomIn className="h-4 w-4" /></button></div>}</div>{viewMode === "layers" && <div className="mt-3 space-y-1.5"><div className="flex justify-between font-mono text-[10px] text-ink-dim"><span>Y {bounds.minY}</span><span className="text-[#FBBF24]">Y {currentLayer}</span><span>Y {bounds.maxY}</span></div><input aria-label="Current Y layer" type="range" min={bounds.minY} max={bounds.maxY} value={currentLayer} onChange={(event) => updateLayers("single", Number(event.target.value))} className="schematic-timeline w-full" /><div className="flex items-center justify-between text-[10px] text-ink-dim"><span>Construction timeline</span><button onClick={() => setIsPlaying((playing) => !playing)} className="inline-flex items-center gap-1 text-ink hover:text-ink">{isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />} {isPlaying ? "Pause" : "Play layers"}</button></div></div>}</div>}
    </div>
  );
}
