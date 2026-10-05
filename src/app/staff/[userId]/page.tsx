import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, Shield } from "lucide-react";
import {
  getPublicStaffAvatarPath,
  PUBLIC_STAFF_PROFILES,
  getPublicStaffByUserId,
} from "@/data/staff-directory";

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
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/staff" className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to all staff
      </Link>

      <section className="rounded-3xl border border-hairline bg-gradient-to-b from-bg-elev to-[#070A12] p-7 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-hairline bg-[#070A12]">
            <Image
              src={getPublicStaffAvatarPath(staff.userId)}
              alt={staff.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-ink tracking-tight">{staff.name}</h1>
            <p className="text-sm text-[#9FEBF6] font-semibold">{staff.headline}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-ink">{staff.bio}</p>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Best At</h2>
          <div className="flex flex-wrap gap-2">
            {staff.bestAt.map((topic) => (
              <span
                key={topic}
                className="rounded-lg border border-hairline bg-bg-elev px-3 py-1.5 text-xs font-mono text-ink"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-hairline pt-4">
          <p className="text-xs font-mono text-ink-muted">Discord: {staff.discordTag}</p>
          <a
            href="https://discord.gg/theysix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-sm font-semibold text-ink hover:bg-[#4752C4]"
          >
            <MessageSquare className="h-4 w-4 fill-current" /> Open Discord
          </a>
        </div>
      </section>

      {/* <section className="rounded-2xl border border-hairline bg-[#111726]/50 p-5 text-sm text-ink-muted">
        <p>
          Profile image fallback is <strong className="text-ink">/public/pfp/--.png</strong>. You can replace each staff image manually in <strong className="text-ink">/public/pfp</strong> or wire authenticated Discord avatars later.
        </p>
      </section> */}

      <div className="flex flex-wrap gap-2">
        <Link href="/staff/retired" className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-2 text-sm font-semibold text-ink hover:bg-[#111726]/60">
          <Shield className="h-4 w-4" /> View Retired Staff
        </Link>
        <Link href="/staff/report" className="inline-flex items-center gap-2 rounded-xl border border-red-700/70 px-4 py-2 text-sm font-semibold text-[#FF3B3B] hover:bg-[#FF3B3B]/20">
          Report a Staff Issue
        </Link>
      </div>
    </div>
  );
}
