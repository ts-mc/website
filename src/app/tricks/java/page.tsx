import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Java Tricks | TheySix",
  description: "Useful Minecraft Java tricks and references used by the TheySix community.",
};

export default function JavaTricksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="rounded-3xl border border-hairline bg-gradient-to-b from-bg-elev to-[#070A12] p-8 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#155E75] bg-[#0E3A47] px-3.5 py-1.5 text-xs font-semibold uppercase font-mono text-[#4CADD0]">
          <Lightbulb className="h-3.5 w-3.5" /> Java Tricks
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">Minecraft Java Tricks</h1>
        <p className="text-sm sm:text-base text-ink leading-relaxed">
          Curated trick references for Java Edition. This page is intentionally hidden from navbar/footer and can be shared directly.
        </p>
      </section>

      <section className="rounded-3xl border border-hairline bg-[#111726]/60 p-6 sm:p-7 space-y-4">
        <h2 className="text-xl font-bold text-ink">Featured Trick</h2>
        <p className="text-sm text-ink">
          Source video:
          <a
            href="https://youtu.be/povFs7-MjLQ?si=KaWDcLLOd37GWw62"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 text-[#4CADD0] hover:text-[#9FEBF6]"
          >
            Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>

        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-hairline bg-black">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/povFs7-MjLQ"
            title="Java Trick Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <p className="text-xs text-ink-dim">
        Want more trick entries? Add them and I can wire a data-driven list next. Return to <Link href="/" className="text-ink hover:text-ink">home</Link>.
      </p>
    </div>
  );
}
