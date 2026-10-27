import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { getPublicStaffAvatarPath, RETIRED_PUBLIC_STAFF, PUBLIC_STAFF_FALLBACK_AVATAR } from "@/data/staff-directory";
import { StaffAvatar } from "@/components/StaffAvatar";

export const metadata: Metadata = {
  title: "Retired Staff | TheySix",
  description: "See former staff members who helped shape the TheySix community.",
};

export default function RetiredStaffPage() {
  return (
    <div className="reference-chapter min-h-screen">
      <Link href="/staff" className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--portal)]">
        <ArrowLeft className="size-4" /> Back to active staff
      </Link>

      <p className="reference-index mt-12">THEYSIX / STAFF / RETIRED</p>
      <h1 className="mt-6 text-5xl text-[var(--ink)] sm:text-7xl">
        Former team,<br />
        <em className="not-italic text-[var(--portal)]">still remembered.</em>
      </h1>
      <p className="reference-lede">
        Past members who contributed to moderation, technical growth, and community events.
      </p>

      {RETIRED_PUBLIC_STAFF.length ? (
        <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Retired staff roster">
          {RETIRED_PUBLIC_STAFF.map((member) => (
            <article
              key={member.userId}
              className="rounded-2xl border border-[var(--rule)] bg-[var(--raised)] p-6 shadow-lg transition-colors duration-300 hover:border-[var(--portal)]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--void)]">
                    <StaffAvatar
                      src={getPublicStaffAvatarPath(member.userId)}
                      fallbackSrc={PUBLIC_STAFF_FALLBACK_AVATAR}
                      alt={member.name}
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="!text-base text-[var(--ink)]">{member.name}</h2>
                    <p className="mt-1 truncate font-mono text-xs text-[var(--muted)]">{member.headline}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--muted)]">{member.bio}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--rule)] pt-3 text-xs text-[var(--muted)]">
                <span className="font-mono">{member.discordTag}</span>
                <Link href={`/staff/${member.userId}`} className="text-[var(--portal)] transition-colors hover:text-[var(--portal-hover)]" title="Open detailed staff profile">
                  <MessageSquare className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border border-[var(--rule)] bg-[var(--raised)] p-6">
          <h2 className="!text-xl text-[var(--ink)]">No retired profiles are recorded</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Every listed team profile is currently active. This page is ready when the roster changes.
          </p>
        </section>
      )}
    </div>
  );
}
