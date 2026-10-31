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

  if (!matches.length) return { summary: withoutBoilerplate.trim() };

  const intro = withoutBoilerplate.slice(0, matches[0].index).trim();
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
  return { summary: intro, details: details || undefined, creatorName, latestVersion };
}

async function enrichFromYoutube(farm: FarmWithMetadata): Promise<FarmWithMetadata> {
  if (!farm.youtubeUrl || !farm.youtubeId) return farm;
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${farm.youtubeId}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) return farm;
    const html = await response.text();
    const titleMatch = html.match(/<meta\s+name="title"\s+content="([^"]*)"/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
    const fullDescriptionMatch = html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/);
    const title = titleMatch?.[1] ? decodeHtml(titleMatch[1]) : farm.title;
    const rawDescription = fullDescriptionMatch?.[1]
      ? JSON.parse(`"${fullDescriptionMatch[1]}"`) as string
      : descriptionMatch?.[1] ? decodeHtml(descriptionMatch[1]) : "";
    if (!rawDescription) return { ...farm, title };
    const { summary, details, creatorName, latestVersion } = cleanYoutubeDescription(rawDescription);
    return {
      ...farm,
      title,
      description: summary || farm.description,
      detailedDescription: details || farm.detailedDescription,
      creatorName,
      latestVersion,
    };
  } catch {
    return farm;
  }
}

interface DnPageProps {
  params: {
    dn: string;
  };
}

/** Matches "531", "531-dn", "B165", "b165-dn", "C42" case-insensitively. */
function normalizeDnKey(value: string): string {
  return value.toLowerCase().replace(/-dn$/i, "");
}

export async function generateStaticParams() {
  const farms = await getAllFarms();
  const seen = new Set<string>();
  const params: { dn: string }[] = [];

  farms.forEach((farm) => {
    const key = normalizeDnKey(farm.dn);
    if (key && !seen.has(key)) {
      seen.add(key);
      params.push({ dn: farm.dn });
    }
  });

  return params;
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
