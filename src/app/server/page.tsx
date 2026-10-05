import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Server,
  ShieldCheck,
  Trophy,
  Users,
  Sparkles,
  Layers,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Flame,
  Globe
} from "lucide-react";

export const metadata: Metadata = {
  title: "TheySix Minecraft Server | Survival, Technical Farms & Cross-Play",
  description: "Join the official TheySix Minecraft Server for Java and Bedrock. Community events managed by ro_mihaiu at discord.ro-mihaiu.xyz.",
};

export default function ServerMainPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-2">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-b from-[#111726]/90 via-[#111726]/50 to-[#070A12] p-8 sm:p-12 text-center space-y-5 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3A47]/80 border border-[#155E75] text-[#4CADD0] text-xs font-semibold uppercase font-mono">
          <Server className="w-3.5 h-3.5" /> Official Minecraft SMP
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CADD0] via-[#2DD4BF] to-[#FBBF24]">TheySix Server</span>
        </h1>

        <p className="text-sm sm:text-base text-ink max-w-2xl mx-auto leading-relaxed">
          The official community server built for survival enthusiasts, redstone engineers, and mega-builders. Fully compatible with both <strong className="text-[#9FFF99] font-semibold">Java</strong> and <strong className="text-ink font-semibold">Bedrock</strong> editions.
        </p>

        {/* Event Manager Highlight Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FBBF24]/15 via-[#FF8A3D]/10 to-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] max-w-2xl mx-auto text-xs sm:text-sm space-y-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 font-bold text-[#FBBF24] text-sm sm:text-base">
            <Trophy className="w-5 h-5 text-[#FBBF24] shrink-0" /> Community Events & Tournaments
          </div>
          <p className="leading-relaxed text-ink text-sm">
            All server events, tournaments, and community competitions are personally organized and managed by <a
              href="https://discord.ro-mihaiu.xyz"
              target="_blank"
              rel="noopener noreferrer"
            >
            <strong className="text-[#FBBF24] font-bold underline decoration-amber-400/50 underline-offset-2">ro_mihaiu</strong>.
            </a>
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://discord.gg/theysix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control bg-[#FBBF24] hover:bg-[#FBBF24]/80 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-[#FBBF24]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Globe className="w-4 h-4" />
              <span>Join Discord</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Server Connection Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2 text-left text-xs">
          <div className="p-4 rounded-2xl bg-[#0B0E14]/80 border border-hairline space-y-1.5">
            <span className="label-mono text-ink-dim">Java Edition IP</span>
            <div className="font-mono text-[#9FEBF6] font-bold text-sm select-all">
              theysix.sparked.host
            </div>
            <span className="text-[11px] text-ink-muted">Version 1.21+ (Default port: 25565)</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0E14]/80 border border-hairline space-y-1.5">
            <span className="label-mono text-ink-dim">Bedrock Edition IP &amp; Port</span>
            <div className="font-mono text-ink font-bold text-sm select-all">
              theysix.sparked.host:19132
            </div>
            <span className="text-[11px] text-ink-muted">Bedrock iOS / Android / Win10 / Console</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rules */}
        <Link
          href="/server/rules"
          className="group glass-panel p-7 rounded-3xl border border-hairline hover:border-[#4CADD0]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#4CADD0]/10 text-[#4CADD0] border border-[#4CADD0]/20 w-fit group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink group-hover:text-[#9FEBF6] transition-colors">
              Server Rules & Guidelines
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Read community standards, griefing policies, allowed client mods, and redstone lag limit rules.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#4CADD0] group-hover:translate-x-1 transition-transform">
            <span>View Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Events */}
        <Link
          href="/server/events"
          className="group glass-panel p-7 rounded-3xl border border-hairline hover:border-[#FBBF24]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 w-fit group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink group-hover:text-[#FBBF24] transition-colors">
              Events & Competitions
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Participate in seasonal build battles, dragon rushes, and UHC tournaments to win in-game prizes.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#FBBF24] group-hover:translate-x-1 transition-transform">
            <span>Explore Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Staff */}
        <Link
          href="/server/staff"
          className="group glass-panel p-7 rounded-3xl border border-hairline hover:border-[#A855F7]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#A855F7]/10 text-[#A855F7] border border-purple-500/20 w-fit group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink group-hover:text-[#A855F7] transition-colors">
              Server Staff Team
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Meet the founders, developers, redstone leads, and moderators dedicated to keeping gameplay smooth.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#A855F7] group-hover:translate-x-1 transition-transform">
            <span>Meet the Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Community Links Callout */}
      <div className="glass-panel p-8 rounded-3xl border border-hairline flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold text-ink flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-5 h-5 text-[#5865F2]" /> Need Whitelist Support or Farm Help?
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted">
            Join the official TheySix Discord for whitelist support, player voice chats, and schematic discussions.
          </p>
        </div>

        <a
          href="https://discord.gg/theysix"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-ink font-bold text-sm transition-all shadow-md shadow-[#5865F2]/20 shrink-0"
        >
          <MessageSquare className="w-4 h-4 fill-current" /> Join Discord Server
        </a>
      </div>
    </div>
  );
}
