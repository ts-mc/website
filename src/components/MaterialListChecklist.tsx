"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckSquare,
  Square,
  Check,
  Search,
  RotateCcw,
  ClipboardList,
  Sparkles,
  Layers,
  Boxes,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
  Youtube
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
  const handleCopyAll = () => {
    const text = materials
      .map((m) => `${m.name}: ${m.count} (${m.stacks || `${m.count} items`})`)
      .join("\n");
    navigator.clipboard.writeText(`=== Material List: ${farmTitle} (#${farmId}) ===\n` + text);
    setCopiedNotification("All materials copied!");
    setTimeout(() => setCopiedNotification(null), 2500);
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
    navigator.clipboard.writeText(`=== Remaining Needed: ${farmTitle} (#${farmId}) ===\n` + text);
    setCopiedNotification("Remaining items copied!");
    setTimeout(() => setCopiedNotification(null), 2500);
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
    <div className="space-y-4 select-none">
      {/* Progress & Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0E14]/80 border border-hairline space-y-3 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FBBF24] flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-[#FBBF24]" /> In-Game Resource Tracker
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-bg-elev text-[#9FEBF6] border border-hairline">
              {collectedCount}/{totalItems} items ({progressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={handleCheckAll}
              className="px-2.5 py-1 rounded-lg bg-bg-elev hover:bg-bg-elev text-ink hover:text-ink border border-hairline text-[11px] font-medium transition-colors"
            >
              Check All
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg bg-bg-elev hover:bg-bg-elev text-ink-muted hover:text-[#FB7185] border border-hairline text-[11px] font-medium transition-colors flex items-center gap-1"
              title="Reset all checkboxes"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-bg-elev rounded-full h-2 overflow-hidden border border-hairline">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isAllDone
                ? "bg-gradient-to-r from-[#4CAF50] to-[#2DD4BF] shadow-md shadow-[#4CAF50]/30"
                : "bg-gradient-to-r from-[#FBBF24] to-[#4CADD0]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* All items done message */}
        {isAllDone && (
          <div className="flex items-center gap-2 text-xs text-[#4CAF50] font-semibold pt-0.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
            <span>All materials gathered! You have everything ready in your inventory to build this farm.</span>
          </div>
        )}
      </div>

      {/* Toolbar: Search & Copy Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-ink-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items (e.g. Hopper, Piston, Glass)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0E14]/90 border border-hairline rounded-xl pl-8 pr-3 py-1.5 text-xs text-ink placeholder-ink-dim focus:outline-none focus:border-[#4CADD0]/60"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleCopyRemaining}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-elev hover:bg-bg-elev text-[#FBBF24] hover:text-[#FBBF24] text-xs font-semibold border border-hairline transition-colors"
            title="Copy only uncollected items"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Copy Needed</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-elev hover:bg-bg-elev text-ink hover:text-ink text-xs font-semibold border border-hairline transition-colors"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Copy All</span>
          </button>
        </div>
      </div>

      {/* Copied notification toast */}
      {copiedNotification && (
        <div className="p-2 rounded-xl bg-[#0E3A47]/90 border border-[#155E75] text-[#9FEBF6] text-xs font-mono text-center animate-in fade-in">
          {copiedNotification}
        </div>
      )}

      {/* Interactive Item Checkbox Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
        {filtered.map((mat) => {
          const isChecked = isLoaded && Boolean(checkedMap[mat.name]);
          return (
            <div
              key={mat.name}
              onClick={() => toggleItem(mat.name)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                isChecked
                  ? "bg-[#4CAF50]/10 border-[#4CAF50]/60 text-ink-muted opacity-75"
                  : "bg-[#070A12]/70 border-[#1E293B] text-ink hover:border-hairline hover:bg-[#111726]/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Checkbox Icon */}
                <div className={`p-1 rounded-lg border transition-colors shrink-0 ${
                  isChecked
                    ? "bg-[#4CAF50] border-[#4CAF50] text-slate-950"
                    : "bg-bg-elev border-hairline text-transparent"
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                {/* Name & Stacks */}
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isChecked ? "line-through text-ink-muted" : "text-ink"}`}>
                    {mat.name}
                  </div>
                  <div className="text-[11px] text-ink-muted font-mono">
                    {mat.stacks || `${mat.count} items`}
                  </div>
                </div>
              </div>

              {/* Total Count Badge */}
              <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border shrink-0 ${
                isChecked
                  ? "bg-[#4CAF50]/15 text-[#4CAF50] border-[#4CAF50]/80"
                  : "bg-bg-elev text-[#9FEBF6] border-hairline"
              }`}>
                x{mat.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
