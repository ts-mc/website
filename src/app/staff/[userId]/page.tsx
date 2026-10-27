import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, Shield } from "lucide-react";
import {
  getPublicStaffAvatarPath,
  PUBLIC_STAFF_PROFILES,
  PUBLIC_STAFF_FALLBACK_AVATAR,
  getPublicStaffByUserId,
} from "@/data/staff-directory";
import { StaffAvatar } from "@/components/StaffAvatar";

interface StaffDetailPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: StaffDetailPageProps): Promise<Metadata> {
  const { userId } = await params;
  const staff = getPublicStaffByUserId(userId);

  if (!staff) {
    return {
      title: "Staff Profile Not Found | TheySix",
    };
  }

  return {
    title: `${staff.name} | Staff Profile | TheySix`,
    description: `Learn more about ${staff.name}, ${staff.headline} at TheySix.`,
  };
}

export function generateStaticParams() {
  return PUBLIC_STAFF_PROFILES.map((staff) => ({ userId: staff.userId }));
}

export default async function StaffDetailPage({ params }: StaffDetailPageProps) {
  const { userId } = await params;
  const staff = getPublicStaffByUserId(userId);

  if (!staff) {
    notFound();
  }

  return (
    <div className="reference-chapter min-h-screen">
      <Link href="/staff" className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--portal)]">
        <ArrowLeft className="size-4" /> Back to all staff
      </Link>

      <section className="mt-12 rounded-2xl border border-[var(--rule)] bg-[var(--raised)] p-7 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-[var(--rule)] bg-[var(--void)]">
            <StaffAvatar
              src={getPublicStaffAvatarPath(staff.userId)}
              fallbackSrc={PUBLIC_STAFF_FALLBACK_AVATAR}
              alt={staff.name}
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">{staff.name}</h1>
            <p className="text-sm font-semibold text-[var(--portal)]">{staff.headline}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">{staff.bio}</p>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Best At</h2>
          <div className="flex flex-wrap gap-2">
            {staff.bestAt.map((topic) => (
              <span
                key={topic}
                className="rounded-lg border border-[var(--rule)] bg-[var(--panel)] px-3 py-1.5 text-xs font-mono text-[var(--ink)]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[var(--rule)] pt-4">
          <p className="font-mono text-xs text-[var(--muted)]">Discord: {staff.discordTag}</p>
          <a
            href="https://discord.gg/theysix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4752C4]"
          >
            <MessageSquare className="size-4 fill-current" /> Open Discord
          </a>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/staff/retired" className="inline-flex items-center gap-2 rounded-xl border border-[var(--rule)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--portal)]">
          <Shield className="size-4" /> View Retired Staff
        </Link>
        <Link href="/staff/report" className="inline-flex items-center gap-2 rounded-xl border border-[var(--danger)]/70 px-4 py-2 text-sm font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/20">
          Report a Staff Issue
        </Link>
      </div>
    </div>
  );
}
