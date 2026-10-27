"use client";

import { useState } from "react";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { editionLabels, type WikiArticle, type WikiEdition } from "@/types/wiki";

const editions: WikiEdition[] = ["java", "bedrock", "discord"];

export function WikiSidebar({
  articles: articlesProp,
  currentEdition,
  currentSlug,
}: {
  articles: WikiArticle[];
  currentEdition: WikiEdition;
  currentSlug?: string;
}) {
  const [filter, setFilter] = useState("");
  const [openEditions, setOpenEditions] = useState<Record<string, boolean>>(() => ({
    [currentEdition]: true,
  }));

  const toggle = (edition: WikiEdition) =>
    setOpenEditions((prev) => ({ ...prev, [edition]: !prev[edition] }));

  return (
    <nav aria-label="Wiki navigation" className="text-sm">
      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-dim"
          aria-hidden
        />
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter articles…"
          aria-label="Filter articles"
          className="w-full rounded-control border border-hairline bg-bg-elev py-1.5 pl-8 pr-10 text-[13px] text-ink placeholder:text-ink-dim focus:border-brand"
        />
        <kbd className="label-mono pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-control border border-hairline bg-bg-base px-1.5 py-0.5 text-ink-dim">
          ⌘K
        </kbd>
      </div>

      <ul className="space-y-1">
        {editions.map((edition) => {
          const isOpen = openEditions[edition] ?? false;
          const query = filter.trim().toLowerCase();
          const articles = articlesProp.filter((a) => a.edition === edition);
          const visible = query
            ? articles.filter(
              (article) =>
                article.title.toLowerCase().includes(query) ||
                (article.tags ?? []).some((tag) => tag.toLowerCase().includes(query)),
            )
            : articles;
          if (query && visible.length === 0) return null;

          return (
            <li key={edition}>
              <button
                type="button"
                onClick={() => toggle(edition)}
                aria-expanded={isOpen}
                className="flex min-h-9 w-full items-center justify-between rounded-md px-2 py-1.5 text-left font-semibold text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <span className="label-mono">{editionLabels[edition]}</span>
                <ChevronDown
                  className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <ul className="mt-0.5 space-y-0.5 border-l border-hairline pl-1">
                  {visible.map((article) => {
                    const active = edition === currentEdition && article.slug === currentSlug;
                    return (
                      <li key={`${edition}-${article.slug}`}>
                        <Link
                          href={`/wiki/${edition}/${article.slug}`}
                          aria-current={active ? "page" : undefined}
                          className={`relative flex min-h-9 items-center rounded-md px-3 py-1.5 leading-5 transition-colors hover:bg-white/5 ${active
                              ? "bg-[#4CADD0]/10 text-[#B2F9FF]"
                              : "text-ink-muted hover:text-ink"
                            }`}
                        >
                          {active && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--brand)]"
                            />
                          )}
                          <span className="truncate">{article.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
