import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, FileCode, Youtube, ArrowUpRight, Gauge } from "lucide-react";
import { RealViewsCount } from "@/components/RealViewsCount";
import type { FarmWithMetadata } from "@/types/farm";

interface FarmCardProps {
  farm: FarmWithMetadata;
}

export function FarmCard({ farm }: FarmCardProps) {
  const isJava = farm.category === "java";
  const isBuild = farm.category === "build";
  const farmUrl = `/dn/${farm.normalizedDn}`;

  return (
    <div className="group card-hue glass-panel rounded-card border border-hairline bg-[#131722]/60 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      {/* Media / Thumbnail Header */}
      <Link href={farmUrl} className="relative aspect-video w-full overflow-hidden bg-[#070A12] block">
        <Image
          src={farm.resolvedThumbnail}
          alt={farm.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={farm.resolvedThumbnail.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-80" />

        {/* Bottom thumbnail bar: View count on bottom-left, Rates on bottom-right */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-ink z-10 pointer-events-none">
          <span className="label-mono inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill bg-[#0B0E14]/90 text-[#CBD5E1] border border-hairline backdrop-blur-md shadow-sm pointer-events-auto">
            {farm.youtubeViewCount !== undefined ? <><Youtube className="w-3 h-3 text-[#FB7185]" /> {farm.youtubeViewsDisplay || farm.youtubeViewCount} views</> : <RealViewsCount dn={farm.dn} initialViews={farm.views} />}
          </span>

          {farm.rates && (
            <span className="label-mono inline-flex items-center gap-1 px-2.5 py-1.5 rounded-pill bg-[#0E3A47]/90 text-[#B2F9FF] border border-[#4CADD0]/40 backdrop-blur-md shadow-sm">
              <Gauge className="w-3 h-3" /> {farm.rates}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-end gap-2 mb-1.5">
            {farm.difficulty && (
              <span className="text-[11px] font-medium text-ink-muted">
                {farm.difficulty}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={farmUrl} className="group-hover:text-brand-hi transition-colors">
            <h3 className="text-lg font-bold text-ink line-clamp-1 group-hover:underline">
              {farm.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-ink-muted mt-2 line-clamp-2 leading-relaxed">
            {farm.description}
          </p>

          {/* Tags */}
          {farm.tags && farm.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {farm.tags
                .flatMap((tag) => /both platforms|both editions|java\s*&\s*bedrock|java and bedrock/i.test(tag) ? ["Java", "Bedrock"] : [tag])
                .filter((tag, index, tags) => tags.findIndex((candidate) => candidate.toLowerCase() === tag.toLowerCase()) === index)
                .slice(0, 3)
                .map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    tag.toLowerCase() === "java"
                        ? "text-[#60A5FA] bg-[#172554] border-[#3B82F6]"
                        : tag.toLowerCase() === "bedrock"
                          ? "text-[#FDE047] bg-[#422006] border-[#EAB308]"
                          : tag.toLowerCase() === "build"
                            ? "text-[#FCA5A5] bg-[#450A0A] border-[#EF4444]"
                            : "text-[#D1D5DB] bg-[#374151]/60 border-[#6B7280]"
                  }`}
                >
                  #{tag}
                </span>
              ))}
              {farm.tags.length > 3 && (
                <span className="text-[11px] text-ink-dim self-center">
                  +{farm.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-hairline flex items-center gap-2">
          {/* World Download Link */}
          {farm.hasWorldDownload && farm.worldDownloadUrl && farm.worldDownloadUrl !== "link" && farm.worldDownloadUrl !== "#" ? (
            <a
              href={farm.worldDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-control text-xs font-semibold text-ink bg-bg-elev hover:bg-surface-hover border border-hairline hover:border-hairline-hover transition-all"
              title="Download World Save"
            >
              <Download className="w-3.5 h-3.5 text-brand" />
              <span>World Save</span>
            </a>
          ) : (
            <Link
              href={farmUrl}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-control text-[11px] font-medium text-ink-dim bg-[#111726]/80 border border-hairline hover:text-brand hover:border-hairline-hover transition-colors"
              title="No world file provided - Click to request ticket"
            >
              <span>No World</span>
            </Link>
          )}

          {/* Java Schematic Download / Preview Link */}
          {(isJava || isBuild) && (
            farm.hasSchematic && farm.schematicUrl ? (
              <a
                href={farm.schematicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-control text-xs font-semibold text-ink bg-bg-elev hover:bg-surface-hover border border-hairline hover:border-hairline-hover transition-all"
                title="Download .litematic Schematic"
              >
                <FileCode className="w-3.5 h-3.5 text-lime" />
                <span>Schematic</span>
              </a>
            ) : (
              <Link
                href={farmUrl}
                className="px-2.5 py-2 rounded-control text-[11px] font-medium text-ink-dim bg-[#111726]/80 border border-hairline hover:text-lime hover:border-hairline-hover transition-colors"
                title="No schematic provided - Click to request ticket"
              >
                <span>No Schem.</span>
              </Link>
            )
          )}

          {/* YouTube Tutorial Link */}
          {farm.hasYoutube && farm.youtubeUrl ? (
            <a
              href={farm.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-control text-ink-muted hover:text-rose hover:bg-[#FB7185]/10 border border-hairline hover:border-[#FB7185]/30 transition-all"
              title="Watch Video Tutorial on YouTube"
              aria-label="Watch YouTube video"
            >
              <Youtube className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={farmUrl}
              className="p-2 rounded-control text-ink-dim hover:text-rose hover:bg-[#FB7185]/10 border border-hairline hover:border-hairline-hover transition-colors"
              title="No video link provided - Click to request ticket"
              aria-label="No video link provided"
            >
              <Youtube className="w-4 h-4 opacity-40" />
            </Link>
          )}

          {/* View Details Link */}
          <Link
            href={farmUrl}
            className="p-2 rounded-control text-ink-muted hover:text-brand hover:bg-[#4CADD0]/10 border border-hairline hover:border-[#4CADD0]/30 transition-all"
            title="View Full Farm Page"
            aria-label="View Full Farm Page"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

