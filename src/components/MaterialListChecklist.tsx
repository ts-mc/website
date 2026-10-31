"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Check,
  Search,
  RotateCcw,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
  Youtube,
  Pin,
  Box,
} from "lucide-react";
import type { FarmMaterialItem } from "@/types/farm";

interface MaterialListChecklistProps {
  materials: FarmMaterialItem[];
  farmId: string;
  farmTitle?: string;
  youtubeUrl?: string;
  compact?: boolean;
}

export function MaterialListChecklist({
  materials,
  farmId,
  farmTitle = "Farm Blueprint",
  youtubeUrl,
  compact = false
}: MaterialListChecklistProps) {
  const storageKey = `theysix_materials_${farmId}`;

  // Checked state keyed by material name
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Load saved checked items from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      }
    } catch {
      // ignore localStorage errors
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save changes to localStorage
  const toggleItem = (name: string) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleReset = () => {
    setCheckedMap({});
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    materials.forEach((m) => {
      allChecked[m.name] = true;
    });
    setCheckedMap(allChecked);
    try {
      localStorage.setItem(storageKey, JSON.stringify(allChecked));
    } catch {
      // ignore
    }
  };

  // Filtered materials
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return materials;
    return materials.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [materials, searchQuery]);

  // Progress metrics
  const totalItems = materials.length;
  const collectedCount = materials.filter((m) => checkedMap[m.name]).length;
  const progressPercent = totalItems > 0 ? Math.round((collectedCount / totalItems) * 100) : 0;
  const isAllDone = totalItems > 0 && collectedCount === totalItems;

  // Copy helpers
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotification("Material list copied to clipboard.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      setCopiedNotification(copied ? "Material list copied to clipboard." : "Could not copy the material list.");
    }
    window.setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleCopyAll = () => {
    const text = materials
      .map((m) => `${m.name}: ${m.count} (${m.stacks || `${m.count} items`})`)
      .join("\n");
    void copyText(`=== Material List: ${farmTitle} (#${farmId}) ===\n` + text);
  };

  const handleCopyRemaining = () => {
    const remaining = materials.filter((m) => !checkedMap[m.name]);
    if (remaining.length === 0) {
      setCopiedNotification("All items already gathered!");
      setTimeout(() => setCopiedNotification(null), 2500);
      return;
    }
    const text = remaining
      .map((m) => `${m.name}: ${m.count} (${m.stacks || `${m.count} items`})`)
      .join("\n");
    void copyText(`=== Remaining Needed: ${farmTitle} (#${farmId}) ===\n` + text);
  };
  if (!materials || materials.length === 0) {
    return (
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-ink space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#FBBF24]">
              No Material List Available
            </h4>
            <p className="text-xs text-ink leading-relaxed">
              This farm doesn&apos;t have a material list provided yet. Create a ticket in Discord to request it, or watch the video tutorial for required items and building steps.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href="https://discord.gg/theysix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-ink text-xs font-bold transition-all shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Open Discord Ticket</span>
          </a>
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF3B3B]/20 hover:bg-[#FF3B3B]/30 text-[#FF3B3B] border border-[#FF3B3B]/30 text-xs font-bold transition-all"
            >
              <Youtube className="w-4 h-4 text-[#FB7185]" />
              <span>Watch Video Tutorial</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="select-none space-y-4 text-[#e6e8ec]">
      <div className="border-b border-[#1f232c] pb-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Material Checklist</h3>
          <span className="text-xs text-[#9d9d9d]">Materials checked: {collectedCount}/{totalItems}</span>
        </div>
        <p className="mt-1 text-xs text-[#9d9d9d]">Review the materials used in this build, including quantities and details.</p>
        {isAllDone && <p className="mt-2 flex items-center gap-1.5 text-xs text-[#039437]"><CheckCircle2 className="size-4" /> All materials gathered.</p>}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#181818]"><div className="h-full bg-[#039437] transition-all" style={{ width: `${progressPercent}%` }} /></div>
      </div>

      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7b8393]" />
          <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-11 w-full rounded-xl border border-[#1f232c] bg-[#0b0e14] pl-10 pr-3 text-xs text-[#e6e8ec] placeholder:text-[#7b8393] focus:border-[#039437] focus:outline-none" />
        </label>
        <button onClick={handleReset} title="Reset checklist" className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#1f232c] bg-[#0b0e14] text-[#9d9d9d] hover:text-white"><RotateCcw className="size-4" /></button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium">Materials List</h4>
          <div className="flex items-center gap-3">
            <button onClick={handleCheckAll} className="text-[11px] text-[#039437] hover:text-[#1ca848]">Mark all collected</button>
            <button onClick={handleCopyAll} className="inline-flex items-center gap-1.5 rounded-full bg-[#181818] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#e6e8ec] transition hover:bg-[#222] hover:text-white"><ClipboardList className="size-3.5" /> Copy list</button>
          </div>
        </div>
        <div className="max-h-[min(58vh,620px)] space-y-2 overflow-y-auto pr-0.5">
          {filtered.map((mat) => {
            const isChecked = isLoaded && Boolean(checkedMap[mat.name]);
            return (
              <div key={mat.name} role="checkbox" aria-checked={isChecked} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleItem(mat.name); } }} onClick={() => toggleItem(mat.name)} className={`group flex min-h-[74px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${isChecked ? "border-[#039437]/40 bg-[#0e2418]" : "border-[#17243b] bg-[#0b1020] hover:border-[#2c3b56]"}`}>
                <span className={`grid size-4 shrink-0 place-items-center rounded-full border ${isChecked ? "border-[#039437] bg-[#039437] text-[#061812]" : "border-[#4c9aff] bg-transparent text-transparent"}`}><Check className="size-3 stroke-[3]" /></span>
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/5 bg-white/[.025] text-[#7b8393]"><Box className="size-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-xs font-semibold ${isChecked ? "text-[#9d9d9d] line-through" : "text-[#e6e8ec]"}`}>{mat.name}</span>
                  <span className="mt-1 block truncate text-xs text-[#9d9d9d]">{mat.stacks || `${mat.count} items`}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-[#9d9d9d]">
                  <button type="button" title={`Copy ${mat.name}`} onClick={(event) => { event.stopPropagation(); navigator.clipboard.writeText(`${mat.name}: ${mat.count} (${mat.stacks || `${mat.count} items`})`); setCopiedNotification(`${mat.name} copied`); window.setTimeout(() => setCopiedNotification(null), 1600); }} className="hidden rounded p-1 hover:bg-white/5 hover:text-white sm:inline-flex"><ClipboardList className="size-4" /></button>
                  <button type="button" title={`Pin ${mat.name}`} onClick={(event) => { event.stopPropagation(); toggleItem(mat.name); }} className="rounded p-1 hover:bg-white/5 hover:text-white"><Pin className={`size-4 ${isChecked ? "text-[#039437]" : ""}`} /></button>
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="rounded-xl border border-[#1f232c] p-5 text-center text-xs text-[#9d9d9d]">No materials match “{searchQuery}”.</p>}
        </div>
      </div>
      {copiedNotification && <p role="status" className="text-center text-xs text-[#039437]">{copiedNotification}</p>}
      <div className="flex gap-2 border-t border-[#1f232c] pt-3">
        <button onClick={handleCopyRemaining} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#181818] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#e6e8ec] hover:bg-[#222]"><ClipboardList className="size-3.5" /> Copy needed</button>
        <button onClick={handleCopyAll} className="flex items-center justify-center gap-2 rounded-full px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#9d9d9d] hover:text-white">Copy all</button>
      </div>
    </div>
  );
}
