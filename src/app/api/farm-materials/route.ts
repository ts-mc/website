import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { FarmMaterialItem } from "@/types/farm";

export const runtime = "nodejs";

const maxMaterials = 2000;

function isMaterial(value: unknown): value is FarmMaterialItem {
  if (!value || typeof value !== "object") return false;
  const material = value as Partial<FarmMaterialItem>;
  const count = material.count;
  return typeof material.name === "string"
    && material.name.length > 0
    && material.name.length <= 120
    && typeof count === "number"
    && Number.isSafeInteger(count)
    && count > 0
    && count <= Number.MAX_SAFE_INTEGER;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { dn?: unknown; materials?: unknown };
    const dn = typeof body.dn === "string" ? body.dn.trim() : "";
    const materials = Array.isArray(body.materials) ? body.materials : [];

    if (!/^\d+(?:-dn)?$/i.test(dn) || materials.length === 0 || materials.length > maxMaterials || !materials.every(isMaterial)) {
      return NextResponse.json({ error: "Invalid material list" }, { status: 400 });
    }

    const cacheDirectory = path.join(process.cwd(), "src", "data", "materials");
    const cachePath = path.join(cacheDirectory, `${dn.toLowerCase()}.json`);
    try {
      const cached = JSON.parse(await readFile(cachePath, "utf-8")) as unknown;
      if (Array.isArray(cached) && cached.length > 0) {
        return NextResponse.json({ saved: false, reason: "already_exists" });
      }
    } catch {
      // The cache file is created below on the first successful extraction.
    }

    await mkdir(cacheDirectory, { recursive: true });
    await writeFile(cachePath, `${JSON.stringify(materials, null, 2)}\n`, "utf-8");

    for (const farmCategory of ["java", "bedrock", "build"]) {
      revalidatePath(`/dn/\$dn`);
    }
    revalidatePath("/");
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Unable to save material list" }, { status: 503 });
  }
}