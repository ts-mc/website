"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, MessageSquare, Compass, Youtube, Box, Hammer, BookOpen, ChevronDown } from "lucide-react";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";

function JavaLogo({ className }: { className: string }) {
  return <JavaBrandIcon size={20} className={className} />;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileFarmsOpen, setIsMobileFarmsOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const farmLinks = [
    { href: "/?category=java#farms", label: "Java Edition", icon: JavaLogo },
    { href: "/?category=bedrock#farms", label: "Bedrock Edition", icon: Box },
    { href: "/?category=build#farms", label: "Builds", icon: Hammer },
    { href: "/#farms", label: "Both", icon: Compass },
  ];

  const baseLinks = [
    { href: "/socials", label: "Socials", icon: Youtube },
    { href: "/about", label: "About", icon: BookOpen },
  ];
  const socialsLink = baseLinks[0];
  const aboutLink = baseLinks[1];

  const isFarmsActive = pathname === "/";

  // Close the mobile panel on navigation and on Escape.
  useEffect(() => {
    setIsOpen(false);
    setIsMobileFarmsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  const desktopLinkClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-control text-sm font-medium transition-colors duration-200 ${
      active ? "bg-[#4CADD0]/10 text-brand-hi" : "text-ink-muted hover:bg-white/5 hover:text-ink"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-control text-base font-medium transition-colors duration-200 ${
      active ? "bg-[#4CADD0]/10 text-brand-hi" : "text-ink-muted hover:bg-white/5 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 h-[var(--nav-height)] w-full border-b border-hairline bg-[#0B0E14]/85 backdrop-blur-xl">
      <div className="shell flex h-full items-center gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-control" aria-label="TheySix Farms, home">
          <div className="relative size-9 overflow-hidden rounded-lg border border-hairline bg-surface">
            <Image src="/logo.gif" alt="TheySix Logo" fill className="object-cover" unoptimized />
          </div>
          <span className="flex items-baseline gap-2">
            <span className="text-[1.05rem] font-extrabold tracking-[-0.03em] text-ink">TheySix</span>
            <span className="label-mono rounded-pill bg-[#0E3A47] px-2 py-[3px] text-brand-hi">Farms</span>
          </span>
          <span className="hidden md:inline text-xs text-ink-muted font-medium">World &amp; Schematic Vault</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
          <div className="relative group">
            <button
              type="button"
              className={desktopLinkClass(isFarmsActive)}
            >
              <Compass className="w-4 h-4" />
              All Farms
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>

            <div className="pointer-events-none absolute left-0 top-full mt-2 w-56 rounded-card border border-hairline bg-[#0B0E14]/95 p-2 opacity-0 translate-y-1 transition-all duration-200 shadow-xl shadow-black/40 backdrop-blur-xl group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0">
              {farmLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-control text-sm text-ink-muted hover:text-ink hover:bg-white/5 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {baseLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={desktopLinkClass(isActive(link.href))}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Discord Button */}
        <div className="hidden sm:flex items-center gap-2 lg:ml-3">
          <a
            href="https://discord.gg/theysix"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 px-3 py-2 rounded-control text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-[#5865F2]/15 hover:text-ink md:inline-flex"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Discord</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden ml-auto">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-control border border-hairline text-ink transition-colors duration-200 hover:bg-white/5"
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            {isOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute inset-x-0 top-[var(--nav-height)] border-b border-hairline bg-[#0B0E14]/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Primary mobile" className="shell flex flex-col gap-1 py-4">
          <div>
            <button
              type="button"
              onClick={() => setIsMobileFarmsOpen((prev) => !prev)}
              aria-expanded={isMobileFarmsOpen}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-control text-base font-medium transition-colors duration-200 ${
                isFarmsActive ? "bg-[#4CADD0]/10 text-brand-hi" : "text-ink-muted hover:bg-white/5 hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-3">
                <Compass className="w-5 h-5" />
                All Farms
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileFarmsOpen ? "rotate-180" : ""}`} />
            </button>

            {isMobileFarmsOpen && (
              <div className="mt-1 ml-2 border-l border-hairline pl-2">
                {farmLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => {
                        setIsOpen(false);
                        setIsMobileFarmsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-control text-sm font-medium text-ink-muted hover:text-ink hover:bg-white/5 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>


          <Link href={socialsLink.href} aria-current={isActive(socialsLink.href) ? "page" : undefined} className={mobileLinkClass(isActive(socialsLink.href))}>
            <Youtube className="w-5 h-5" />
            {socialsLink.label}
          </Link>

          <Link href={aboutLink.href} aria-current={isActive(aboutLink.href) ? "page" : undefined} className={mobileLinkClass(isActive(aboutLink.href))}>
            <BookOpen className="w-5 h-5" />
            {aboutLink.label}
          </Link>

          <div className="mt-3 border-t border-hairline pt-4">
            <a
              href="https://discord.gg/theysix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 w-full px-4 rounded-control bg-[#5865F2]/15 border border-hairline font-semibold text-ink transition-colors duration-200 hover:bg-[#5865F2]/25"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Join our Discord Server
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
