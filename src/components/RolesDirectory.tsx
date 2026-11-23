"use client";

import Link from "next/link";
import { ACTIVE_PUBLIC_STAFF, RETIRED_PUBLIC_STAFF } from "@/data/staff-directory";
import { EVENT_ROLES, LEVEL_ROLES, NON_LEVEL_ROLES, type RoleEntry } from "@/data/roles";
import Image from "next/image";

const leaderboardUrl = "https://arcane.bot/leaderboard/theysix";

function RoleDetails({ role, icons }: { role: RoleEntry; icons: string[] }) {
  const filename = role.name.toLowerCase().replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".png";
  const members = role.directory === "retired"
    ? RETIRED_PUBLIC_STAFF
    : role.directory === "active"
      ? role.staffHeadline === "Staff Team"
        ? ACTIVE_PUBLIC_STAFF
        : ACTIVE_PUBLIC_STAFF.filter((person) => person.headline === role.staffHeadline)
      : [];

  return (
    <details id={role.discordId ? `role-${role.discordId}` : undefined} className="group border-b border-[var(--rule)] last:border-b-0">
      <summary className="flex min-h-[3.65rem] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 marker:hidden hover:bg-white/[0.025] sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="h-5 w-[3px] shrink-0 rounded-full" style={{ background: `linear-gradient(${role.gradient[0]}, ${role.gradient[1]})` }} />
          {icons.includes(filename) && <Image src={`/roles/${filename}`} width={28} height={28} alt="" className="size-7 shrink-0 object-contain" />}
          <span className="truncate bg-clip-text text-base font-bold text-transparent sm:text-lg" style={{ backgroundImage: `linear-gradient(100deg, ${role.gradient[0]}, ${role.gradient[1]})` }}>{role.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-ink-muted sm:text-xs">
          {role.level !== undefined ? `Level ${role.level}+` : members.length > 0 ? `${members.length} member${members.length === 1 ? "" : "s"}` : "Role"}
          <span aria-hidden="true" className="text-sm transition-transform group-open:rotate-180">⌄</span>
        </span>
      </summary>
      <div className="border-t border-[var(--rule)] bg-white/[0.015] px-5 py-4 sm:px-8">
        {role.level !== undefined || role.name === "VIP" ? (
          <p className="text-sm text-ink-muted">This role has too many members to list here.</p>
        ) : members.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {members.map((member) => (
              <li key={member.userId}>
                <Link href={`/staff/${member.userId}`} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-white/5 hover:text-[var(--portal)]">
                  <span className="truncate">{member.name}</span><span className="font-mono text-xs text-ink-muted">{member.discordTag}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">The member list for this role is not published on the site yet.</p>
        )}
      </div>
    </details>
  );
}

export function RolesDirectory({ icons }: { icons: string[] }) {
  return (
    <section aria-label="Community roles" className="space-y-4">
      <p className="text-sm text-ink-muted">VIP and level roles have too many members to list here. You can check your level on the <a href={leaderboardUrl} className="text-[var(--portal)] underline">Arcane leaderboard</a>.</p>
      <div className="overflow-hidden rounded-2xl border border-hairline bg-black/40">
        {NON_LEVEL_ROLES.map((role) => <RoleDetails key={role.name} role={role} icons={icons} />)}
        {[
          { name: "Level Roles", roles: LEVEL_ROLES },
          { name: "Custom Event Roles", roles: EVENT_ROLES },
        ].map(({ name, roles }) => (
          <details key={name} className="border-t border-[var(--rule)]">
            <summary className="cursor-pointer px-5 py-4 font-bold text-[var(--portal)]">{name} ({roles.length})</summary>
            <div className="pl-3 sm:pl-5">
              {roles.map((role) => <RoleDetails key={role.name} role={role} icons={icons} />)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
