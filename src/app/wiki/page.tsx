import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { WikiLayout, EditionBadge } from "@/components/wiki/WikiLayout";
import { getAllWikiArticles } from "@/data/wiki/articles";
import { editionLabels, type WikiEdition } from "@/types/wiki";

export const metadata: Metadata = {
  title: "Wiki | TheySix",
  description:
    "Practical Java, Bedrock, and TheySix Discord guides for Minecraft players and farm builders.",
  alternates: { canonical: "/wiki" },
};

const editions: WikiEdition[] = ["java", "bedrock", "discord"];

export default function WikiHomePage() {
  const articles = getAllWikiArticles();

  return (
    <WikiLayout articles={articles}>
      <article className="max-w-[72ch] pb-16">
        <header className="mb-10">
          <p className="label-mono mb-3 flex items-center gap-2 text-ink-dim">
            <BookOpen className="size-3.5" aria-hidden /> TheySix Knowledge Base
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            TheySix Wiki
          </h1>
          <p className="mt-3 text-[15.5px] leading-7 text-ink-muted">
            Clear explainers for Minecraft mechanics, Bedrock tutorials, farm support, and
            the TheySix Discord community. Pick an edition below or browse the full index.
          </p>
        </header>

        <section aria-label="Getting started" className="mb-10">
          <h2 className="mb-3 border-b border-hairline pb-2 text-xl font-bold text-ink">
            Getting started
          </h2>
          <ul className="space-y-1.5 text-[15.5px] leading-7 text-ink-muted">
            <li>
              New to farm building? Start with{" "}
              <Link
                href="/wiki/java/mob-spawning-mechanics"
                className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
              >
                Mob Spawning Mechanics
              </Link>{" "}
              for the Java fundamentals.
            </li>
            <li>
              On Bedrock, read{" "}
              <Link
                href="/wiki/bedrock/mob-spawning-in-bedrock-edition"
                className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
              >
                Mob Spawning in Bedrock Edition
              </Link>{" "}
              — Bedrock spawning is not a copy of Java&apos;s.
            </li>
            <li>
              Looking for a farm file?{" "}
              <Link
                href="/wiki/discord/discord-faq-and-farm-downloads"
                className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
              >
                Discord FAQ and Farm Downloads
              </Link>{" "}
              explains the /dn command and archive channels.
            </li>
          </ul>
        </section>

        {editions.map((edition) => {
          const list = articles.filter((article) => article.edition === edition);
          return (
            <section key={edition} aria-label={editionLabels[edition]} className="mb-10">
              <div className="mb-3 flex items-center justify-between border-b border-hairline pb-2">
                <h2 className="text-xl font-bold text-ink">{editionLabels[edition]}</h2>
                <EditionBadge edition={edition} />
              </div>
              <ul className="divide-y divide-hairline">
                {list.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/wiki/${edition}/${article.slug}`}
                      className="group flex min-h-11 flex-col justify-center gap-1 py-3"
                    >
                      <span className="font-semibold text-ink group-hover:text-brand-hi">
                        {article.title}
                      </span>
                      <span className="text-sm leading-6 text-ink-muted">
                        {article.summary}
                      </span>
                      <span className="label-mono mt-0.5 flex flex-wrap gap-2 text-ink-dim">
                        {(article.tags ?? []).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </article>
    </WikiLayout>
  );
}
