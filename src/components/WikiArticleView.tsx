import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Box, Calendar, Code2, MessageSquare } from "lucide-react";
import { JavaBrandIcon } from "@/components/JavaBrandIcon";
import type { WikiArticle, WikiBodyBlock } from "@/types/wiki";

export function WikiArticleView({ article }: { article: WikiArticle }) {
  const isJava = article.edition === "java";
  const isDiscord = article.edition === "discord";
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <Link href="/wiki" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Wiki
      </Link>

      <header className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wide border ${isJava ? "bg-[#9fff99]/10 text-[#9fff99] border-[#9fff99]/30" : isDiscord ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" : "bg-white/10 text-slate-100 border-white/20"}`}>
          {isJava ? <JavaBrandIcon size={14} /> : isDiscord ? <MessageSquare className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
          {isDiscord ? "TheySix Discord" : `Minecraft ${isJava ? "Java" : "Bedrock"}`}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{article.title}</h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{article.summary}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated {article.lastUpdated}</span>
          {article.tags?.map((tag) => <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">#{tag}</span>)}
        </div>
      </header>

      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-10">
        <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-extrabold prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-white">
          {article.body.map((block, index) => <WikiBlockView key={`${block.type}-${index}`} block={block} />)}
        </div>
      </div>
    </article>
  );
}

function WikiBlockView({ block }: { block: WikiBodyBlock }) {
  if (block.type === "heading") {
    return block.level === 2
      ? <h2 className="mt-10 mb-4 text-2xl font-extrabold text-white first:mt-0">{block.text}</h2>
      : <h3 className="mt-8 mb-3 text-xl font-bold text-white">{block.text}</h3>;
  }
  if (block.type === "paragraph") return <p className="my-5 text-slate-300 leading-7">{renderInlineText(block.text)}</p>;
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return <List className={`my-5 space-y-2 pl-6 text-slate-300 leading-7 ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item) => <li key={item}>{renderInlineText(item)}</li>)}</List>;
  }
  if (block.type === "ruleList") {
    return <ol className="not-prose my-7 grid gap-3 sm:grid-cols-2">{block.items.map((item, index) => <li key={item.title} className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-5 pl-16"><span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-bold font-mono text-cyan-300 border border-cyan-500/20">{index + 1}</span><h3 className="text-base font-bold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p></li>)}</ol>;
  }
  if (block.type === "code") {
    return <div className="not-prose my-6 overflow-hidden rounded-xl border border-slate-700 bg-slate-950"><div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2 text-xs font-mono text-slate-500"><Code2 className="w-3.5 h-3.5" />{block.language ?? "text"}</div><pre className="overflow-x-auto p-4 text-sm text-cyan-100"><code>{block.code}</code></pre></div>;
  }
  if (block.type === "video") {
    const youtubeId = block.src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/)?.[1];
    return <figure className="not-prose my-7">{youtubeId ? <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} title={block.title} className="aspect-video w-full rounded-2xl border border-slate-800 bg-black" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <video controls preload="metadata" className="w-full rounded-2xl border border-slate-800 bg-black" title={block.title}><source src={block.src} type="video/mp4" />Your browser does not support embedded video.</video>}<figcaption className="mt-2 text-center text-xs text-slate-500">{block.caption ?? block.title}</figcaption></figure>;
  }
  if (block.type === "link") {
    return <a href={block.href} target="_blank" rel="noopener noreferrer" className="not-prose my-3 block rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-colors hover:border-cyan-500/50 hover:bg-slate-900"><span className="font-semibold text-cyan-300">{block.label}</span>{block.description && <span className="mt-1 block text-sm text-slate-400">{block.description}</span>}<span className="mt-2 block break-all text-xs text-slate-500">{block.href}</span></a>;
  }
  return <figure className="my-6"><Image src={block.src} alt={block.alt} width={1200} height={675} className="rounded-2xl border border-slate-800" /><figcaption className="mt-2 text-center text-xs text-slate-500">{block.caption}</figcaption></figure>;
}

function renderInlineText(text: string) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (!match) return <span key={`${part}-${index}`}>{part}</span>;
    return <a key={`${match[1]}-${index}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">{match[1]}</a>;
  });
}