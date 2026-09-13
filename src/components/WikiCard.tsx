import Link from "next/link";
import { ArrowUpRight, BookOpen, Box, MessageSquare } from "lucide-react";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
import type { WikiArticle } from "@/types/wiki";

interface WikiCardProps {
  article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
  const isJava = article.edition === "java";
  const isDiscord = article.edition === "discord";
  const articleUrl = `/wiki/${article.edition}/${article.slug}`;

  return (
    <article className="group glass-panel rounded-2xl border border-slate-800/80 hover:border-slate-700 bg-slate-900/60 p-5 flex flex-col min-h-[250px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase font-mono border ${isJava ? "bg-[#9fff99]/10 text-[#9fff99] border-[#9fff99]/30" : isDiscord ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" : "bg-white/10 text-slate-100 border-white/20"}`}>
          {isJava ? <JavaBrandIcon size={12} /> : isDiscord ? <MessageSquare className="w-3 h-3" /> : <Box className="w-3 h-3" />}
          {isJava ? "Java" : isDiscord ? "Discord" : "Bedrock"}
        </span>
        <BookOpen className="w-5 h-5 text-cyan-400" />
      </div>

      <div className="mt-5 flex-1">
        <Link href={articleUrl} className="group-hover:text-cyan-300 transition-colors">
          <h3 className="text-xl font-bold text-white leading-tight group-hover:underline">{article.title}</h3>
        </Link>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">{article.summary}</p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Updated {article.lastUpdated}</span>
        <Link href={articleUrl} className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold">
          Read article <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}