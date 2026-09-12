export type SchematicBounds = {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
};

export type BlockCategory = "building" | "redstone" | "fluid" | "rail" | "utility" | "transparent";

export type SchematicBlock = {
  id: string;
  x: number;
  y: number;
  z: number;
  properties: Record<string, string>;
  category: BlockCategory;
  isWaterSource: boolean;
  isLavaSource: boolean;
};

const REDSTONE = /redstone|piston|observer|dispenser|dropper|repeater|comparator|lever|button|pressure_plate|target|note_block|tripwire|daylight_detector|sculk_sensor|trapdoor|door/;
const RAIL = /rail/;
const UTILITY = /chest|hopper|furnace|crafting_table|barrel|anvil|enchanting_table|brewing_stand|shulker_box|beacon|lectern|smoker|blast_furnace/;
const TRANSPARENT = /glass|leaves|ice|slime|honey|lantern|torch|ladder|scaffolding|vine|cobweb/;

function valueFromPalette(entry: any, key: string): any {
  if (entry && typeof entry[key] === "function") return entry[key]();
  return entry?.[key];
}

export function blockName(entry: any): string {
  const name = typeof entry === "string" ? entry : valueFromPalette(entry, "name") ?? entry?.Name ?? entry?.block_name;
  return String(name || "minecraft:air").toLowerCase().replace(/^minecraft:/, "");
}

export function blockProperties(entry: any): Record<string, string> {
  const properties = valueFromPalette(entry, "properties");
  if (!properties || typeof properties !== "object") return {};
  return Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, String(value)]));
}

export function classifyBlock(id: string): BlockCategory {
  if (id === "water" || id === "lava") return "fluid";
  if (RAIL.test(id)) return "rail";
  if (REDSTONE.test(id)) return "redstone";
  if (UTILITY.test(id)) return "utility";
  if (TRANSPARENT.test(id)) return "transparent";
  return "building";
}

export function normalizeSchematic(schematic: any): { blocks: SchematicBlock[]; bounds: SchematicBounds | null } {
  const rawBlocks = schematic?.blocks_indices?.() as Array<[number, number, number, number]> | undefined;
  const palettes = schematic?.get_all_palettes?.();
  const palette = palettes?.default || palettes;
  if (!Array.isArray(rawBlocks) || !Array.isArray(palette)) return { blocks: [], bounds: null };

  const blocks = rawBlocks.flatMap(([x, y, z, paletteIndex]) => {
    const entry = palette[paletteIndex];
    const id = blockName(entry);
    if (id.endsWith(":air") || id === "air" || id === "cave_air" || id === "void_air") return [];
    const properties = blockProperties(entry);
    return [{
      id, x, y, z, properties, category: classifyBlock(id),
      isWaterSource: id === "water" && properties.level === "0",
      isLavaSource: id === "lava" && properties.level === "0",
    }];
  });

  const tightMin = schematic.get_tight_bounds_min?.();
  const tightMax = schematic.get_tight_bounds_max?.();
  if (!tightMin || !tightMax) return { blocks, bounds: null };
  return {
    blocks,
    bounds: {
      minX: Number(tightMin[0]), minY: Number(tightMin[1]), minZ: Number(tightMin[2]),
      maxX: Number(tightMax[0]), maxY: Number(tightMax[1]), maxZ: Number(tightMax[2]),
    },
  };
}

export function topCornerCamera(bounds: SchematicBounds) {
  const center = [
    (bounds.minX + bounds.maxX) / 2,
    (bounds.minY + bounds.maxY) / 2,
    (bounds.minZ + bounds.maxZ) / 2,
  ] as [number, number, number];
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ, 1);
  const offset = Math.max(3, span * 0.7);
  return {
    position: [bounds.maxX + offset, bounds.maxY + offset * 1.15, bounds.maxZ + offset] as [number, number, number],
    target: center,
  };
}

export function blockLabel(id: string): string {
  return id.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}