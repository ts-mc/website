"use client";

import Link from "next/link";
import { editionLabels, type WikiEdition } from "@/types/wiki";

const editions: WikiEdition[] = ["java", "bedrock", "discord"];

const activeClasses: Record<WikiEdition, string> = {
  java: "bg-[#0E3A47] text-brand-hi",
  bedrock: "bg-bg-elev text-ink",
  discord: "bg-[#5865F2]/15 text-[#96A0FA]",
};

export function EditionSwitcher({
  currentEdition,
  currentSlug,
}: {
  currentEdition: WikiEdition;
  currentSlug?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Wiki edition"
      className="inline-flex rounded-pill border border-hairline bg-bg-elev p-1"
    >
      {editions.map((edition) => {
        const active = edition === currentEdition;
        return (
          <Link
            key={edition}
            href={
              currentSlug && edition !== currentEdition
                ? `/wiki/${edition}/${currentSlug}`
                : `/wiki/${edition}`
            }
            aria-current={active ? "true" : undefined}
            className={`label-mono flex min-h-7 items-center rounded-pill px-3 py-1.5 transition-colors ${active
                ? activeClasses[edition]
                : "text-ink-dim hover:text-ink"
              }`}
          >
            {editionLabels[edition]}
          </Link>
        );
      })}
    </div>
  );
}
