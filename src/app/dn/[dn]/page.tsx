import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllFarms } from "@/lib/farms";
import { FarmDetailView } from "@/components/FarmDetailView";
import type { FarmWithMetadata } from "@/types/farm";

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanYoutubeDescription(raw: string): { summary: string; details?: string; creatorName?: string; latestVersion?: string } {
  const withoutBoilerplate = raw
    .replace(/💻\s*Platforms\s*:[^\n]*(?:\n|$)/gi, "")
    .replace(/📂\s*If you want to download[\s\S]*?(?=\n\s*_{5,}|$)/gi, "")
    .replace(/🔎\s*Link\s*:[^\n]*(?:\n|$)/gi, "")
    .replace(/📩\s*Download Number[^\n]*(?:\n|$)/gi, "");
  const sectionPattern = /(?:^|\n)\s*_*\s*\[\s*([^\]]+?)\s*\]\s*_*/gim;
  const sections: string[] = [];
  const allSectionMatches = Array.from(withoutBoilerplate.matchAll(sectionPattern));
  const matches = allSectionMatches.filter((match) => /^(Farm Details|Game Information|Data)$/i.test(match[1].trim()));

  const intro = matches.length ? withoutBoilerplate.slice(0, matches[0].index).trim() : withoutBoilerplate.trim();
  let creatorName: string | undefined;
  matches.forEach((match, index) => {
    const start = (match.index || 0) + match[0].length;
    const end = allSectionMatches.find((section) => (section.index || 0) >= start)?.index ?? withoutBoilerplate.length;
    const section = withoutBoilerplate.slice(start, end).trim();
    const creatorMatch = section.match(/💌\s*Design By\s*:\s*([^\n]+)/i);
    if (creatorMatch) creatorName = creatorMatch[1].trim();
    const cleaned = section.trim();
    if (cleaned) sections.push(cleaned);
  });

  const creatorMatch = raw.match(/Design\s*By\s*[:：]\s*@?([\w.-]+)/i);
  if (creatorMatch) creatorName = creatorMatch[1].trim();
  const versionsLine = raw.match(/✨\s*Versions?\s*[:：]\s*([^\r\n]+)/i)?.[1] || "";
  const listedVersions = versionsLine.match(/\b\d+(?:\.\d+){1,2}\b/g) || [];
  const latestVersion = listedVersions[listedVersions.length - 1];

  const details = sections.join("\n[[FARM_SECTION_DIVIDER]]\n").trim();
  return {
    summary: matches.length ? intro : "",
    details: details || undefined,
    creatorName,
    latestVersion,
  };
}

type YoutubeMetadata = { title?: string; description?: string };

async function getYoutubeMetadata(youtubeId: string): Promise<YoutubeMetadata> {
  const response = await fetch(`https://www.youtube.com/watch?v=${youtubeId}`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.youtube.com/",
      },
  });
  const html = await response.text();
  const titleMatch = html.match(/<meta\s+name="title"\s+content="([^"]*)"/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  // YouTube embeds shortDescription as a JSON string in ytInitialPlayerResponse.
  const fullDescriptionMatch = html.match(/"shortDescription"\s*:\s*("(?:\\.|[^"\\])*")/);
  console.info("YouTube farm metadata response", {
    youtubeId,
    status: response.status,
    responseBytes: Buffer.byteLength(html),
    hasTitle: Boolean(titleMatch?.[1]),
    hasFullDescription: Boolean(fullDescriptionMatch?.[1]),
  });
  if (!response.ok) throw new Error(`YouTube metadata request failed (${response.status})`);
  if (!fullDescriptionMatch?.[1]) throw new Error("YouTube full description was not present in the video response");
  const rawDescription = JSON.parse(fullDescriptionMatch[1]) as string;
  if (!rawDescription.trim()) throw new Error("YouTube returned an empty video description");
  return {
    title: titleMatch?.[1] ? decodeHtml(titleMatch[1]) : undefined,
    description: rawDescription,
  };
}

async function enrichFromYoutube(farm: FarmWithMetadata): Promise<FarmWithMetadata> {
  if (!farm.youtubeUrl || !farm.youtubeId) return farm;
  try {
    const metadata = await getYoutubeMetadata(farm.youtubeId);
    if (!metadata.description) return { ...farm, title: metadata.title || farm.title };
    const { summary, details, creatorName, latestVersion } = cleanYoutubeDescription(metadata.description);
    return {
      ...farm,
      title: metadata.title || farm.title,
      description: summary || farm.description,
      detailedDescription: details || farm.detailedDescription,
      creatorName,
      latestVersion,
    };
  } catch (error) {
    console.error(`Unable to load full YouTube metadata for farm ${farm.dn}:`, error);
    return farm;
  }
}

export const dynamic = "force-dynamic";

interface DnPageProps {
  params: {
    dn: string;
  };
}

/** Matches "531", "531-dn", "B165", "b165-dn", "C42" case-insensitively. */
function normalizeDnKey(value: string): string {
  return value.toLowerCase().replace(/-dn$/i, "");
}

export async function generateMetadata({ params }: DnPageProps): Promise<Metadata> {
  const farms = await getAllFarms();
  const farm = farms.find((f) => normalizeDnKey(f.dn) === normalizeDnKey(params.dn));
  if (!farm) {
    return {
      title: "Farm Not Found | TheySix",
    };
  }

  const categoryName =
    farm.category === "build" ? "Build" : farm.category === "java" ? "Java Edition" : "Bedrock Edition";

  return {
    title: `${farm.title} (${categoryName}) | TheySix Minecraft Farms`,
    description: farm.description,
    alternates: {
      canonical: `/dn/${normalizeDnKey(farm.dn)}`,
    },
    openGraph: {
      title: `${farm.title} - TheySix Minecraft Farm`,
      description: farm.description,
      images: [farm.resolvedThumbnail],
    },
  };
}

export default async function FarmDetailPage({ params }: DnPageProps) {
  const farms = await getAllFarms();
  const matchedFarm = farms.find((f) => normalizeDnKey(f.dn) === normalizeDnKey(params.dn));

  if (!matchedFarm) {
    notFound();
  }
  const farm = await enrichFromYoutube(matchedFarm);

  // Find related farms (same category or farmType, excluding current)
  const relatedFarms = farms
    .filter(
      (f) =>
        f.dn !== farm.dn &&
        (f.category === farm.category || f.farmType === farm.farmType)
    )
    .slice(0, 3);

  return <FarmDetailView farm={farm} relatedFarms={relatedFarms} />;
}
