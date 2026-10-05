import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Youtube, MessageSquare, Shield, FileText, Cookie, ExternalLink } from "lucide-react";

const DISCORD_URL = "https://discord.gg/theysix";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-[#070A12]/70 text-ink-muted mt-20">
      <div className="shell py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-9 h-9 overflow-hidden rounded-lg border border-hairline bg-surface">
                <Image src="/logo.gif" alt="TheySix" fill className="object-cover" unoptimized />
              </div>
              <span className="flex items-baseline gap-2">
                <span className="font-extrabold text-lg tracking-[-0.03em] text-ink">TheySix</span>
                <span className="label-mono rounded-pill bg-[#0E3A47] px-2 py-[3px] text-brand-hi">Farms</span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed">
              Your primary hub for high-efficiency Minecraft Java &amp; Bedrock farm schematics, world downloads, and video tutorials.
            </p>
            <a
              href="mailto:theysixyt.business@gmail.com"
              className="tap-target break-all font-mono text-xs font-bold text-brand transition-colors hover:text-brand-hi"
            >
              theysixyt.business@gmail.com
            </a>
            <div className="flex items-center gap-3 pt-2 text-ink-muted">
              <a
                href="https://www.youtube.com/@TheySix"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Java"
                className="p-2 rounded-control bg-bg-elev hover:bg-white/5 hover:text-rose transition-colors border border-hairline"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="p-2 rounded-control bg-bg-elev hover:bg-white/5 hover:text-blurple-text transition-colors border border-hairline"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile + Tablet Accordions */}
          <div className="lg:hidden space-y-3">
            <details className="group rounded-card border border-hairline bg-[#111726]/60 p-4">
              <summary className="label-mono cursor-pointer list-none text-ink flex items-center justify-between">
                <span>Farms &amp; Community</span>
                <span className="text-ink-dim transition-transform group-open:rotate-180">▾</span>
              </summary>
              <ul className="space-y-2 text-sm mt-3">
                <li><Link href="/?category=java" className="tap-target hover:text-lime transition-colors">Java Edition Farms</Link></li>
                <li><Link href="/?category=bedrock" className="tap-target hover:text-ink transition-colors">Bedrock Edition Farms</Link></li>
                <li><Link href="/about" className="tap-target hover:text-brand transition-colors">About &amp; Contact</Link></li>
                <li><Link href="/server/about" className="tap-target hover:text-amber transition-colors">Minecraft Server</Link></li>
              </ul>
            </details>

            <details className="group rounded-card border border-hairline bg-[#111726]/60 p-4">
              <summary className="label-mono cursor-pointer list-none text-ink flex items-center justify-between">
                <span>Socials</span>
                <span className="text-ink-dim transition-transform group-open:rotate-180">▾</span>
              </summary>
              <ul className="space-y-2 text-sm mt-3">
                <li>
                  <a href="https://www.youtube.com/@TheySix" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-rose transition-colors">
                    <span>YouTube (Java)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@TheySixMC" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-rose transition-colors">
                    <span>YouTube (Bedrock)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@TheySixCreations" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-amber transition-colors">
                    <span>YouTube (Minecraft Builds)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-blurple-text transition-colors">
                    <span>Discord Community</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/TheySixYT" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-sky transition-colors">
                    <span>X (Twitter)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/theysixyt/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-magenta transition-colors">
                    <span>Instagram</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              </ul>
            </details>
          </div>

          {/* Editions & Navigation */}
          <div className="hidden lg:block space-y-3">
            <h2 className="label-mono text-ink-muted">Farms &amp; Community</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=java" className="tap-target hover:text-lime transition-colors">Java Edition Farms</Link></li>
              <li><Link href="/?category=bedrock" className="tap-target hover:text-ink transition-colors">Bedrock Edition Farms</Link></li>
              <li><Link href="/about" className="tap-target hover:text-brand transition-colors">About &amp; Contact</Link></li>
              <li><Link href="/server/about" className="tap-target hover:text-amber transition-colors">Minecraft Server</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h2 className="label-mono text-ink-muted">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cookies" className="flex items-center gap-1.5 tap-target hover:text-ink transition-colors">
                  <Cookie className="w-3.5 h-3.5" /> Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/tos" className="flex items-center gap-1.5 tap-target hover:text-ink transition-colors">
                  <FileText className="w-3.5 h-3.5" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center gap-1.5 tap-target hover:text-ink transition-colors">
                  <Shield className="w-3.5 h-3.5" /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div className="hidden lg:block space-y-3">
            <h2 className="label-mono text-ink-muted">TheySix Socials</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.youtube.com/@TheySix" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-rose transition-colors">
                  <span>YouTube (Java)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@TheySixMC" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-rose transition-colors">
                  <span>YouTube (Bedrock)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@TheySixCreations" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-amber transition-colors">
                  <span>YouTube (Minecraft Builds)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-blurple-text transition-colors">
                  <span>Discord Community</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://x.com/TheySixYT" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-sky transition-colors">
                  <span>X (Twitter)</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/theysixyt/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between tap-target hover:text-magenta transition-colors">
                  <span>Instagram</span><ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} TheySix. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl text-ink-muted">
            NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
          </p>
        </div>
      </div>
    </footer>
  );
}
