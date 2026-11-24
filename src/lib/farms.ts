import fs from "fs";
import path from "path";
import youtubeMetadata from "@/data/youtube-metadata.json";
import youtubeChannelIndex from "@/data/youtube-channel-index.json";
import type { FarmData, FarmWithMetadata, FarmMaterialItem } from "@/types/farm";
import type { YoutubeChannelVideoSnapshot, YoutubeMetadataSnapshot } from "@/types/youtube";

const youtubeSnapshots = youtubeMetadata as Record<string, YoutubeMetadataSnapshot>;
const youtubeChannelSnapshots = youtubeChannelIndex as Record<string, YoutubeChannelVideoSnapshot>;

function getCachedMaterials(dn: string): FarmMaterialItem[] {
  const filePath = path.join(process.cwd(), "src", "data", "materials", `${dn.toLowerCase()}.json`);
  if (!fs.existsSync(filePath)) return [];

  try {
    const materials = JSON.parse(fs.readFileSync(filePath, "utf-8")) as unknown;
    return Array.isArray(materials) ? materials as FarmMaterialItem[] : [];
  } catch {
    return [];
  }
}

function applyMaterialCache(farms: FarmWithMetadata[]): FarmWithMetadata[] {
  return farms.map((farm) => {
    if (farm.materials.length > 0) return farm;
    const materials = getCachedMaterials(farm.dn);
    return materials.length > 0 ? { ...farm, materials, hasMaterials: true } : farm;
  });
}

export function farmSupportsBothPlatforms(tags?: string[]): boolean {
  if (!tags?.length) return false;
  return tags.some((t) => /both platforms|both editions|java\s*&\s*bedrock|java and bedrock/i.test(t)) ||
    (tags.some((t) => /^java$/i.test(t)) && tags.some((t) => /^bedrock$/i.test(t)));
}

/**
 * Format a material item with calculated stacks and theme color
 */
export function formatMaterialItem(name: string, count: number, customColor?: string, customIcon?: string): FarmMaterialItem {
  const stacksCount = Math.floor(count / 64);
  const remainder = count % 64;
  let stacks = "";
  if (stacksCount > 0 && remainder > 0) {
    stacks = `${stacksCount} stack${stacksCount > 1 ? "s" : ""} + ${remainder}`;
  } else if (stacksCount > 0) {
    stacks = `${stacksCount} stack${stacksCount > 1 ? "s" : ""}`;
  } else {
    stacks = `${count} items`;
  }

  // Assign block color based on name
  let color = customColor || "#888888";
  const nl = name.toLowerCase();
  if (nl.includes("stone")) color = "#888888";
  else if (nl.includes("deepslate")) color = "#333538";
  else if (nl.includes("hopper")) color = "#3b3c40";
  else if (nl.includes("chest") || nl.includes("barrel")) color = "#9d6834";
  else if (nl.includes("observer")) color = "#42474d";
  else if (nl.includes("piston")) color = "#6c804f";
  else if (nl.includes("redstone")) color = "#e63946";
  else if (nl.includes("repeater") || nl.includes("comparator")) color = "#d90429";
  else if (nl.includes("glass")) color = "#2b3a4a";
  else if (nl.includes("trapdoor") || nl.includes("wood") || nl.includes("plank")) color = "#8b5a2b";
  else if (nl.includes("water") || nl.includes("ice")) color = "#1d6fa5";
  else if (nl.includes("lava") || nl.includes("magma") || nl.includes("campfire")) color = "#e85d04";
  else if (nl.includes("obsidian")) color = "#1e102d";
  else if (nl.includes("slime")) color = "#7bb85c";
  else if (nl.includes("honey")) color = "#ff9f1c";
  else if (nl.includes("gold") || nl.includes("iron")) color = "#d8d8d8";
  else if (nl.includes("quartz") || nl.includes("concrete")) color = "#eaeaea";
  else if (nl.includes("emerald")) color = "#10b981";

  return { name, count, stacks, color, icon: customIcon };
}

/**
 * Format a number to compact estimated format (e.g. 83233 -> '83k', 854784 -> '855k', 1200000 -> '1.2m')
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return (val >= 10 || val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)).replace(/\.0$/, "") + "m";
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return (val >= 10 || val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/**
 * Format rates string to replace large numbers with compact estimated values (e.g. "12,000+ Gunpowder/hr" -> "12k+ Gunpowder/hr")
 */
export function formatCompactRates(rates?: string): string {
  if (!rates) return "";
  return rates.replace(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d{4,}(?:\.\d+)?\b/g, (match) => {
    const num = parseFloat(match.replace(/,/g, ""));
    if (isNaN(num)) return match;
    return formatCompactNumber(num);
  });
}

/**
 * Extract YouTube ID from various YouTube URL formats
 */
export function extractYouTubeId(url?: string): string | undefined {
  if (!url) return undefined;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : undefined;
}

