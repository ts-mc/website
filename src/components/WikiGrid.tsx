"use client";

import { useMemo, useState } from "react";
import { BookOpen, Box, MessageSquare, Search, X } from "lucide-react";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
import { WikiCard } from "@/components/WikiCard";
import type { WikiArticle, WikiEdition } from "@/types/wiki";

interface WikiGridProps {
  articles: WikiArticle[];
}

export function WikiGrid({ articles }: WikiGridProps) {
  const [selectedEdition, setSelectedEdition] = useState<"all" | WikiEdition>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      if (selectedEdition !== "all" && article.edition !== selectedEdition) return false;
      if (!query) return true;
      return [article.title, article.summary, ...(article.tags ?? [])].some((value) => value.toLowerCase().includes(query));
    });
  }, [articles, searchQuery, selectedEdition]);

  const javaArticles = filteredArticles.filter((article) => article.edition === "java");
  const bedrockArticles = filteredArticles.filter((article) => article.edition === "bedrock");
  const discordArticles = filteredArticles.filter((article) => article.edition === "discord");

  return (
    <div className="space-y-8">
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search wiki articles by title, topic, or tag..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all shadow-inner"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setSelectedEdition("all")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedEdition === "all" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"}`}>
              All Editions <span className="ml-1.5 px-1.5 rounded bg-black/30 font-mono">{articles.length}</span>
            </button>
            <button onClick={() => setSelectedEdition("java")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selectedEdition === "java" ? "bg-[#9fff99] text-slate-950 shadow-lg shadow-[#9fff99]/25" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"}`}>
              <JavaBrandIcon size={14} /> Java <span className="px-1.5 rounded bg-black/30 font-mono">{articles.filter((article) => article.edition === "java").length}</span>
            </button>
            <button onClick={() => setSelectedEdition("bedrock")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selectedEdition === "bedrock" ? "bg-slate-100 text-slate-950 shadow-lg shadow-white/20" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"}`}>
              <Box className="w-3.5 h-3.5" /> Bedrock <span className="px-1.5 rounded bg-black/30 font-mono">{articles.filter((article) => article.edition === "bedrock").length}</span>
            </button>
            <button onClick={() => setSelectedEdition("discord")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selectedEdition === "discord" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"}`}>
              <MessageSquare className="w-3.5 h-3.5" /> Discord <span className="px-1.5 rounded bg-black/30 font-mono">{articles.filter((article) => article.edition === "discord").length}</span>
            </button>
          </div>
          <div className="text-xs text-slate-400 font-mono">Showing <span className="text-white font-semibold">{filteredArticles.length}</span> articles</div>
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="space-y-10">
          {javaArticles.length > 0 && (
            <EditionSection edition="java" articles={javaArticles} />
          )}
          {bedrockArticles.length > 0 && (
            <EditionSection edition="bedrock" articles={bedrockArticles} />
          )}
          {discordArticles.length > 0 && (
            <EditionSection edition="discord" articles={discordArticles} />
          )}
        </div>
      ) : (
        <div className="glass-panel text-center py-16 px-6 rounded-3xl border border-slate-800 space-y-4">
          <Search className="w-8 h-8 mx-auto text-slate-500" />
          <h2 className="text-xl font-bold text-white">No articles found</h2>
          <p className="text-sm text-slate-400">Try a different search term or edition.</p>
        </div>
      )}
    </div>
  );
}

function EditionSection({ edition, articles }: { edition: WikiEdition; articles: WikiArticle[] }) {
  const isJava = edition === "java";
  const isDiscord = edition === "discord";
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        {isJava ? <JavaBrandIcon size={20} /> : isDiscord ? <MessageSquare className="w-5 h-5 text-cyan-300" /> : <Box className="w-5 h-5 text-slate-200" />}
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{isJava ? "Java Edition" : isDiscord ? "Discord Community" : "Bedrock Edition"}</h2>
        <span className="text-xs font-mono text-slate-500">{articles.length} articles</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => <WikiCard key={article.slug} article={article} />)}
      </div>
    </section>
  );
}