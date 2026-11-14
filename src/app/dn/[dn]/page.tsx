import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import youtubeSnapshots from "@/data/youtube-metadata.json";
import { getAllFarms } from "@/lib/farms";
import { getApprovedYoutubeComments } from "@/lib/youtube-comments";
import { FarmDetailView } from "@/components/FarmDetailView";
import type { FarmWithMetadata } from "@/types/farm";
import type { YoutubeMetadataSnapshot } from "@/types/youtube";

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

function cleanSourcedYoutubeDescription(raw: string) {
  const fallback = cleanYoutubeDescription(raw);
  const sectionPattern = /(?:^|\n)[_\s]*\[\s*([^\]]+?)\s*\][^\n]*(?:\n|$)/gim;
  const headings = Array.from(raw.matchAll(sectionPattern));
  const getSection = (name: string) => {
    const index = headings.findIndex((heading) => heading[1].trim().toLowerCase() === name.toLowerCase());
    if (index < 0) return "";
    const start = (headings[index].index || 0) + headings[index][0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index || raw.length : raw.length;
    return raw.slice(start, end)
      .replace(/📂\s*If you want to download[^\n]*(?:\n|$)/gi, "")
      .replace(/🔎\s*Link\s*:[^\n]*(?:\n|$)/gi, "")
      .replace(/📩\s*Download Number[^\n]*(?:\n|$)/gi, "")
      .trim();
  };
  const farmDetails = getSection("Farm Details");
  const gameInformation = getSection("Game Information");
  const intro = raw.slice(0, headings[0]?.index ?? raw.length).trim();
  const summary = intro
    .split(/\n{2,}/)
    .filter((paragraph) => !/(sponsor|hosting|use code|https?:\/\/)/i.test(paragraph))
    .join("\n\n")
    .trim();
  const details = [farmDetails, gameInformation].filter(Boolean).join("\n[[FARM_SECTION_DIVIDER]]\n").trim();
  const creatorName = (farmDetails || raw).match(/(?:Base\s+)?Design\s*By\s*[:：]\s*@?([^\n]+)/i)?.[1]?.trim();

  return {
    summary: summary || fallback.summary,
    details: details || fallback.details,
    creatorName: creatorName || fallback.creatorName,
    latestVersion: fallback.latestVersion,
  };
}

type YoutubeMetadata = YoutubeMetadataSnapshot;
const localYoutubeSnapshots = youtubeSnapshots as Record<string, YoutubeMetadata>;

async function getYoutubeMetadata(youtubeId: string): Promise<YoutubeMetadata | undefined> {
  const snapshot = localYoutubeSnapshots[youtubeId];
  // Metadata is refreshed by the importer, not while someone is opening a
  // farm page. This avoids YouTube 429 responses and keeps page loads stable.
  return snapshot?.description ? snapshot : undefined;
}

async function enrichFromYoutube(farm: FarmWithMetadata): Promise<FarmWithMetadata> {
  if (!farm.youtubeUrl || !farm.youtubeId) return farm;
  try {
    const metadata = await getYoutubeMetadata(farm.youtubeId);
    if (!metadata) return farm;
    if (!metadata.description) return { ...farm, title: metadata.title || farm.title };
    const { summary, details, creatorName, latestVersion } = cleanSourcedYoutubeDescription(metadata.description);
    return {
      ...farm,
      title: metadata.title || farm.title,
      description: summary || farm.description,
      detailedDescription: details || farm.detailedDescription,
      creatorName,
      latestVersion,
      youtubeViewCount: metadata.viewCount ?? farm.youtubeViewCount,
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

  return <FarmDetailView
    farm={farm}
    relatedFarms={relatedFarms}
    communityNotes={getApprovedYoutubeComments(farm.youtubeId)}
  />;
}
