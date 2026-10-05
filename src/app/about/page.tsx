import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Mail, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About TheySix | Minecraft Farm Database",
  description: "Learn about TheySix, a free Minecraft Java and Bedrock farm database, and find official contact details.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-hairline space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E3A47] text-[#4CADD0] text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" /> The TheySix story
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">A practical vault for Minecraft farms</h1>
        <p className="text-base text-ink leading-relaxed">
          TheySix brings farm tutorials, Litematica schematics, world saves, and build references into one searchable place for Java and Bedrock players. The goal is simple: make technical Minecraft projects easier to understand, verify, and build in your own world.
        </p>
        <p className="text-sm text-ink-muted leading-relaxed">
          This is a free community resource. Files are offered as-is for personal, educational, and non-commercial Minecraft use. Always check the farm&apos;s edition and version notes before building.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="glass-panel p-6 rounded-2xl border border-hairline space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#4CAF50]" />
          <h2 className="text-lg font-bold text-ink">Our guarantee</h2>
          <p className="text-sm text-ink-muted leading-relaxed">We aim to publish clear, useful resources and test farm information where possible, but Minecraft updates can change mechanics. No specific output rate or compatibility result is guaranteed.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-hairline space-y-3">
          <MessageSquare className="w-6 h-6 text-[#4CADD0]" />
          <h2 className="text-lg font-bold text-ink">Support and availability</h2>
          <p className="text-sm text-ink-muted leading-relaxed">There is no paid service or checkout on this site. For important issues, contact the team through the official Discord. Community response times vary.</p>
          <a href="https://discord.ro-mihaiu.xyz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CADD0] hover:text-[#9FEBF6]">Contact on Discord</a>
        </div>
      </section>

      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-hairline space-y-4">
        <h2 className="text-xl font-bold text-ink">Contact TheySix</h2>
        <a href="mailto:theysixyt.business@gmail.com" className="inline-flex items-center gap-2 text-sm text-[#4CADD0] hover:text-[#9FEBF6]"><Mail className="w-4 h-4" /> theysixyt.business@gmail.com</a>
        <p className="text-sm text-ink-muted">Use email for business inquiries and the official Discord for important site or download issues. See the <Link href="/socials" className="text-[#4CADD0] hover:underline">Socials page</Link> for every official channel.</p>
      </section>
    </div>
  );
}