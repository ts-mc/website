import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const root = path.join(process.cwd(), "src", "data", "worlds");
const allowed = /^(level\.dat|level\.dat_old|icon\.png)$/i;

export async function GET(_request: Request, { params }: { params: { world: string; file: string[] } }) {
  const world = params.world;
  const segments = params.file;
  if (!/^[a-z0-9 _-]{1,80}$/i.test(world) || !segments.length || segments.some((part) => part === "." || part === ".." || part.includes("\\"))) {
    return new NextResponse("Invalid world path", { status: 400 });
  }
  const relative = path.join(world, ...segments);
  const filename = path.basename(relative);
  if (!allowed.test(filename) && !/^(region|entities|poi)\/r\.-?\d+\.-?\d+\.mca$/i.test(segments.slice(-2).join("/"))) {
    return new NextResponse("World file unavailable", { status: 404 });
  }
  try {
    const rootReal = await realpath(root);
    const filePath = await realpath(path.join(root, relative));
    if (!filePath.startsWith(`${rootReal}${path.sep}`)) return new NextResponse("Invalid world path", { status: 400 });
    const data = await readFile(filePath);
    const contentType = filename.toLowerCase().endsWith(".png") ? "image/png" : "application/octet-stream";
    return new NextResponse(data, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" } });
  } catch {
    return new NextResponse("World file unavailable", { status: 404 });
  }
}
