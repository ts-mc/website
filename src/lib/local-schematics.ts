import fs from "node:fs";
import path from "node:path";
import type { FarmWithMetadata } from "@/types/farm";

const schematicDirectory = path.join(process.cwd(), "src", "data", "schematics");
const worldDirectory = path.join(process.cwd(), "src", "data", "worlds");

function safeDn(value: string) {
  return /^[a-z0-9][a-z0-9_-]{0,39}$/i.test(value) ? value : null;
}

export function getLocalSchematic(dn: string): { filename: string; url: string } | null {
  const key = safeDn(dn);
  if (!key || !fs.existsSync(schematicDirectory)) return null;
  const filename = fs.readdirSync(schematicDirectory).find((file) => {
    const stem = path.parse(file).name;
    return stem.toLowerCase() === key.toLowerCase() && /\.(litematic|schematic|schem|nbt)$/i.test(file);
  });
  return filename ? { filename, url: `/api/local-schematic/${encodeURIComponent(filename)}` } : null;
}

export function getLocalWorld(dn: string): { directory: string; hasLevelData: boolean } | null {
  const key = safeDn(dn);
  if (!key || !fs.existsSync(worldDirectory)) return null;
  const directory = fs.readdirSync(worldDirectory).find((name) => name.toLowerCase() === key.toLowerCase());
  if (!directory) return null;
  const resolved = path.join(worldDirectory, directory);
  if (!fs.statSync(resolved).isDirectory()) return null;
  return { directory, hasLevelData: fs.existsSync(path.join(resolved, "level.dat")) };
}

export function localSchematicFarm(dn: string, filename: string): FarmWithMetadata {
  return {
    id: dn,
    dn,
    normalizedDn: dn.replace(/-dn$/i, "").replace(/^b/i, ""),
    category: "java",
    title: `TheySix Farm ${dn}`,
    farmType: "Other",
    description: "Local TheySix schematic preview.",
    worldDownloadUrl: "link",
    schematicUrl: `/api/local-schematic/${encodeURIComponent(filename)}`,
    youtubeUrl: "",
    version: "1.21+",
    gameMode: undefined,
    worldVersion: undefined,
    seed: undefined,
    dimension: "Overworld / not recorded",
    author: "TheySix",
    date: "2026-10-31",
    views: 3,
    viewsDisplay: "3",
    resolvedThumbnail: "/images/og-image.png",
    hasSchematic: true,
    hasWorldDownload: Boolean(getLocalWorld(dn)),
    hasYoutube: false,
    hasMaterials: false,
    schematicFiles: { litematic: filename, schematic: filename, schem: filename, nbt: filename },
    materials: [],
    supportsBothPlatforms: false,
  };
}

export function localWorldFarm(dn: string, fileUrl: string): FarmWithMetadata {
  const schematic = getLocalSchematic(dn);
  const farm = localSchematicFarm(dn, schematic?.filename ?? `${dn}.litematic`);
  return {
    ...farm,
    schematicUrl: schematic?.url ?? fileUrl,
    hasSchematic: Boolean(schematic),
    hasWorldDownload: true,
  };
}
