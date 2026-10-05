import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Crown, MessageSquare, Shield, Sparkles, Wrench } from "lucide-react";
import { ACTIVE_STAFF, FALLBACK_STAFF_AVATAR } from "@/data/staff";

export const metadata: Metadata = {
  title: "Server Staff & Leadership Team | TheySix",
  description: "Meet the founders, developers, redstone architects, and moderators behind the TheySix Minecraft community.",
};

function getDepartmentBadge(department: string) {
  if (department === "Leadership") {
    return {
      badgeColor: "bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40",
      icon: Crown,
    };
  }

  if (department === "Development") {
    return {
      badgeColor: "bg-[#4CADD0]/20 text-[#9FEBF6] border-[#4CADD0]/40",
      icon: Wrench,
    };
  }

  return {
    badgeColor: "bg-[#A855F7]/20 text-[#A5A5FC] border-[#A855F7]/40",
    icon: Sparkles,
  };
}

export default function ServerStaffPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-b from-[#111726]/90 to-[#070A12] p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3A47] border border-[#155E75] text-[#4CADD0] text-xs font-semibold uppercase font-mono">
          <Crown className="w-3.5 h-3.5" /> Leadership & Staff
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CADD0] via-[#2DD4BF] to-[#FBBF24]">Staff Team</span>
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
          The people keeping events, moderation, technical systems, and support running smoothly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACTIVE_STAFF.map((member) => {
          const { icon: BadgeIcon, badgeColor } = getDepartmentBadge(member.department);
          return (
            <div
              key={member.id}
              className="glass-panel p-6 rounded-3xl border border-hairline space-y-5 flex flex-col justify-between hover:border-hairline transition-all shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-hairline bg-[#070A12] shadow-md">
                    <Image
                      src={member.avatarPath ?? FALLBACK_STAFF_AVATAR}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">{member.name}</h3>
                    <p className="text-xs text-ink-muted font-mono">
                      IGN: <span className="text-ink font-semibold">{member.ign}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono border ${badgeColor}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {member.role}
                  </span>
                </div>

                <p className="text-xs text-ink leading-relaxed">{member.bio}</p>
              </div>

              <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs text-ink-muted">
                <span className="font-mono text-ink-muted">Discord: {member.discordTag}</span>
                <Link
                  href={`/staff/${member.id}`}
                  className="text-[#4CADD0] hover:text-[#9FEBF6]"
                  title="View detailed staff profile"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-hairline text-center space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-ink">Explore Full Staff Profiles</h3>
        <p className="text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
          Open the full staff directory for expertise tags, retired staff, and individual profile pages.
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            href="/staff"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4CADD0] hover:bg-[#4CADD0] text-slate-950 font-bold text-sm transition-all shadow-md"
          >
            <Shield className="w-4 h-4" /> Open Staff Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
