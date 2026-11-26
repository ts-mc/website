"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Download,
  FileCode,
  Youtube,
  Box,
  Calendar,
  User,
  Gauge,
  ArrowLeft,
  Share2,
  ExternalLink,
  Info,
  Eye,
  Gamepad2,
  Globe2,
  Fingerprint,
  AlertCircle,
  MessageSquarePlus,
  Check,
  Copy,
  Boxes,
  Hammer,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import { FarmCard } from "@/components/FarmCard";
const SchematicPreviewModal = dynamic(() => import("@/components/SchematicPreviewModal").then(module => module.SchematicPreviewModal), { ssr: false });
import { MaterialListChecklist } from "@/components/MaterialListChecklist";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
import type { FarmMaterialItem, FarmWithMetadata } from "@/types/farm";
import type { ApprovedYoutubeComment } from "@/types/youtube";

const wikiGuides = [
  { edition: "java", topic: /\bshulkers?\b/i, slug: "shulker-farm-troubleshooting", title: "Troubleshoot a shulker farm" },
  { edition: "bedrock", topic: /\bsugar[ -]?cane\b/i, slug: "sugar-cane-farm-troubleshooting", title: "Troubleshoot a sugar cane farm" },
  { edition: "bedrock", topic: /\b(?:iron|villager) farms?\b/i, slug: "villager-mechanics-on-bedrock", title: "Understand Bedrock villager mechanics" },
  { edition: "java", topic: /\b(?:creeper|mob) farms?\b/i, slug: "mob-spawning-mechanics", title: "Check Java mob spawning mechanics" },
];

interface FarmDetailViewProps {
  farm: FarmWithMetadata;
  relatedFarms: FarmWithMetadata[];
  communityNotes?: ApprovedYoutubeComment[];
}

