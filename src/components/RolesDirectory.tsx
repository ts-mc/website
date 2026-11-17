"use client";

import Link from "next/link";
import { useState } from "react";
import { ACTIVE_PUBLIC_STAFF, RETIRED_PUBLIC_STAFF } from "@/data/staff-directory";
import { LEVEL_ROLES, NON_LEVEL_ROLES, type RoleEntry } from "@/data/roles";
import { LEVEL_LEADERBOARD } from "@/data/level-leaderboard";

const leaderboardUrl = "https://arcane.bot/leaderboard/theysix";

function RoleDetails({ role }: { role: RoleEntry }) {
  const levelMembers = role.level === undefined
    ? []
    : LEVEL_LEADERBOARD.filter((person) => person.level >= role.level!);
  const members = role.directory === "retired"
    ? RETIRED_PUBLIC_STAFF
    : role.directory === "active"
      ? role.staffHeadline === "Staff Team"
        ? ACTIVE_PUBLIC_STAFF
        : ACTIVE_PUBLIC_STAFF.filter((person) => person.headline === role.staffHeadline)
      : [];

  return (
    <details className="group border-b border-[var(--rule)] last:border-b-0">
      <summary className="flex min-h-[3.65rem] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 marker:hidden hover:bg-white/[0.025] sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="h-5 w-[3px] shrink-0 rounded-full" style={{ background: `linear-gradient(${role.gradient[0]}, ${role.gradient[1]})` }} />
          <span className="truncate bg-clip-text text-base font-bold text-transparent sm:text-lg" style={{ backgroundImage: `linear-gradient(100deg, ${role.gradient[0]}, ${role.gradient[1]})` }}>{role.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-ink-muted sm:text-xs">
          {role.level !== undefined ? `${levelMembers.length} member${levelMembers.length === 1 ? "" : "s"}` : members.length > 0 ? `${members.length} member${members.length === 1 ? "" : "s"}` : "Role"}
          <span aria-hidden="true" className="text-sm transition-transform group-open:rotate-180">⌄</span>
        </span>
      </summary>
      <div className="border-t border-[var(--rule)] bg-white/[0.015] px-5 py-4 sm:px-8">
        {role.level !== undefined ? (
          levelMembers.length > 0 ? (
            <ul className="grid gap-1 sm:grid-cols-2">
              {levelMembers.map((person) => {
                const staff = [...ACTIVE_PUBLIC_STAFF, ...RETIRED_PUBLIC_STAFF].find((entry) => entry.discordTag.replace(/^@/, "").toLowerCase() === person.username.toLowerCase());
                return <li key={person.username}>{staff ? <Link href={`/staff/${staff.userId}`} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-white/5 hover:text-[var(--portal)]"><span className="truncate">@{person.username}</span><span className="font-mono text-xs text-ink-muted">Level {person.level} · Staff profile</span></Link> : <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-ink"><span className="truncate">@{person.username}</span><span className="font-mono text-xs text-ink-muted">Level {person.level}</span></div>}</li>;
              })}
            </ul>
          ) : <p className="text-sm text-ink-muted">No players in the supplied leaderboard snapshot meet this threshold.</p>
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
        ) : role.name === "Staff Team" ? (
          <p className="text-sm text-ink-muted">See the <Link className="text-[var(--portal)] hover:underline" href="/staff">active staff directory</Link>.</p>
        ) : (
          <p className="text-sm text-ink-muted">The member list for this role is not published on the site yet.</p>
        )}
      </div>
    </details>
  );
}

export function RolesDirectory() {
  const [levelRolesOpen, setLevelRolesOpen] = useState(false);
  return (
    <>
      <section aria-label="Community roles" className="overflow-hidden rounded-2xl border border-hairline bg-black/40">
        {NON_LEVEL_ROLES.map((role) => <RoleDetails key={role.name} role={role} />)}
        <details className="group border-t border-[var(--rule)]">
          <summary onClick={(event) => { event.preventDefault(); setLevelRolesOpen((open) => !open); }} aria-expanded={levelRolesOpen} className="flex min-h-[3.65rem] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.025] sm:px-5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-3"><span aria-hidden="true" className="h-5 w-[3px] rounded-full bg-[var(--portal)]" /><span className="text-base font-bold text-[var(--portal)] sm:text-lg">Level Roles</span></span>
            <span className="flex items-center gap-3 font-mono text-[10px] text-ink-muted sm:text-xs">{LEVEL_ROLES.length} roles <span aria-hidden="true" className={`text-sm transition-transform ${levelRolesOpen ? "rotate-180" : ""}`}>⌄</span></span>
          </summary>
          {levelRolesOpen && <div className="border-t border-[var(--rule)]"><div className="pl-3 sm:pl-5">{LEVEL_ROLES.map((role) => <RoleDetails key={role.name} role={role} />)}</div></div>}
        </details>
      </section>
      <p className="text-xs leading-6 text-ink-muted">Level role members reflect the leaderboard snapshot you provided. <a href={leaderboardUrl} target="_blank" rel="noreferrer" className="text-[var(--portal)] underline-offset-4 hover:underline">View Arcane leaderboard</a>.</p>
    </>
  );
}
