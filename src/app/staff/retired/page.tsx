import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { getPublicStaffAvatarPath, RETIRED_PUBLIC_STAFF } from "@/data/staff-directory";

export const metadata: Metadata = {
  title: "Retired Staff | TheySix",
  description: "See former staff members who helped shape the TheySix community.",
};

export default function RetiredStaffPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Link href="/staff" className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to active staff
      </Link>

      <div className="rounded-3xl border border-hairline bg-gradient-to-b from-bg-elev to-[#070A12] p-8 sm:p-10 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Retired Staff</h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-ink-muted">
          Former team members who contributed to moderation, technical growth, and community events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RETIRED_PUBLIC_STAFF.map((member) => (
          <article
            key={member.userId}
            className="glass-panel rounded-3xl border border-hairline p-6 shadow-lg transition-all hover:border-hairline"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-hairline bg-[#070A12]">
                  <Image
                    src={getPublicStaffAvatarPath(member.userId)}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ink">{member.name}</h2>
                  <p className="text-xs font-mono text-ink-muted">{member.headline}</p>
                </div>
              </div>

              <p className="text-sm text-ink leading-relaxed">{member.bio}</p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-3 text-xs text-ink-muted">
              <span className="font-mono">{member.discordTag}</span>
              <Link href={`/staff/${member.userId}`} className="text-[#4CADD0] transition-colors hover:text-[#9FEBF6]" title="Open detailed staff profile">
                <MessageSquare className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
