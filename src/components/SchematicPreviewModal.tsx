"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileCode,
  Download,
  Info,
  Grid,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  ArrowDownToLine,
  FolderOpen,
  MousePointer2,
  Save,
} from "lucide-react";
import { SchematicViewer3D } from "@/components/SchematicViewer3D";
import { MaterialListChecklist } from "@/components/MaterialListChecklist";
import type { FarmMaterialItem, FarmWithMetadata } from "@/types/farm";

interface SchematicPreviewModalProps {
  farm: FarmWithMetadata;
  isOpen: boolean;
  onClose: () => void;
  onMaterialsExtracted?: (materials: FarmMaterialItem[]) => void;
}

export function SchematicPreviewModal({ farm, isOpen, onClose, onMaterialsExtracted }: SchematicPreviewModalProps) {
  const [hasOpened, setHasOpened] = useState(isOpen);
  const [activeTab, setActiveTab] = useState<"viewer" | "materials" | "guide">("viewer");
  const [selectedFormat, setSelectedFormat] = useState<"litematic" | "schematic" | "schem" | "nbt">("litematic");

  useEffect(() => {
    if (isOpen) setHasOpened(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!hasOpened) return null;

  const farmFormats = {
    litematic: `${farm.dn}.litematic`,
    schematic: `${farm.dn}.schematic`,
    schem: `${farm.dn}.schem`,
    nbt: `${farm.dn}.nbt`,
  };

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center p-0 animate-in fade-in duration-200 ${isOpen ? "flex" : "hidden"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#08090d]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#0a0b10] shadow-2xl animate-in fade-in duration-200 sm:h-[min(96dvh,1080px)] sm:max-w-[1800px] sm:shadow-[0_32px_120px_rgba(0,0,0,.72)]">

        {/* Modal Header */}
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-white/10 bg-[#111216] px-4 py-2 sm:min-h-14 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-white/45 sm:text-[10px]">
                  <Sparkles className="size-3.5 text-emerald-400" /> TheySix / Build preview
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
                  MC {farm.version || "1.21+"}
                </span>
              </div>
              <h2 className="mt-0.5 line-clamp-1 text-sm font-semibold text-white sm:text-base">{farm.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/55 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close schematic viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex min-h-10 items-stretch gap-1 border-b border-white/10 bg-[#111216] px-3 text-xs font-semibold overflow-x-auto scrollbar-none sm:px-6">
          <button
            onClick={() => setActiveTab("viewer")}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 transition-colors whitespace-nowrap ${
              activeTab === "viewer"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white/45 hover:text-white"
            }`}
          >
            <Grid className="size-3.5" /> 3D View
          </button>

          <button
            onClick={() => setActiveTab("materials")}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 transition-colors whitespace-nowrap ${
              activeTab === "materials"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white/45 hover:text-white"
            }`}
          >
            <ClipboardList className="size-3.5" /> Materials
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 transition-colors whitespace-nowrap ${
              activeTab === "guide"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white/45 hover:text-white"
            }`}
          >
            <Info className="size-3.5" /> Guide
          </button>
        </div>

        {/* Modal Body */}
        <div className={`${activeTab === "viewer" ? "overflow-hidden p-0" : "overflow-y-auto bg-[#0b0c11] p-4 sm:p-6"} min-h-0 flex-1 text-sm text-ink`}>
          {/* TAB 1: 3D SCHEMAT.IO VIEWER */}
          {activeTab === "viewer" && (
            <div className="h-full min-h-0">
              <SchematicViewer3D farm={farm} selectedFormat={selectedFormat} onMaterialsExtracted={onMaterialsExtracted} />

              <div className="hidden grid-cols-2 gap-px bg-[var(--rule)] text-xs sm:grid sm:grid-cols-4">
                <div className="p-3 rounded-2xl bg-[#070A12]/70 border border-hairline space-y-1">
                  <span className="text-[10px] text-ink-dim uppercase font-mono">Format</span>
                  <p className="font-mono font-bold text-[#FBBF24]">{farmFormats[selectedFormat]}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#070A12]/70 border border-hairline space-y-1">
                  <span className="text-[10px] text-ink-dim uppercase font-mono">Target Version</span>
                  <p className="font-bold text-[#9FEBF6]">Minecraft Java {farm.version || "1.21+"}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#070A12]/70 border border-hairline space-y-1">
                  <span className="text-[10px] text-ink-dim uppercase font-mono">Expected Rates</span>
                  <p className="font-bold text-[#4CAF50]">{farm.rates || "High Yield"}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#070A12]/70 border border-hairline space-y-1">
                  <span className="text-[10px] text-ink-dim uppercase font-mono">Verification</span>
                  <p className="font-bold text-ink flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" /> Staff Verified
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MATERIAL LIST & CHECKLIST */}
          {activeTab === "materials" && (
            <div className="space-y-4">
              {farm.materials && farm.materials.length > 0 && (
                <p className="text-xs text-ink-muted">
                  Check off materials as you collect them in Minecraft. Your inventory progress is saved automatically.
                </p>
              )}
              <MaterialListChecklist
                materials={farm.materials || []}
                farmId={farm.dn}
                farmTitle={farm.title}
                youtubeUrl={farm.youtubeUrl}
              />
            </div>
          )}

          {/* TAB 3: LITEMATICA & STRUCTURE GUIDE */}
          {activeTab === "guide" && (
            <div className="mx-auto max-w-4xl space-y-7 text-xs leading-relaxed sm:text-sm">
              <div className="border-b border-white/10 pb-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-emerald-400">Schematic guide / {farm.dn}</p>
                <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Export a schematic from Minecraft</h3>
                <p className="mt-2 max-w-3xl text-[#9d9d9d]">Choose the format that matches the tool you use. Litematica is recommended for modern Java Edition; WorldEdit and structure blocks are good alternatives.</p>
              </div>

              <GuideSection icon={<Save className="size-4" />} title="Litematica (.litematic) · Recommended" description={<>Litematica is the most common format for Minecraft Java builds. Install <strong>Litematica</strong> and its dependency <strong>MaLiLib</strong> for your Minecraft version.</>} steps={[
                <>Open the Litematica menu with <kbd className="rounded border border-white/10 bg-[#181818] px-1.5 py-0.5 font-mono text-[11px] text-white">M</kbd> and switch to area selection mode.</>,
                <>Use the selection tool to mark the two corners around the entire build.</>,
                <>Open the menu and choose <strong>Area Editor → Save Schematic</strong>. Save the <code>.litematic</code> file in <code>.minecraft/schematics</code>.</>,
              ]} />

              <GuideSection icon={<FolderOpen className="size-4" />} title="WorldEdit (.schem)" description="Use WorldEdit in single player or on a server to save a selected region." steps={[
                <>Select the region with the wooden axe, or set the corners with <code>{"//pos1"}</code> and <code>{"//pos2"}</code>.</>,
                <>Run <code>{"//copy"}</code> while standing where you want the schematic origin.</>,
                <>Run <code>{"//schem save "}{farm.dn}</code>. Find the resulting <code>.schem</code> file in the WorldEdit schematics folder.</>,
              ]} />

              <GuideSection icon={<MousePointer2 className="size-4" />} title="Structure block (.nbt)" description="Vanilla Minecraft can save smaller structures without installing a mod. Use a world where you have permission to use commands." steps={[
                <>Get a structure block with <code>/give @s structure_block</code> and place it beside the build.</>,
                <>Set the block to <strong>Save</strong>, enter a name, then adjust the relative position and size to include the build.</>,
                <>Press <strong>Save</strong>. The structure file is stored under <code>saves/&lt;world&gt;/generated/minecraft/structures</code>.</>,
              ]} />

              <GuideSection icon={<FileCode className="size-4" />} title="Schematica (.schematic)" description="This legacy format is mainly for Minecraft 1.12 and older. It remains supported for compatibility; use Litematica for current versions." steps={[]} />

              <div className="border-t border-white/10 pt-5 text-[#9d9d9d]">
                <h4 className="font-semibold text-white">Load this build</h4>
                <p className="mt-2">Download <code>{farmFormats[selectedFormat]}</code>, place it in your schematic folder, then load it from your mod’s schematic menu. In Litematica, use the layer render controls to inspect the build one Y level at a time.</p>
                {farm.schematicUrl && <a href={farm.schematicUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#181818] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:bg-[#222]"><ArrowDownToLine className="size-4" /> Download {farmFormats[selectedFormat]}</a>}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className={`flex items-center justify-between gap-3 border-t border-white/10 bg-[#111216] px-4 py-2 sm:px-6 ${activeTab === "viewer" ? "min-h-11" : "flex-col sm:flex-row"}`}>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <span className="text-white/35">Selected:</span>
            <span className="truncate font-bold text-emerald-400">{farmFormats[selectedFormat]}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2 w-auto">
            <button
              onClick={onClose}
              className="border border-[var(--rule)] px-3 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              Close
            </button>
            {farm.schematicUrl && (
              <a
                href={farm.schematicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[var(--portal)] bg-[rgba(153,225,217,.12)] px-3 py-2 text-xs font-bold text-[var(--portal)] transition-colors hover:bg-[rgba(153,225,217,.2)]"
              >
                <Download className="w-4 h-4" /> Download {farmFormats[selectedFormat]}
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function GuideSection({ icon, title, description, steps }: { icon: React.ReactNode; title: string; description: React.ReactNode; steps: React.ReactNode[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-[32px_1fr] sm:gap-4">
      <span className="grid size-8 place-items-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">{icon}</span>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-1 text-[#9d9d9d]">{description}</p>
        {steps.length > 0 && <ol className="mt-3 space-y-2.5 text-[#c3c7cf]">{steps.map((step, index) => <li key={index} className="flex gap-3"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#181818] font-mono text-[10px] text-emerald-400">{index + 1}</span><span>{step}</span></li>)}</ol>}
      </div>
    </section>
  );
}

