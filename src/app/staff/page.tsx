import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archive, Flag } from "lucide-react";
import { ACTIVE_PUBLIC_STAFF, PUBLIC_STAFF_FALLBACK_AVATAR, getPublicStaffAvatarPath } from "@/data/staff-directory";
import { StaffAvatar } from "@/components/StaffAvatar";

export const metadata: Metadata = {
  title: "Staff | TheySix",
  description: "The public TheySix community staff directory.",
};

export default function StaffPage() {
  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / STAFF</p>
      <h1 className="mt-6 text-5xl text-[var(--ink)] sm:text-7xl">
        The people<br />
        <em className="not-italic text-[var(--portal)]">behind TheySix.</em>
      </h1>
      <p className="reference-lede">
        {ACTIVE_PUBLIC_STAFF.length} active team members keep the community running. Open any profile for role, strengths, biography, and Discord handle.
      </p>

      <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Active staff roster">
        {ACTIVE_PUBLIC_STAFF.map((member) => (
          <Link
            key={member.userId}
            href={`/staff/${member.userId}`}
            className="group rounded-2xl border border-[var(--rule)] bg-[var(--raised)] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--portal)]"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--void)]">
                <StaffAvatar
                  src={getPublicStaffAvatarPath(member.userId)}
                  fallbackSrc={PUBLIC_STAFF_FALLBACK_AVATAR}
                  alt=""
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-[var(--ink)]">{member.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--portal)]">{member.headline}</p>
                <p className="mt-1 truncate font-mono text-xs text-[var(--muted)]">{member.discordTag}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">{member.bio}</p>
          </Link>
        ))}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/staff/retired" className="inline-flex min-h-11 items-center gap-2 border border-[var(--rule)] px-5 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--portal)] hover:text-[var(--portal)]">
          <Archive className="size-4" /> Retired staff
        </Link>
        <Link href="/staff/report" className="inline-flex min-h-11 items-center gap-2 border border-[var(--rule)] px-5 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--portal)] hover:text-[var(--portal)]">
          <Flag className="size-4" /> Report an issue
        </Link>
      </div>
    </div >
  );
}
