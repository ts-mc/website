import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Swords, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Official Server Rules | TheySix Minecraft Server",
  description: "Read the official community rules and gameplay guidelines for the TheySix Minecraft Server.",
};

const ruleSections = [
  {
    icon: Users,
    title: "1. Respect & General Conduct",
    color: "from-[#818CF8]/20 to-[#4CADD0]/10 text-[#4CADD0] border-[#4CADD0]/30",
    rules: [
      { do: "Be respectful to all players and staff members in chat and voice channels." },
      { do: "Keep server discussions family-friendly and welcoming." },
      { dont: "No hate speech, harassment, discrimination, toxic behavior, or excessive spam." },
      { dont: "No advertising other servers, discords, or unapproved external services." },
    ],
  },
  {
    icon: ShieldCheck,
    title: "2. Building, Griefing & Stealing",
    color: "from-[#4CAF50]/20 to-[#2DD4BF]/10 text-[#4CAF50] border-[#4CAF50]/30",
    rules: [
      { do: "Claim your base area and respect other players' claimed territory." },
      { do: "Ask permission before building near another player's base or farm." },
      { dont: "No griefing, destroying builds, or unauthorized block breaking of any kind." },
      { dont: "No looting chests, item sorters, or stealing from other players' farms." },
    ],
  },
  {
    icon: Cpu,
    title: "3. Redstone, Farms & Server Performance",
    color: "from-[#FBBF24]/20 to-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30",
    rules: [
      { do: "Always include an ON/OFF toggle switch for every redstone clock and mob spawner." },
      { do: "Turn off high-output farms when you are not actively using or collecting the drops." },
      { dont: "No infinite redstone loops that run permanently when the owner is offline." },
      { dont: "No intentionally lag-inducing machines, massive entity pile-ups, or chunk loaders without staff approval." },
    ],
  },
  {
    icon: Swords,
    title: "4. PvP & Fair Play",
    color: "from-purple-500/20 to-pink-500/10 text-[#A855F7] border-purple-500/30",
    rules: [
      { do: "PvP is only allowed in designated PvP arenas or with mutual consent between both parties." },
      { do: "Return gear if accidental death occurs outside consensual PvP zones." },
      { dont: "No spawn killing, combat logging, or trapping players in Nether portals." },
      { dont: "No using illegal mechanics to force PvP on peaceful players." },
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Allowed Mods & Cheating Policy",
    color: "from-[#FB7185]/20 to-red-500/10 text-[#FB7185] border-[#FB7185]/30",
    rules: [
      { do: "Allowed Client Mods: Litematica, MiniHUD, Sodium, Iris, Fullbright, AppleSkin, JourneyMap (fair-play mode)." },
      { dont: "Strictly Forbidden: X-Ray texture packs, Baritone, Auto-Clickers / Macros for PvP, Fly, Speed, KillAura, or hacked clients (Meteor, Aristois, etc.)." },
      { dont: "No exploiting game-breaking duplication glitches (TNT and carpet dupers may be allowed with staff consent)." },
    ],
  },
];

export default function ServerRulesPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-b from-[#111726]/90 to-[#070A12] p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3A47] border border-[#155E75] text-[#4CADD0] text-xs font-semibold uppercase font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Guidelines & Policies
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          TheySix Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CADD0] to-[#FBBF24]">Rules</span>
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
          To ensure an enjoyable, fair, and lag-free survival experience for everyone, all members must abide by the rules outlined below.
        </p>
      </div>

      {/* Rules Sections */}
      <div className="space-y-8">
        {ruleSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-hairline space-y-6 shadow-lg"
            >
              <div className="flex items-center gap-3.5 border-b border-hairline pb-4">
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${section.color} border shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-ink tracking-tight">
                  {section.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.rules.map((item, rIdx) => (
                  <div
                    key={rIdx}
                    className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                      item.do
                        ? "bg-[#4CAF50]/10 border-[#4CAF50]/40 text-ink"
                        : "bg-[#FB7185]/10 border-[#FF3B3B]/40 text-ink"
                    }`}
                  >
                    {item.do ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
                    )}
                    <span>{item.do || item.dont}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Appeal & Staff Support Box */}
      <div className="glass-panel p-8 rounded-3xl border border-hairline bg-gradient-to-r from-bg-elev via-bg-elev to-[#070A12] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold text-ink flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-5 h-5 text-[#4CADD0]" /> Have Questions or Need to Report a Rule Breaker?
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted">
            Open a support ticket on our official Discord server. Our staff team is available 24/7.
          </p>
        </div>

        <a
          href="https://discord.gg/theysix"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-ink font-bold text-sm transition-all shadow-md shadow-[#5865F2]/20 shrink-0"
        >
          <MessageSquare className="w-4 h-4 fill-current" /> Open Discord Ticket
        </a>
      </div>
    </div>
  );
}
