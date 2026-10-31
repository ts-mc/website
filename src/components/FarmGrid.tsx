"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { FarmCard } from "@/components/FarmCard";
import type { FarmWithMetadata } from "@/types/farm";
import { FARM_TYPES } from "@/types/farm";

interface FarmGridProps {
  initialFarms: FarmWithMetadata[];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="min-w-0"><legend className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#969e7d]">{title}</legend><div className="flex flex-wrap gap-1.5">{children}</div></fieldset>;
}

function FilterChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-medium transition-colors ${checked ? "border-[#99e1d9]/50 bg-[#99e1d9]/10 text-[#fbffee]" : "border-[#23251e] bg-transparent text-[#fbffee] hover:border-[#6e735b]"}`}>
    <input type="checkbox" checked={checked} onChange={onChange} className="size-3.5 accent-[#99e1d9]" />
    <span>{label}</span>
  </label>;
}

export function FarmGrid({ initialFarms }: FarmGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const internalQueryUpdateRef = useRef<string | null>(null);

  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";
  const initialResources = searchParams.get("resources")?.split(",").filter(Boolean) || [];
  const initialVersions = searchParams.get("versions")?.split(",").filter(Boolean) || [];
  const initialDifficulties = searchParams.get("difficulties")?.split(",").filter(Boolean) || [];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [draftEditions, setDraftEditions] = useState<string[]>(initialCategory === "all" ? [] : initialCategory.split(","));
  const [activeEditions, setActiveEditions] = useState<string[]>(initialCategory === "all" ? [] : initialCategory.split(","));
  const [draftTypes, setDraftTypes] = useState<string[]>(initialType === "all" ? [] : initialType.split(","));
  const [activeTypes, setActiveTypes] = useState<string[]>(initialType === "all" ? [] : initialType.split(","));
  const [draftResources, setDraftResources] = useState<string[]>(initialResources);
  const [activeResources, setActiveResources] = useState<string[]>(initialResources);
  const [draftVersions, setDraftVersions] = useState<string[]>(initialVersions);
  const [activeVersions, setActiveVersions] = useState<string[]>(initialVersions);
  const [draftDifficulties, setDraftDifficulties] = useState<string[]>(initialDifficulties);
  const [activeDifficulties, setActiveDifficulties] = useState<string[]>(initialDifficulties);
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sync category state when URL changes (e.g. clicked navbar link)
  useEffect(() => {
    const queryString = searchParams.toString();
    if (internalQueryUpdateRef.current === queryString) {
      internalQueryUpdateRef.current = null;
      return;
    }
    const cat = searchParams.get("category");
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    const resources = searchParams.get("resources")?.split(",").filter(Boolean) || [];
    const versions = searchParams.get("versions")?.split(",").filter(Boolean) || [];
    const difficultyFilters = searchParams.get("difficulties")?.split(",").filter(Boolean) || [];
    const editions = cat && cat !== "all" ? cat.split(",") : [];
    const types = type && type !== "all" ? type.split(",") : [];
    setDraftEditions(editions);
    setActiveEditions(editions);
    setSearchQuery(query);
    setDraftTypes(types);
    setActiveTypes(types);
    setDraftResources(resources);
    setActiveResources(resources);
    setDraftVersions(versions);
    setActiveVersions(versions);
    setDraftDifficulties(difficultyFilters);
    setActiveDifficulties(difficultyFilters);
    setCurrentPage(1);
  }, [searchParams]);

  // Extract unique farm types combining standard list and any custom types
  const farmTypes = useMemo(() => {
    const types = new Set<string>(FARM_TYPES);
    initialFarms.forEach((farm) => {
      if (farm.farmType) types.add(farm.farmType);
    });
    return Array.from(types);
  }, [initialFarms]);

  const farmVersions = useMemo(() => Array.from(new Set(initialFarms.map((farm) => farm.version).filter((version): version is string => Boolean(version)))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [initialFarms]);
  const difficulties = useMemo(() => Array.from(new Set(initialFarms.map((farm) => farm.difficulty).filter((difficulty): difficulty is NonNullable<typeof difficulty> => Boolean(difficulty)))).sort(), [initialFarms]);

  // Filter and sort farms
  const filteredFarms = useMemo(() => {
    let result = [...initialFarms];

    // Edition values are ORed; resources, type, version, and difficulty refine that set.
    if (activeEditions.length) result = result.filter((farm) => activeEditions.some((edition) => {
      if (edition === "both") return farm.supportsBothPlatforms;
      if (edition === "build") return farm.category === "build";
      if (edition === "java") return farm.category === "java" || farm.supportsBothPlatforms;
      if (edition === "bedrock") return farm.category === "bedrock" || farm.supportsBothPlatforms;
      return false;
    }));
    if (activeTypes.length) result = result.filter((farm) => activeTypes.includes(farm.farmType));
    if (activeResources.length) result = result.filter((farm) => activeResources.every((resource) => resource === "world" ? farm.hasWorldDownload : resource === "schematic" ? farm.hasSchematic : farm.hasYoutube));
    if (activeVersions.length) result = result.filter((farm) => activeVersions.includes(farm.version || ""));
    if (activeDifficulties.length) result = result.filter((farm) => activeDifficulties.includes(farm.difficulty || ""));

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((farm) => {
        const titleMatch = farm.title.toLowerCase().includes(q);
        const descMatch = farm.description.toLowerCase().includes(q);
        const typeMatch = farm.farmType.toLowerCase().includes(q);
        const dnMatch = farm.dn.toLowerCase().includes(q) || farm.id.toLowerCase().includes(q);
        const tagMatch = farm.tags?.some((t) => t.toLowerCase().includes(q));
        const verMatch = farm.version?.toLowerCase().includes(q);
        return titleMatch || descMatch || typeMatch || dnMatch || tagMatch || verMatch;
      });
    }

    // Sorting
    if (sortBy === "date_desc") {
      result.sort((a, b) => {
        if (a.feedOrder !== undefined && b.feedOrder !== undefined) return a.feedOrder - b.feedOrder;
        if (a.feedOrder !== undefined) return -1;
        if (b.feedOrder !== undefined) return 1;
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return b.dn.localeCompare(a.dn, undefined, { numeric: true });
      });
    } else if (sortBy === "date_asc") {
      result.sort((a, b) => {
        if (a.feedOrder !== undefined && b.feedOrder !== undefined) return b.feedOrder - a.feedOrder;
        if (a.feedOrder !== undefined) return 1;
        if (b.feedOrder !== undefined) return -1;
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;
        return a.dn.localeCompare(b.dn, undefined, { numeric: true });
      });
    } else if (sortBy === "dn_asc") {
      result.sort((a, b) => a.dn.localeCompare(b.dn, undefined, { numeric: true }));
    } else if (sortBy === "dn_desc") {
      result.sort((a, b) => b.dn.localeCompare(a.dn, undefined, { numeric: true }));
    } else if (sortBy === "featured") {
      // featured
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.feedOrder !== undefined && b.feedOrder !== undefined) return a.feedOrder - b.feedOrder;
        if (a.feedOrder !== undefined) return -1;
        if (b.feedOrder !== undefined) return 1;
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return b.dn.localeCompare(a.dn, undefined, { numeric: true });
      });
    }

    return result;
  }, [initialFarms, activeEditions, activeTypes, activeResources, activeVersions, activeDifficulties, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage) || 1;
  const paginatedFarms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFarms.slice(start, start + itemsPerPage);
  }, [filteredFarms, currentPage, itemsPerPage]);

  // Truncated pagination calculation: e.g. < 1 .. (current.page) .. 15 >
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const siblings = 1;
    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = [1, 2, 3, 4];
      return [...leftRange, "..", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      return [1, "..", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = [currentPage - 1, currentPage, currentPage + 1];
      return [1, "..", ...middleRange, "..", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages, currentPage]);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    const gridSection = document.getElementById("farms-grid-section");
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleDraft = (values: string[], setValues: (next: string[]) => void, value: string) => setValues(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    params.delete("page");
    internalQueryUpdateRef.current = params.toString() === searchParams.toString() ? null : params.toString();
    router.replace(`/?${params.toString()}#farms`, { scroll: false });
  };

  const handleApplyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveEditions(draftEditions);
    setActiveTypes(draftTypes);
    setActiveResources(draftResources);
    setActiveVersions(draftVersions);
    setActiveDifficulties(draftDifficulties);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (draftEditions.length) params.set("category", draftEditions.join(","));
    else params.delete("category");
    if (draftTypes.length) params.set("type", draftTypes.join(","));
    else params.delete("type");
    if (draftResources.length) params.set("resources", draftResources.join(","));
    else params.delete("resources");
    if (draftVersions.length) params.set("versions", draftVersions.join(","));
    else params.delete("versions");
    if (draftDifficulties.length) params.set("difficulties", draftDifficulties.join(","));
    else params.delete("difficulties");
    internalQueryUpdateRef.current = params.toString() === searchParams.toString() ? null : params.toString();
    router.replace(`/?${params.toString()}#farms`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDraftEditions([]);
    setActiveEditions([]);
    setDraftTypes([]);
    setActiveTypes([]);
    setDraftResources([]);
    setActiveResources([]);
    setDraftVersions([]);
    setActiveVersions([]);
    setDraftDifficulties([]);
    setActiveDifficulties([]);
    setSortBy("featured");
    setCurrentPage(1);
    internalQueryUpdateRef.current = searchParams.toString() ? "" : null;
    router.replace("/", { scroll: false });
  };

  return (
    <div id="farms-grid-section" className="space-y-8 scroll-mt-6 pb-28 sm:pb-12">
      <form onSubmit={handleApplyFilters} className="mx-auto max-w-[68rem] rounded-[5px] border border-[#23251e] bg-[#1d1d1d] p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] shadow-[0_24px_60px_-42px_rgba(0,0,0,.9)] sm:p-5">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_224px]">
          <label className="block min-w-0">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#969e7d]">Search</span>
            <span className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#969e7d]" />
              <input type="search" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Title, tag, type, or DN number" className="h-11 w-full rounded-[4px] border border-[#6e735b] bg-[#020202] pl-10 pr-3 text-sm text-[#f1fec8] placeholder:text-[#969e7d] focus:border-[#99e1d9] focus:outline-none" />
            </span>
          </label>
          <label className="block min-w-0">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#969e7d]">Sort</span>
            <span className="relative block"><SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#969e7d]" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-11 w-full appearance-none rounded-[4px] border border-[#6e735b] bg-[#020202] px-3 pr-9 text-sm text-[#f1fec8] focus:border-[#99e1d9] focus:outline-none">
                <option value="featured">Featured first</option><option value="date_desc">Newest uploaded</option><option value="date_asc">Oldest uploaded</option><option value="dn_asc">DN number (low to high)</option><option value="dn_desc">DN number (high to low)</option>
              </select>
            </span>
          </label>
        </div>

        <div className="mt-5 grid gap-x-8 gap-y-5 border-b border-[#23251e] pb-5 md:grid-cols-2">
          <FilterGroup title="Edition">
            {([ ["java", "Java"], ["bedrock", "Bedrock"], ["both", "Java + Bedrock"], ["build", "Build"] ] as const).map(([edition, label]) => <FilterChip key={edition} label={label} checked={draftEditions.includes(edition)} onChange={() => toggleDraft(draftEditions, setDraftEditions, edition)} />)}
          </FilterGroup>
          <FilterGroup title="Resources included">
            {[{ id: "world", label: "World save" }, { id: "schematic", label: "Schematic" }, { id: "tutorial", label: "Tutorial" }].map((resource) => <FilterChip key={resource.id} label={resource.label} checked={draftResources.includes(resource.id)} onChange={() => toggleDraft(draftResources, setDraftResources, resource.id)} />)}
          </FilterGroup>
          <FilterGroup title="Minecraft version">
            {farmVersions.map((version) => <FilterChip key={version} label={version} checked={draftVersions.includes(version)} onChange={() => toggleDraft(draftVersions, setDraftVersions, version)} />)}
            {!farmVersions.length && <span className="text-xs text-[#969e7d]">No version details available</span>}
          </FilterGroup>
          <label className="block min-w-0">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#969e7d]">Farm type</span>
            <span className="relative block">
              <select
                value={draftTypes[0] || ""}
                onChange={(event) => setDraftTypes(event.target.value ? [event.target.value] : [])}
                className="h-11 w-full appearance-none rounded-[4px] border border-[#6e735b] bg-[#020202] px-3 pr-9 text-sm text-[#f1fec8] focus:border-[#99e1d9] focus:outline-none"
              >
                <option value="">All farm types</option>
                {farmTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#969e7d]" />
            </span>
          </label>
          {difficulties.length > 0 && <FilterGroup title="Build difficulty">
            {difficulties.map((difficulty) => <FilterChip key={difficulty} label={difficulty} checked={draftDifficulties.includes(difficulty)} onChange={() => toggleDraft(draftDifficulties, setDraftDifficulties, difficulty)} />)}
          </FilterGroup>}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button type="submit" className="min-h-11 rounded-[4px] bg-[#99e1d9] px-5 text-xs font-bold text-[#020202] transition hover:bg-[#7fd3c9]">Apply filters</button>
          <button type="button" onClick={handleResetFilters} className="min-h-11 inline-flex items-center gap-2 rounded-[4px] border border-[#6e735b] px-4 text-xs font-semibold text-[#f1fec8] transition hover:border-[#99e1d9]"><RotateCcw className="size-3.5" /> Clear all</button>
          <p className="ml-auto w-full text-xs text-[#969e7d] sm:w-auto">{filteredFarms.length} {filteredFarms.length === 1 ? "entry" : "entries"}</p>
        </div>
      </form>

      {/* Farm Cards Grid */}
      {paginatedFarms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFarms.map((farm) => (
            <FarmCard key={`${farm.category}-${farm.dn}`} farm={farm} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel text-center py-16 px-6 rounded-panel space-y-4">
          <div className="w-16 h-16 rounded-card bg-bg-elev border border-hairline flex items-center justify-center mx-auto text-ink-dim">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink">No farms found</h3>
          <p className="text-sm text-ink-muted max-w-md mx-auto">
            We couldn&apos;t find any farms matching your search filters. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-control bg-brand hover:bg-[#4CADD0]/80 text-slate-950 text-sm font-semibold transition-all shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-control bg-bg-elev border border-hairline text-ink-muted hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-sm">
            {paginationItems.map((item, idx) => {
              if (item === "..") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-7 sm:w-8 h-9 flex items-center justify-center text-ink-dim font-bold select-none tracking-widest text-xs sm:text-sm"
                  >
                    ..
                  </span>
                );
              }

              const pageNum = Number(item);
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                    isActive
                      ? "bg-brand text-slate-950 shadow-md shadow-[#4CADD0]/30"
                      : "bg-bg-elev border border-hairline text-ink-muted hover:text-ink hover:bg-surface-hover"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-control bg-bg-elev border border-hairline text-ink-muted hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

