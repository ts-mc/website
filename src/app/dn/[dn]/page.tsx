import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllFarms } from "@/lib/farms";
import { FarmDetailView } from "@/components/FarmDetailView";

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
  const farm = farms.find((f) => normalizeDnKey(f.dn) === normalizeDnKey(params.dn));

  if (!farm) {
    notFound();
  }

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
    communityNotes={farm.communityNotes}
  />;
}
