import { readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { RolesDirectory } from "@/components/RolesDirectory";

export const metadata: Metadata = {
  title: "Community Roles | TheySix",
  description: "Explore the staff, special, community, and level roles in the TheySix Minecraft community.",
  alternates: { canonical: "/roles" },
};

export default function RolesPage() {
  return (
    <div className="shell max-w-4xl space-y-8 py-8 sm:py-12">
      <header className="glass-panel space-y-4 rounded-3xl border border-hairline p-7 sm:p-10">
        <p className="eyebrow">Community · Roles</p>
        <h1 className="text-4xl font-black tracking-tight text-ink sm:text-6xl">The role ladder</h1>
        <p className="max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
          From the team that keeps TheySix running to community milestones earned in game, here are the roles you can find around the server.
        </p>
      </header>

      <RolesDirectory icons={readdirSync(path.join(process.cwd(), "public", "roles")).filter((file) => file.endsWith(".png"))} />
    </div>
  );
}
