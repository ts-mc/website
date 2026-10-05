import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, FileCode, Youtube, Box, ArrowUpRight, Gauge, Hammer } from "lucide-react";
import { RealViewsCount } from "@/components/RealViewsCount";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
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

        {/* Edition Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[70%]">
          {isBuild ? (
            <span className="label-mono inline-flex items-center gap-1 px-2.5 py-1.5 rounded-pill shadow-md backdrop-blur-md bg-[#FBBF24]/90 text-slate-950">
              <Hammer className="w-3 h-3" /> Builds
            </span>
          ) : farm.supportsBothPlatforms ? (
            <span className="label-mono inline-flex items-center gap-1 px-2.5 py-1.5 rounded-pill shadow-md backdrop-blur-md bg-[#0B0E14]/80 text-[#B2F9FF] border border-[#4CADD0]/40">
              <JavaBrandIcon size={12} />
              <Box className="w-3 h-3 text-ink" />
              Both Platforms
            </span>
          ) : (
            <span
              className={`label-mono inline-flex items-center gap-1 px-2.5 py-1.5 rounded-pill shadow-md backdrop-blur-md ${
                isJava
                  ? "bg-[#9FFF99]/15 text-[#9FFF99] border border-[#9FFF99]/30 bg-[#0B0E14]/80"
                  : "bg-white/15 text-ink border border-white/30 bg-[#0B0E14]/80"
              }`}
            >
              {isJava ? <JavaBrandIcon size={12} /> : <Box className="w-3 h-3" />}
              {isJava ? "Java" : "Bedrock"}
            </span>
          )}

          {farm.version && (
            <span className="label-mono px-2 py-1.5 rounded-pill text-[#94A3B8] bg-[#0B0E14]/80 border border-hairline backdrop-blur-md">
              {farm.version}
            </span>
          )}
        </div>

        {/* DN ID Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="label-mono px-2 py-1.5 rounded-pill text-[#94A3B8] bg-[#0B0E14]/90 border border-hairline backdrop-blur-md">
            #{farm.dn}
          </span>
        </div>

        {/* Bottom thumbnail bar: View count on bottom-left, Rates on bottom-right */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-ink z-10 pointer-events-none">
          <span className="label-mono inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill bg-[#0B0E14]/90 text-[#CBD5E1] border border-hairline backdrop-blur-md shadow-sm pointer-events-auto">
            <RealViewsCount dn={farm.dn} initialViews={farm.views} />
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
          {/* Farm Type */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="label-mono text-brand">
              {farm.farmType}
            </span>
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
              {(farm.supportsBothPlatforms
                ? [
                    "Both Platforms",
                    ...farm.tags.filter((t) => !/both platforms|java\s*&\s*bedrock/i.test(t)),
                  ]
                : farm.tags
              )
                .slice(0, 3)
                .map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    /both platforms/i.test(tag)
                      ? "text-[#B2F9FF] bg-[#0E3A47]/60 border-[#1E293B]"
                      : "text-ink-muted bg-[#111726]/60 border-hairline"
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

