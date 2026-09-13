import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { WikiGrid } from "@/components/WikiGrid";
import { getAllWikiArticles } from "@/data/wiki/articles";

export const metadata: Metadata = {
  title: "Minecraft Mechanics Wiki | TheySix",
  description: "Practical Java, Bedrock, and TheySix Discord guides for Minecraft players and farm builders.",
  alternates: { canonical: "/wiki" },
};

export default function WikiPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono"><BookOpen className="w-3.5 h-3.5" /> TheySix Mechanics Wiki</div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">Build with the rules in mind.</h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">Clear explainers for Minecraft mechanics, Bedrock tutorials, farm support, and the TheySix Discord community.</p>
      </header>
      <WikiGrid articles={getAllWikiArticles()} />
    </div>
  );
}