import type { Metadata } from "next";
import {
  ExternalLink,
  Instagram,
  Mail,
  MessageSquare,
  Share2,
  Tv,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Official Socials & Channels | TheySix",
  description: "Connect with TheySix across YouTube, Discord, TikTok, Instagram, X (Twitter), and business email.",
};

type Social = {
  name: string;
  handle: string;
  url: string;
  description: string;
  label: string;
  icon: LucideIcon;
};

const socials: Social[] = [
  { name: "YouTube — Java Edition", handle: "@TheySix", url: "https://www.youtube.com/@TheySix", description: "Technical Java tutorials, high-yield farm designs, and the mechanics behind them.", label: "Java Edition", icon: Youtube },
  { name: "YouTube — Bedrock Edition", handle: "@TheySixMC", url: "https://www.youtube.com/@TheySixMC", description: "Bedrock farms, trident killers, portal ticking, and mobile or console mechanics.", label: "Bedrock Edition", icon: Youtube },
  { name: "YouTube — Minecraft Builds", handle: "@TheySixCreations", url: "https://www.youtube.com/@TheySixCreations", description: "Mega-builds, creative farm structures, timelapses, and world design showcases.", label: "Minecraft Builds", icon: Youtube },
  { name: "Discord Community", handle: "discord.gg/theysix", url: "https://discord.gg/theysix", description: "Get farm help, find schematic downloads, join giveaways, and meet the community.", label: "Community Hub", icon: MessageSquare },
  { name: "TikTok — Java Edition", handle: "@theysixcreations", url: "https://www.tiktok.com/@theysixcreations", description: "Fast Java farm tips, redstone tricks, and build highlights in short form.", label: "TikTok Java", icon: Tv },
  { name: "TikTok — Bedrock Edition", handle: "@theysixmc", url: "https://www.tiktok.com/@theysixmc", description: "Quick Bedrock tutorials, bug workarounds, and MCPE survival tips.", label: "TikTok Bedrock", icon: Tv },
  { name: "Instagram", handle: "@theysixyt", url: "https://www.instagram.com/theysixyt/", description: "Behind the scenes, farm screenshots, releases, and community updates.", label: "Photos & Stories", icon: Instagram },
  { name: "X / Twitter", handle: "@TheySixYT", url: "https://x.com/TheySixYT", description: "New videos, snapshot coverage, news, and ongoing Minecraft discussions.", label: "Announcements", icon: Twitter },
  { name: "Business Inquiries", handle: "theysixyt.business@gmail.com", url: "mailto:theysixyt.business@gmail.com", description: "For sponsorships, collaborations, partnerships, and official business contact.", label: "Contact", icon: Mail },
];

export default function SocialsPage() {
  return (
    <main className="shell pb-40 pt-16 sm:pt-24">
      <header className="relative overflow-hidden border-y border-[var(--rule)] py-10 sm:py-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_35%,rgba(153,225,217,.16),transparent_42%)]" />
        <div className="eyebrow flex items-center gap-2"><Share2 className="size-3.5" aria-hidden="true" /> Official channels</div>
        <h1 className="mt-5 max-w-3xl text-5xl text-[var(--ink-bright)] sm:text-7xl">Find the right signal.</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">Every official TheySix channel in one place—tutorials, builds, community support, and updates without the noise.</p>
      </header>

      <section aria-labelledby="channel-list" className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--rule)] pb-4">
          <div>
            <p className="eyebrow">Directory / 09</p>
            <h2 id="channel-list" className="mt-2 text-2xl text-[var(--ink)] sm:text-3xl">Official destinations</h2>
          </div>
          <p className="hidden text-right text-xs leading-relaxed text-[var(--muted)] sm:block">External links open in a new tab.</p>
        </div>

        <ul className="grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((social, index) => {
            const Icon = social.icon;
            const external = !social.url.startsWith("mailto:");

            return (
              <li key={social.name} className={`bg-[var(--void)] ${socials.length % 2 === 1 && index === socials.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <a
                  href={social.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex min-h-64 flex-col p-6 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--portal)_7%,var(--void))] focus-visible:bg-[color-mix(in_srgb,var(--portal)_7%,var(--void))] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="label-mono text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <Icon className="size-5 text-[var(--portal)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <p className="label-mono text-[var(--portal)]">{social.label}</p>
                    <h3 className="mt-3 text-2xl text-[var(--ink)] transition-colors group-hover:text-[var(--ink-bright)]">{social.name}</h3>
                    <p className="mt-2 font-mono text-xs text-[var(--portal)]">{social.handle}</p>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{social.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--ink)]">Visit <ExternalLink className="size-3.5" aria-hidden="true" /></span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
