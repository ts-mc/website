import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllFarms } from "@/lib/farms";
import { FarmGrid } from "@/components/FarmGrid";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
import { Sparkles, Box, Download, Youtube, MessageSquare, ShieldCheck, FileCode, Hammer } from "lucide-react";

export const revalidate = 0; // Dynamic server evaluation

export default async function HomePage() {
  const farms = await getAllFarms();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-panel glass p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background glow accents */}
        <div className="glow-orb -top-24 -left-24 w-96 h-96 bg-[#4CADD0]/10" />
        <div className="glow-orb -bottom-24 -right-24 w-96 h-96 bg-[#FBBF24]/10" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-6 text-center md:text-left max-w-2xl">
            <div className="label-mono inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-[#0E3A47] text-brand-hi border border-hairline">
              <Sparkles className="w-3.5 h-3.5" /> Official TheySix Farm Database
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-tight">
              Master Every <span className="text-gradient">Minecraft Farm</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              Explore world downloads, Litematica schematics, and step-by-step video tutorials for both
              <strong className="text-lime font-semibold"> Java</strong> and
              <strong className="text-ink font-semibold"> Bedrock</strong> editions.
            </p>

            {/* Quick Action CTA buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
              <Link
                href="/?category=java#farms"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-lime hover:bg-[#9FFF99]/80 text-slate-950 font-bold text-sm shadow-lg shadow-[#9FFF99]/20 transition-all hover:scale-[1.02]"
              >
                <JavaBrandIcon size={16} /> Java Farms
              </Link>
              <Link
                href="/?category=bedrock#farms"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-slate-100 hover:bg-white text-slate-950 font-bold text-sm shadow-lg shadow-white/20 transition-all hover:scale-[1.02]"
              >
                <Box className="w-4 h-4" /> Bedrock Farms
              </Link>
              <Link
                href="/?category=build#farms"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-amber hover:bg-[#FBBF24]/80 text-slate-950 font-bold text-sm shadow-lg shadow-[#FBBF24]/20 transition-all hover:scale-[1.02]"
              >
                <Hammer className="w-4 h-4" /> Builds
              </Link>
              <Link
                href="/?category=both"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-brand hover:bg-[#4CADD0]/80 text-slate-950 font-bold text-sm shadow-lg shadow-[#4CADD0]/20 transition-all hover:scale-[1.02]"
              >
                <span>Both Platforms</span>
              </Link>
              <a
                href="https://discord.gg/theysix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-bg-elev hover:bg-surface-hover text-ink font-semibold text-sm border border-hairline transition-all"
              >
                <MessageSquare className="w-4 h-4 text-blurple-text" /> Join Community
              </a>
            </div>
          </div>

          {/* Hero Branding / Logo Preview */}
          <div className="shrink-0 relative">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-panel overflow-hidden border-2 border-[#9FFF99]/30 shadow-2xl bg-[#0B0E14]/80 p-2 group flex items-center justify-center">
                <Image src="/logo.gif" alt="TheySix logo" fill className="object-cover rounded-panel group-hover:scale-105 transition-transform duration-500" priority unoptimized />
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-hairline text-xs sm:text-sm text-ink-muted">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-brand shrink-0" />
            <span>Instant World Saves</span>
          </div>
          <div className="flex items-center gap-2.5">
            <FileCode className="w-4 h-4 text-lime shrink-0" />
            <span>Litematica Schematics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Youtube className="w-4 h-4 text-rose shrink-0" />
            <span>Video Tutorials</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />
            <span>Tested on 1.21+</span>
          </div>
        </div>
      </section>

      {/* Farm Catalog Section */}
      <section id="farms" className="scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Farm Schematics & Downloads
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              Browse through our collection of Minecraft farm blueprints and world archives.
            </p>
          </div>
        </div>

        {/* Dynamic Client Grid */}
        <Suspense fallback={<div className="text-center py-20 text-ink-muted font-mono">Loading farms...</div>}>
          <FarmGrid initialFarms={farms} />
        </Suspense>
      </section>
    </div>
  );
}

