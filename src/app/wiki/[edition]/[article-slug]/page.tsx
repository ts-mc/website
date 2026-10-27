import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, PencilLine } from "lucide-react";
import { WikiLayout, EditionBadge } from "@/components/wiki/WikiLayout";
import { WikiRenderer } from "@/components/wiki/WikiRenderer";
import { PrevNext } from "@/components/wiki/PrevNext";
import {
  getAllWikiArticles,
  getWikiArticleByEditionAndSlug,
} from "@/data/wiki/articles";
import { editionLabels, type WikiEdition } from "@/types/wiki";

interface WikiArticlePageProps {
  params: { edition: string; "article-slug": string };
}

export function generateStaticParams() {
  return getAllWikiArticles().map((article) => ({
    edition: article.edition,
    "article-slug": article.slug,
  }));
}

export async function generateMetadata({ params }: WikiArticlePageProps): Promise<Metadata> {
  const article = getWikiArticleByEditionAndSlug(params.edition, params["article-slug"]);
  if (!article) return { title: "Wiki Article Not Found | TheySix" };
  return {
    title: `${article.title} | TheySix Wiki`,
    description: article.summary,
    alternates: { canonical: `/wiki/${article.edition}/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
    },
  };
}

export default function WikiArticlePage({ params }: WikiArticlePageProps) {
  const edition = params.edition as WikiEdition;
  const article = getWikiArticleByEditionAndSlug(params.edition, params["article-slug"]);
  if (!article || !(edition in editionLabels)) notFound();

  const sameEdition = getAllWikiArticles().filter((a) => a.edition === article.edition);
  const index = sameEdition.findIndex((a) => a.slug === article.slug);
  const previous = index > 0 ? sameEdition[index - 1] : undefined;
  const next = index < sameEdition.length - 1 ? sameEdition[index + 1] : undefined;

  return (
    <WikiLayout articles={getAllWikiArticles()} currentEdition={edition} article={article}>
      <article className="max-w-[72ch] pb-16">
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <EditionBadge edition={article.edition} />
            {(article.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="label-mono rounded-pill bg-bg-elev px-2 py-[3px] text-ink-dim"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{article.title}</h1>
          <div className="label-mono mt-3 flex flex-wrap items-center gap-4 text-ink-dim">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              Updated{" "}
              <time dateTime={article.lastUpdated}>
                {new Date(article.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            </span>
            <a
              href="https://github.com/ro-mihaiu/ts-website/blob/main/src/data/wiki/articles.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-ink-dim hover:text-brand"
            >
              <PencilLine className="size-3.5" aria-hidden />
              Improve this page
            </a>
          </div>
        </header>

        <WikiRenderer blocks={article.body} />

        <PrevNext previous={previous} next={next} />
      </article>
    </WikiLayout>
  );
}