export function FarmDetailView({ farm, relatedFarms, communityNotes = [] }: FarmDetailViewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [extractedMaterials, setExtractedMaterials] = useState<FarmMaterialItem[]>(farm.materials);

  const isJava = farm.category === "java";
  const isBuild = farm.category === "build";
  const topic = [farm.farmType, farm.title, ...(farm.tags ?? [])].join(" ");
  const guides = wikiGuides.filter(guide =>
    guide.edition === farm.category && (guide.topic.test(topic) ||
      (farm.normalizedDn === "491" && guide.slug === "shulker-farm-troubleshooting"))
  );
  const ytId = farm.youtubeId;
  const displayFarm = extractedMaterials.length > 0 ? { ...farm, materials: extractedMaterials, hasMaterials: true } : farm;
  const displayDate = farm.date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? farm.date;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/?category=${farm.category}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to {isBuild ? "Builds" : isJava ? "Java" : "Bedrock"} Farms</span>
        </Link>

        {/* Badges / Edition info */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wide border shadow-sm ${
              isBuild
                ? "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30"
                : isJava
                ? "bg-[#9FFF99]/10 text-[#9FFF99] border-[#9FFF99]/30"
                : "bg-white/10 text-ink border-white/20"
            }`}
          >
            {isBuild ? <Hammer className="w-3.5 h-3.5" /> : isJava ? <JavaBrandIcon size={14} /> : <Box className="w-3.5 h-3.5" />}
            {isBuild ? "Minecraft Build" : isJava ? "Minecraft Java" : "Minecraft Bedrock"}
          </span>

          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold text-ink bg-bg-elev border border-hairline">
            DN #{farm.dn}
          </span>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-bg-elev hover:bg-bg-elev text-ink-muted hover:text-ink border border-hairline transition-colors"
            title="Copy page link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#4CAF50]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Farm Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Video / Media Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-hairline bg-[#070A12] shadow-2xl">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                title={farm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={farm.resolvedThumbnail}
                  alt={farm.title}
                  fill
                  className="object-cover opacity-60 filter blur-[2px] scale-105"
                  unoptimized={farm.resolvedThumbnail.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/70 to-[#070A12]/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-3 rounded-2xl bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 text-[#FB7185] mb-3 shadow-lg">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
                    No Video Tutorial Linked
                  </h3>
                  <p className="text-xs sm:text-sm text-ink max-w-md mb-4 leading-relaxed">
                    This farm blueprint does not have a video tutorial link provided yet. Create a ticket in our Discord to update or link the video.
                  </p>
                  <a
                    href="https://discord.gg/theysix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-ink text-xs font-bold transition-all shadow-md shadow-black/40"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Open Ticket in Discord</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {farm.youtubeViewCount !== undefined && (
            <p className="-mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
              <Youtube className="size-3.5 text-[#FB7185]" aria-hidden="true" />
              {new Intl.NumberFormat("en-US").format(farm.youtubeViewCount)} total YouTube views
            </p>
          )}

          {/* Farm Details Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-hairline space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4CADD0] font-mono">
                {farm.farmType}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {farm.title}
              </h1>
            </div>

            <p className="text-base text-ink leading-relaxed">
              {farm.description}
            </p>

            {farm.detailedDescription && (
              <div className="pt-4 border-t border-hairline">
                <div className="space-y-3 text-sm text-ink leading-relaxed">
                  {farm.detailedDescription.split("[[FARM_SECTION_DIVIDER]]").map((section, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <div className="my-5 w-full border-t border-[#f1fec8]/70" aria-hidden="true" />}
                      <p className="whitespace-pre-line break-words">{section.trim()}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {farm.tags && farm.tags.length > 0 && (
              <div className="pt-4 border-t border-hairline flex flex-wrap gap-2">
                {farm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs font-medium text-ink bg-[#111726]/80 border border-hairline"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className="glass-panel rounded-3xl border border-hairline p-6 sm:p-8" aria-labelledby="community-fixes-title">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#4CADD0]/25 bg-[#4CADD0]/10 text-[#4CADD0]">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#4CADD0]">From comments</p>
                <h2 id="community-fixes-title" className="mt-1 text-lg font-bold text-ink">Helpful notes from viewers</h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">Useful suggestions and fixes shared in the video comments.</p>
              </div>
            </div>
            {communityNotes.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {communityNotes.map((note) => (
                  <li key={note.commentId} className="rounded-2xl border border-hairline bg-[#070A12]/60 p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{note.text}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
                      <a className="underline underline-offset-2 hover:text-ink" href={`https://www.youtube.com/watch?v=${note.videoId}&lc=${note.commentId}`}>Original comment</a>
                      {note.likeCount !== undefined && <span className="inline-flex items-center gap-1"><ThumbsUp className="size-3" aria-hidden="true" /> {note.likeCount}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-hairline px-4 py-3 text-xs leading-relaxed text-ink-muted">No helpful viewer notes have been added for this farm yet.</p>
            )}
          </section>

          {/* Interactive Material List & Checklist (Track items in-game) */}
          {displayFarm.materials && displayFarm.materials.length > 0 ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-hairline space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20">
                    <Boxes className="w-4 h-4" />
                  </span>
                  <span>Material List & In-Game Checklist</span>
                </h3>
                <span className="text-xs text-ink-muted font-mono">
                  {displayFarm.materials.length} components
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Check off items as you gather them in Minecraft survival. Your progress is saved automatically on this device.
              </p>
              <MaterialListChecklist
                materials={displayFarm.materials}
                farmId={farm.dn}
                farmTitle={farm.title}
                youtubeUrl={farm.youtubeUrl}
              />
            </div>
          ) : (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#FBBF24]/20 bg-[#FBBF24]/10 space-y-4">
              <div className="flex items-center justify-between border-b border-[#FBBF24]/20 pb-3">
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20">
                    <Boxes className="w-4 h-4" />
                  </span>
                  <span>Material List & In-Game Checklist</span>
                </h3>
                <span className="text-xs text-[#FBBF24]/80 font-mono">
                  Not Provided
                </span>
              </div>

              {/* Missing Material List Notice with Discord Ticket Button & Video Tutorial Link */}
              <div className="p-4 rounded-2xl bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-ink space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#FBBF24]">
                      No Material List Provided
                    </p>
                    <p className="text-xs text-ink leading-relaxed">
                      This farm doesn&apos;t have a material list provided yet. Create a ticket in Discord and ask nicely for the material list to be added, or watch the video tutorial to see what items you need.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href="https://discord.gg/theysix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-ink text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Open Discord Ticket</span>
                  </a>
                  {farm.hasYoutube && farm.youtubeUrl && (
                    <a
                      href={farm.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-[#FF3B3B]/20 hover:bg-[#FF3B3B]/30 text-[#FF3B3B] border border-[#FF3B3B]/30 text-xs font-bold transition-all"
                    >
                      <Youtube className="w-4 h-4 text-[#FB7185]" />
                      <span>Watch Video Tutorial</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Action & Download Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-hairline space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink border-b border-hairline pb-3">
              Download & Resources
            </h2>

            {/* Download Buttons */}
            <div className="space-y-3">
              {/* World Download */}
              {farm.hasWorldDownload && farm.worldDownloadUrl && farm.worldDownloadUrl !== "link" && farm.worldDownloadUrl !== "#" ? (
                <a
                  href={farm.worldDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#4CADD0] hover:bg-[#4CADD0] text-ink font-bold transition-all shadow-lg shadow-[#4CADD0]/20 group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-sm">World Download</div>
                      <div className="text-[11px] font-normal text-[#9FEBF6] font-mono">
                        {isJava || isBuild ? ".rar world save" : ".mcworld save"}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              ) : (
                /* Missing World File Notice with Discord Ticket Button */
                <div className="p-4 rounded-2xl bg-[#0E3A47]/30 border border-[#155E75]/40 text-ink space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-[#4CADD0] shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      This farm doesn&apos;t have a world download provided, create a ticket and ask nicely for the world file to be provided.
                    </p>
                  </div>
                  <a
                    href="https://discord.gg/theysix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-ink text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Open Discord Ticket</span>
                  </a>
                </div>
              )}

              {/* Java Schematic Handling */}
              {isJava || isBuild || farm.hasSchematic ? (
                farm.hasSchematic && farm.schematicUrl ? (
                  <div className="space-y-2">
                    {(farm.schematicUrls ?? [farm.schematicUrl]).map((url, index, urls) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#9FFF99] hover:bg-[#9FFF99]/80 text-slate-950 font-bold transition-all shadow-lg shadow-[#9FFF99]/20 group"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <div className="text-sm">Schematic File{urls.length > 1 ? ` ${index + 1}` : ""}</div>
                          <div className="text-[11px] font-normal text-[#0B0E14]/80 font-mono">
                            Download schematic
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-80" />
                    </a>

                    ))}

                    {/* Preview Schematic Option */}
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#9FFF99]/10 hover:bg-[#9FFF99]/20 text-[#9FFF99] border border-[#9FFF99]/30 text-xs font-semibold transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Schematic</span>
                    </button>
                  </div>
                ) : (
                  /* Missing schematic notice */
                  <div className="p-4 rounded-2xl bg-[#9FFF99]/10 border border-[#9FFF99]/30 text-ink space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-[#9FFF99] shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        This farm doesn&apos;t have a schematic yet. Send its DN in{" "}
                        <a href="https://discord.com/channels/985227944236568606/1559976502647590953" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#9FFF99]">#Top Schematics wanted</a>
                        {" "}to request it, or upload the schematic in{" "}
                        <a href="https://discord.com/channels/985227944236568606/1559942519482089492" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#9FFF99]">#📤╏submissions</a>.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                /* Bedrock Notice - No Schematics for Bedrock */
                <div className="p-3.5 rounded-2xl bg-[#0B0E14]/80 border border-hairline text-xs text-ink-muted space-y-1">
                  <div className="font-semibold text-ink">Bedrock Edition Notice</div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    Bedrock Edition does not support .litematic schematics. Full playable world save is provided above.
                  </p>
                </div>
              )}

              {/* YouTube Tutorial Link */}
              {farm.hasYoutube && farm.youtubeUrl ? (
                <a
                  href={farm.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#FF3B3B]/20 hover:bg-[#FF3B3B]/30 text-[#FF3B3B] border border-[#FF3B3B]/30 font-semibold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-[#FB7185] group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-sm">Watch on YouTube</div>
                      <div className="text-[11px] font-normal text-[#FF3B3B]/80">
                        TheySix Video Tutorial
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              ) : (
                /* Missing YouTube Video Notice with Discord Ticket Button */
                <div className="p-4 rounded-2xl bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 text-ink space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      This farm doesn&apos;t have a video link provided, create a ticket in Discord to update or request the video link.
                    </p>
                  </div>
                  <a
                    href="https://discord.gg/theysix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-ink text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Open Discord Ticket</span>
                  </a>
                </div>
              )}
            </div>

            {/* Farm Specs Table */}
            <div className="space-y-3 pt-4 border-t border-hairline text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Minecraft Version</span>
                <span className="font-mono font-semibold text-ink">
                  {farm.latestVersion || farm.version || "1.21+"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-1.5 border-b border-hairline">
                <span className="flex items-center gap-1.5 text-ink-muted"><Gamepad2 className="w-3.5 h-3.5" /> Game Mode</span>
                <span className="font-semibold text-ink">{farm.gameMode || "Not recorded"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-1.5 border-b border-hairline">
                <span className="flex items-center gap-1.5 text-ink-muted"><Globe2 className="w-3.5 h-3.5" /> World Version</span>
                <span className="font-mono font-semibold text-ink">{farm.worldVersion || "Not recorded"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-1.5 border-b border-hairline">
                <span className="flex items-center gap-1.5 text-ink-muted"><Fingerprint className="w-3.5 h-3.5" /> Seed</span>
                <span className="max-w-[12rem] truncate font-mono font-semibold text-ink" title={farm.seed || undefined}>{farm.seed || "Not recorded"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Dimension</span>
                <span className="font-semibold text-ink">{farm.dimension || "Overworld / not recorded"}</span>
              </div>

              {farm.rates && (
                <div className="flex items-center justify-between py-1.5 border-b border-hairline">
                  <span className="text-ink-muted">Expected Rates</span>
                  <span className="font-mono font-semibold text-[#4CAF50]">
                    {farm.rates}
                  </span>
                </div>
              )}

              {farm.youtubeViewCount !== undefined && (
                <div className="flex items-center justify-between py-1.5 border-b border-hairline">
                  <span className="flex items-center gap-1.5 text-ink-muted"><Youtube className="w-3.5 h-3.5 text-[#FB7185]" /> YouTube views</span>
                  <span className="font-mono font-semibold text-ink">{new Intl.NumberFormat("en-US").format(farm.youtubeViewCount)}</span>
                </div>
              )}

              {farm.difficulty && (
                <div className="flex items-center justify-between py-1.5 border-b border-hairline">
                  <span className="text-ink-muted">Difficulty</span>
                  <span className="font-semibold text-ink">{farm.difficulty}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Creator / Designer</span>
                <span className="font-semibold text-ink">{farm.creatorName || farm.author || "TheySix"}</span>
              </div>

              {farm.date && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-ink-muted">Updated Date</span>
                  <span className="font-mono text-ink-muted">{displayDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {guides.length > 0 && (
        <section className="space-y-3 border-t border-hairline pt-6">
          <h2 className="text-xl font-bold text-ink">Related wiki guides</h2>
          {guides.map(guide => (
            <a key={guide.slug} className="block text-ink underline" href={`https://wiki.theysix.tech/w/${guide.edition}/${guide.slug}`}>
              {guide.title}
            </a>
          ))}
        </section>
      )}

      {/* Related Farms */}
      {relatedFarms.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-hairline">
          <h2 className="text-2xl font-bold text-ink tracking-tight">
            More {isBuild ? "Build" : isJava ? "Java" : "Bedrock"} Blueprints
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedFarms.map((rf) => (
              <FarmCard key={`${rf.category}-${rf.dn}`} farm={rf} />
            ))}
          </div>
        </div>
      )}

      {/* Schematic Preview Modal */}
      {(isJava || isBuild) && (
        <SchematicPreviewModal
          farm={displayFarm}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onMaterialsExtracted={setExtractedMaterials}
        />
      )}
    </div>
  );
}