/**
 * Get YouTube high-res thumbnail URL or fallback
 */
export function getThumbnailUrl(youtubeUrl?: string, customThumbnail?: string): string {
  if (customThumbnail) return customThumbnail;
  const ytId = extractYouTubeId(youtubeUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "/logo.gif";
}

type FarmRecord = FarmData & Pick<FarmWithMetadata, "dn" | "category" | "materials" | "feedOrder" | "creatorName" | "latestVersion">;

export function getLegacyFarms(): FarmWithMetadata[] {
  const directory = path.join(process.cwd(), "public", "farms");
  const farms = fs.readdirSync(directory).filter(file => file.endsWith(".json")).map(file => {
    const record: FarmRecord = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
    const { dn, youtubeUrl, worldDownloadUrl, materials } = record;
    const schematicUrl = record.schematicUrls?.[0];
    const youtubeId = extractYouTubeId(youtubeUrl);
    const snapshot = youtubeId ? youtubeSnapshots[youtubeId] : undefined;
    const channel = youtubeId ? youtubeChannelSnapshots[youtubeId] : undefined;
    const youtubeViewCount = snapshot?.viewCount ?? channel?.viewCount;
    const views = Number(record.views) || 0;
    return {
      ...record, id: record.id || dn, views, viewsDisplay: formatCompactNumber(views),
      normalizedDn: dn.replace(/-dn$/i, ""), schematicUrl, youtubeId,
      resolvedThumbnail: getThumbnailUrl(youtubeUrl, record.thumbnailUrl),
      hasWorldDownload: Boolean(worldDownloadUrl), hasYoutube: Boolean(youtubeUrl),
      hasSchematic: Boolean(schematicUrl), hasMaterials: materials.length > 0,
      supportsBothPlatforms: record.category === "build" || farmSupportsBothPlatforms(record.tags),
      schematicFiles: { litematic: dn + ".litematic", schematic: dn + ".schematic", schem: dn + ".schem", nbt: dn + ".nbt" },
      youtubeViewCount, youtubeViewsDisplay: youtubeViewCount === undefined ? undefined : formatCompactNumber(youtubeViewCount),
    };
  });
  return farms.sort((a, b) => Date.parse(b.date || "1970-01-01") - Date.parse(a.date || "1970-01-01") ||
    b.dn.localeCompare(a.dn, undefined, { numeric: true, sensitivity: "base" }));
}

/**
 * Find a farm by category ("java" or "bedrock") and dn slug (e.g. "111-dn", "111", "b111-dn", "b111")
 */
export function getLegacyFarmByCategoryAndDn(
  category: string,
  dnParam: string
): FarmWithMetadata | undefined {
  const allFarms = getLegacyFarms();
  const normalizedCategory = category.toLowerCase().trim();
  const normalizedParam = dnParam.toLowerCase().trim();

  return allFarms.find((farm) => {
    // Check category match
    if (farm.category.toLowerCase() !== normalizedCategory) return false;

    // Check slug matches
    const farmDn = farm.dn.toLowerCase();
    const farmId = farm.id.toLowerCase();
    const farmNorm = farm.normalizedDn.toLowerCase();

    const paramWithoutDn = normalizedParam.replace(/-dn$/i, "");
    const paramWithoutB = paramWithoutDn.replace(/^b/i, "");

    return (
      farmDn === normalizedParam ||
      farmId === normalizedParam ||
      farmNorm === normalizedParam ||
      farmDn === `${normalizedParam}-dn` ||
      farmNorm === paramWithoutB ||
      farmDn === `b${normalizedParam}` ||
      farmDn === `b${normalizedParam}-dn`
    );
  });
}

export async function getAllFarms(): Promise<FarmWithMetadata[]> {
  return applyMaterialCache(getLegacyFarms());
}

export async function getFarmByCategoryAndDn(category: string, dnParam: string): Promise<FarmWithMetadata | undefined> {
  const allFarms = await getAllFarms();
  const normalizedCategory = category.toLowerCase().trim();
  const normalizedParam = dnParam.toLowerCase().trim();

  return allFarms.find((farm) => {
    if (farm.category.toLowerCase() !== normalizedCategory) return false;
    const farmDn = farm.dn.toLowerCase();
    const farmId = farm.id.toLowerCase();
    const farmNorm = farm.normalizedDn.toLowerCase();
    const paramWithoutDn = normalizedParam.replace(/-dn$/i, "");
    const paramWithoutB = paramWithoutDn.replace(/^b/i, "");
    return farmDn === normalizedParam || farmId === normalizedParam || farmNorm === normalizedParam || farmDn === `${normalizedParam}-dn` || farmNorm === paramWithoutB || farmDn === `b${normalizedParam}` || farmDn === `b${normalizedParam}-dn`;
  });
}
