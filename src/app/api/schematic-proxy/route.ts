import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAllowedSource(value: string): boolean {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "mediafire.com" || hostname.endsWith(".mediafire.com");
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (!source || !isAllowedSource(source)) {
    return new NextResponse("Unsupported schematic source", { status: 400 });
  }

  try {
    const pageResponse = await fetch(source, { cache: "no-store" });
    if (!pageResponse.ok) return new NextResponse("Schematic source unavailable", { status: 502 });

    const contentType = pageResponse.headers.get("content-type")?.toLowerCase() || "";
    const contentDisposition = pageResponse.headers.get("content-disposition") || "";
    if (contentDisposition || !contentType.includes("text/html")) {
      if (!pageResponse.body) return new NextResponse("Schematic download unavailable", { status: 502 });
      return new NextResponse(pageResponse.body, {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Type": contentType || "application/octet-stream",
        },
      });
    }

    const page = await pageResponse.text();
    const directUrl = page.match(/https:\/\/download[^"'\s]+/)?.[0]?.replace(/&amp;/g, "&");
    if (!directUrl) return new NextResponse("Direct schematic download unavailable", { status: 502 });

    const fileResponse = await fetch(directUrl, { cache: "no-store" });
    if (!fileResponse.ok || !fileResponse.body) return new NextResponse("Schematic download unavailable", { status: 502 });

    return new NextResponse(fileResponse.body, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("Unable to retrieve schematic", { status: 502 });
  }
}