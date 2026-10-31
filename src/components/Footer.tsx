import Link from "next/link";

const groups = [
  { label: "Explore", links: [["Wiki home", "https://wiki.theysix.tech"], ["Java articles", "https://wiki.theysix.tech/w/java"], ["Bedrock articles", "https://wiki.theysix.tech/w/bedrock"], ["Discord articles", "https://wiki.theysix.tech/w/discord"]] },
  { label: "Community", links: [["Main", "https://theysix.tech"], ["Events", "https://theysix.tech"], ["About", "https://theysix.tech/about"], ["Socials", "https://theysix.tech/socials"]] },
  { label: "Legal", links: [["Terms of service", "https://wiki.theysix.tech/legal/terms"], ["Privacy", "https://wiki.theysix.tech/legal/privacy"], ["Cookies", "https://wiki.theysix.tech/legal/cookies"], ["Open-source licences", "https://wiki.theysix.tech/legal/open-source"]] },
] as const;

export function Footer() {
  return (
    <footer className="footer-shell">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-4xl font-black tracking-[-.05em] text-ink">THEYSIX</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">Practical Java, Bedrock, and TheySix community resources for Minecraft players and farm builders.</p>
        </div>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="label-mono">{group.label}</p>
              <ul className="mt-3 space-y-1">
                {group.links.map(([label, href]) => <li key={href}><Link href={href} className="flex min-h-11 items-center text-sm transition-colors">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="shell mt-12 grid gap-3 border-t border-[var(--rule)] pt-6 text-xs leading-relaxed text-ink-muted lg:grid-cols-2">
        <p>THEYSIX is not affiliated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios.</p>
        <p className="lg:text-right">Soundtrack playback begins only after you choose sound.</p>
      </div>
    </footer>
  );
}
