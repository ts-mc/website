import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiArticleView } from "@/components/WikiArticleView";
import { getAllWikiArticles, getWikiArticleByEditionAndSlug } from "@/data/wiki/articles";

interface WikiArticlePageProps {
  params: { edition: string; "article-slug": string };
}

export function generateStaticParams() {
  return getAllWikiArticles().map((article) => ({ edition: article.edition, "article-slug": article.slug }));
}

export async function generateMetadata({ params }: WikiArticlePageProps): Promise<Metadata> {
  const article = getWikiArticleByEditionAndSlug(params.edition, params["article-slug"]);
  if (!article) return { title: "Wiki Article Not Found | TheySix" };
  return {
    title: `${article.title} | TheySix Minecraft Wiki`,
    description: article.summary,
    alternates: { canonical: `/wiki/${article.edition}/${article.slug}` },
    openGraph: { title: article.title, description: article.summary, type: "article", publishedTime: article.lastUpdated, modifiedTime: article.lastUpdated },
  };
}

export default function WikiArticlePage({ params }: WikiArticlePageProps) {
  const article = getWikiArticleByEditionAndSlug(params.edition, params["article-slug"]);
  if (!article) notFound();
  return <WikiArticleView article={article} />;
}