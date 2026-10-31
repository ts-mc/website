import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const directory = path.join(process.cwd(), "src", "data", "schematics");
const allowedExtension = /\.(litematic|schematic|schem|nbt)$/i;

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  if (path.basename(filename) !== filename || !allowedExtension.test(filename)) {
    return new NextResponse("Invalid schematic filename", { status: 400 });
  }
  try {
    if (!(await readdir(directory)).includes(filename)) return new NextResponse("Schematic not found", { status: 404 });
    const data = await readFile(path.join(directory, filename));
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  } catch {
    return new NextResponse("Schematic not found", { status: 404 });
  }
}
