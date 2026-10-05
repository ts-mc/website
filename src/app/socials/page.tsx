import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Youtube,
  MessageSquare,
  Mail,
  Instagram,
  Twitter,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Share2,
  Tv
} from "lucide-react";

export const metadata: Metadata = {
  title: "Official Socials & Channels | TheySix",
  description: "Connect with TheySix across YouTube, Discord, TikTok, Instagram, X (Twitter), and business email.",
};

const socialsData = [
  {
    name: "YouTube (Java Edition)",
    handle: "@TheySix",
    url: "https://www.youtube.com/@TheySix",
    description: "Main channel for Minecraft Java tutorials, high-yield farm designs, and technical mechanics.",
    icon: Youtube,
    color: "from-[#FF3B3B] to-[#FB7185]",
    hoverBg: "hover:border-red-500/50",
    badge: "Java Edition",
    badgeColor: "bg-[#9FFF99]/10 text-[#9FFF99] border-[#9FFF99]/30",
  },
  {
    name: "YouTube (Bedrock Edition)",
    handle: "@TheySixMC",
    url: "https://www.youtube.com/@TheySixMC",
    description: "Dedicated Bedrock Edition channel featuring trident killers, portal ticking, and mobile/console farms.",
    icon: Youtube,
    color: "from-red-500 to-pink-600",
    hoverBg: "hover:border-[#FB7185]/50",
    badge: "Bedrock Edition",
    badgeColor: "bg-white/10 text-ink border-white/20",
  },
  {
    name: "YouTube (Minecraft Builds)",
    handle: "@TheySixCreations",
    url: "https://www.youtube.com/@TheySixCreations",
    description: "Aesthetic Minecraft mega-builds, creative farm structures, timelapse builds, and world design showcases.",
    icon: Youtube,
    color: "from-[#FBBF24] via-[#FF8A3D] to-[#FF3B3B]",
    hoverBg: "hover:border-[#FBBF24]/50",
    badge: "Minecraft Builds",
    badgeColor: "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30",
  },
  {
    name: "Discord Community",
    handle: "discord.gg/theysix",
    url: "https://discord.gg/theysix",
    description: "Join the official TheySix Discord server for farm help, schematic downloads, giveaways, and chat.",
    icon: MessageSquare,
    color: "from-[#5865F2] to-[#4752C4]",
    hoverBg: "hover:border-[#5865F2]/50",
    badge: "Community Hub",
    badgeColor: "bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/40",
  },
  {
    name: "TikTok (Java Edition)",
    handle: "@theysixcreations",
    url: "https://www.tiktok.com/@theysixcreations",
    description: "Short-form Minecraft Java farm tips, redstone quick tricks, and build highlights.",
    icon: Tv,
    color: "from-surface-hover to-bg-elev",
    hoverBg: "hover:border-[#4CADD0]/50",
    badge: "TikTok Java",
    badgeColor: "bg-[#4CADD0]/10 text-[#9FEBF6] border-[#4CADD0]/30",
  },
  {
    name: "TikTok (Bedrock Edition)",
    handle: "@theysixmc",
    url: "https://www.tiktok.com/@theysixmc",
    description: "Quick Bedrock farm tutorials, bug workarounds, and MCPE survival tips.",
    icon: Tv,
    color: "from-surface-hover to-bg-elev",
    hoverBg: "hover:border-[#FB7185]/50",
    badge: "TikTok Bedrock",
    badgeColor: "bg-white/10 text-ink border-white/20",
  },
  {
    name: "Instagram",
    handle: "@theysixyt",
    url: "https://www.instagram.com/theysixyt/",
    description: "Behind the scenes, farm screenshots, release announcements, and updates.",
    icon: Instagram,
    color: "from-[#A855F7] via-[#F472B6] to-[#FF8A3D]",
    hoverBg: "hover:border-pink-500/50",
    badge: "Photos & Stories",
    badgeColor: "bg-[#F472B6]/10 text-[#F472B6] border-pink-500/30",
  },
  {
    name: "X / Twitter",
    handle: "@TheySixYT",
    url: "https://x.com/TheySixYT",
    description: "Latest news, updates on new videos, Minecraft snapshot coverage, and discussions.",
    icon: Twitter,
    color: "from-[#38BDF8] to-blue-600",
    hoverBg: "hover:border-[#38BDF8]/50",
    badge: "Announcements",
    badgeColor: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30",
  },
  {
    name: "Business Inquiries / Email",
    handle: "theysixyt.business@gmail.com",
    url: "mailto:theysixyt.business@gmail.com",
    description: "For sponsorships, collaborations, partnerships, or official business contact.",
    icon: Mail,
    color: "from-[#2DD4BF] to-[#4CAF50]",
    hoverBg: "hover:border-[#4CAF50]/50",
    badge: "Contact",
    badgeColor: "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30",
  },
];

export default function SocialsPage() {
  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-b from-[#111726]/90 to-[#070A12] p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3A47] border border-[#155E75] text-[#4CADD0] text-xs font-semibold uppercase font-mono">
          <Share2 className="w-3.5 h-3.5" /> Official Channels
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CADD0] to-[#FBBF24]">TheySix</span>
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
          Follow our official media channels, join our growing community of Minecraft builders, and stay updated with new farm blueprints.
        </p>
      </div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialsData.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group glass-panel p-6 sm:p-7 rounded-3xl border border-hairline bg-[#111726]/60 ${social.hoverBg} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${social.color} text-ink shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ink group-hover:text-[#9FEBF6] transition-colors">
                        {social.name}
                      </h3>
                      <p className="text-xs text-ink-muted font-mono mt-0.5">
                        {social.handle}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${social.badgeColor}`}>
                    {social.badge}
                  </span>
                </div>

                <p className="text-sm text-ink leading-relaxed">
                  {social.description}
                </p>
              </div>

              <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs font-semibold text-[#4CADD0] group-hover:text-[#9FEBF6]">
                <span>Visit Channel / Link</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

