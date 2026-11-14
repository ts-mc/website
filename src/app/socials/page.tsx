import type { Metadata } from "next";
import Image from "next/image";
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
  tone: string;
  preview: string;
  logo?: string;
};

const socials: Social[] = [
  { name: "YouTube — TheySix", handle: "@TheySix", url: "https://www.youtube.com/@TheySix", description: "Technical Minecraft farm tutorials, high-yield designs, and the mechanics behind them.", label: "YouTube / Main", icon: Youtube, tone: "youtube", preview: "Farm designs · Technical tutorials · Shorts", logo: "/brand/yt-theysix.jpg" },
  { name: "YouTube — TheySixMC", handle: "@TheySixMC", url: "https://www.youtube.com/@TheySixMC", description: "More TheySix Minecraft videos, farms, and community builds.", label: "YouTube / MC", icon: Youtube, tone: "youtube", preview: "Minecraft · Farms · Community", logo: "/brand/yt-theysixmc.png" },
  { name: "YouTube — TheySixCreations", handle: "@TheySixCreations", url: "https://www.youtube.com/@TheySixCreations", description: "Minecraft builds, creative structures, timelapses, and world design showcases.", label: "YouTube / Creations", icon: Youtube, tone: "youtube", preview: "Build showcases · Timelapses · Worlds", logo: "/brand/yt-theysixcreations.png" },
  { name: "YouTube — TheySixMinecraftJava", handle: "@TheySixMinecraftJava", url: "https://www.youtube.com/@TheySixMinecraftJava", description: "TheySix Minecraft Java Edition uploads and farm content.", label: "YouTube / Java", icon: Youtube, tone: "youtube", preview: "Java Edition · Farms · Tutorials", logo: "/brand/yt-theysix.jpg" },
  { name: "YouTube — TheySixBedrock", handle: "@TheySixBedrock", url: "https://www.youtube.com/@TheySixBedrock", description: "TheySix Minecraft Bedrock Edition uploads and farm content.", label: "YouTube / Bedrock", icon: Youtube, tone: "youtube", preview: "Bedrock Edition · MCPE · Farms", logo: "/brand/yt-theysixmc.png" },
  { name: "Discord Community", handle: "discord.gg/theysix", url: "https://discord.gg/theysix", description: "Get farm help, find schematic downloads, join giveaways, and meet the community.", label: "Discord / Community", icon: MessageSquare, tone: "discord", preview: "Support · Downloads · Community events", logo: "/brand/dc-theysix.gif" },
  { name: "TikTok — Java Edition", handle: "@theysixcreations", url: "https://www.tiktok.com/@theysixcreations", description: "Fast Java farm tips, redstone tricks, and build highlights in short form.", label: "TikTok / Java", icon: Tv, tone: "tiktok", preview: "Quick farm tips · Redstone · Builds", logo: "/brand/yt-theysixcreations.png" },
  { name: "TikTok — Bedrock Edition", handle: "@theysixmc", url: "https://www.tiktok.com/@theysixmc", description: "Quick Bedrock tutorials, bug workarounds, and MCPE survival tips.", label: "TikTok / Bedrock", icon: Tv, tone: "tiktok", preview: "Bedrock tips · MCPE · Survival", logo: "/brand/yt-theysixmc.png" },
  { name: "Instagram", handle: "@theysixyt", url: "https://www.instagram.com/theysixyt/", description: "Behind the scenes, farm screenshots, releases, and community updates.", label: "Instagram / Gallery", icon: Instagram, tone: "instagram", preview: "Screenshots · Stories · Updates", logo: "/brand/ig-theysixyt.jpg" },
  { name: "X / Twitter", handle: "@TheySixYT", url: "https://x.com/TheySixYT", description: "New videos, snapshot coverage, news, and ongoing Minecraft discussions.", label: "X / Updates", icon: Twitter, tone: "x", preview: "Announcements · New releases · News", logo: "/brand/yt-theysix.jpg" },
  { name: "Business Inquiries", handle: "theysixyt.business@gmail.com", url: "mailto:theysixyt.business@gmail.com", description: "For sponsorships, collaborations, partnerships, and official business contact.", label: "Direct / Contact", icon: Mail, tone: "mail", preview: "Sponsorships · Collaborations · Partnerships", logo: "/brand/gmail-theysix.png" },
  { name: "Website & Server Bug Reports", handle: "dev@theysix.tech", url: "mailto:dev@theysix.tech", description: "Report visual bugs with the website, Minecraft server, or schematic previews.", label: "Direct / Bug reports", icon: Mail, tone: "mail", preview: "Website · Minecraft server · Schematics", logo: "/brand/gmail-theysix.png" },
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
          <p className="eyebrow">Directory / {String(socials.length).padStart(2, "0")}</p>
            <h2 id="channel-list" className="mt-2 text-2xl text-[var(--ink)] sm:text-3xl">Official destinations</h2>
          </div>
          <p className="hidden text-right text-xs leading-relaxed text-[var(--muted)] sm:block">External links open in a new tab.</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {socials.map((social, index) => {
            const Icon = social.icon;
            const external = !social.url.startsWith("mailto:");

            return (
              <li key={social.name} className={`group overflow-hidden border border-[var(--rule)] bg-[#10110f] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--edge)] hover:bg-[#151612] ${socials.length % 2 === 1 && index === socials.length - 1 ? "sm:col-span-2 xl:col-span-1" : ""}`}>
                <a
                  href={social.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex h-full min-h-[270px] flex-col p-4 focus-visible:bg-white/[.03] sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="label-mono text-[var(--muted)]">{String(index + 1).padStart(2, "0")} / {social.label}</span>
                    <span className={`relative grid size-9 place-items-center overflow-hidden rounded-lg border ${social.tone === "youtube" ? "border-red-500/20 bg-red-500/10 text-red-400" : social.tone === "discord" ? "border-indigo-400/20 bg-indigo-400/10 text-indigo-300" : social.tone === "instagram" ? "border-pink-400/20 bg-pink-400/10 text-pink-300" : social.tone === "tiktok" ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : social.tone === "x" ? "border-white/15 bg-white/5 text-white" : "border-[var(--portal)]/20 bg-[var(--portal)]/10 text-[var(--portal)]"}`}>{social.logo ? <Image src={social.logo} alt="" fill sizes="36px" className="object-cover" /> : <Icon className="size-4" aria-hidden="true" />}</span>
                  </div>
                  <div className={`relative flex min-h-[92px] items-end overflow-hidden border border-white/[.04] p-3 ${social.tone === "youtube" ? "bg-[linear-gradient(115deg,#351414,#171110_60%,#11110f)]" : social.tone === "discord" ? "bg-[linear-gradient(115deg,#242648,#151621_62%,#11110f)]" : social.tone === "instagram" ? "bg-[linear-gradient(115deg,#42242f,#20171f_52%,#11110f)]" : social.tone === "tiktok" ? "bg-[linear-gradient(115deg,#163036,#15191d_56%,#11110f)]" : social.tone === "x" ? "bg-[linear-gradient(115deg,#262626,#151515_56%,#11110f)]" : "bg-[linear-gradient(115deg,#1c3432,#151b19_56%,#11110f)]"}`}>
                    {social.logo ? <Image src={social.logo} alt="" width={88} height={88} className="absolute -right-2 -top-2 size-[88px] rounded-lg object-cover opacity-30" /> : <Icon className="absolute -right-2 -top-3 size-24 opacity-[.09]" aria-hidden="true" />}
                    <div className="relative"><span className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-white/50">Official channel</span><p className="mt-1 text-xs font-semibold text-white/90">{social.preview}</p></div>
                  </div>
                  <div className="mt-4 flex flex-1 flex-col">
                    <h3 className="text-lg font-bold leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--ink-bright)]">{social.name}</h3>
                    <p className="mt-1 font-mono text-xs text-[var(--portal)]">{social.handle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{social.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--ink)]">{external ? "Open channel" : "Send an email"} <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
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
