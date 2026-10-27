import { WikiSidebar } from "./WikiSidebar";
import { EditionSwitcher } from "./EditionSwitcher";
import { WikiToc } from "./WikiToc";
import type { WikiArticle, WikiBodyBlock, WikiEdition } from "@/types/wiki";
import { editionLabels } from "@/types/wiki";

function wikiSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(article: WikiArticle) {
  return article.body
    .filter((block): block is Extract<WikiBodyBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: wikiSlugify(block.text), text: block.text, level: block.level }));
}

const editionPill: Record<WikiEdition, string> = {
  java: "bg-[#0E3A47] text-brand-hi",
  bedrock: "bg-bg-elev text-ink-muted",
  discord: "bg-[#5865F2]/15 text-[#96A0FA]",
};

export function EditionBadge({ edition }: { edition: WikiEdition }) {
  return (
    <span className={`label-mono rounded-pill px-2 py-[3px] ${editionPill[edition]}`}>
      {editionLabels[edition]}
    </span>
  );
}

/*
 * Shared shell for both wiki routes. The page-specific content (article body,
 * docs home index) is passed in as children. Sidebar rail ≥ lg, TOC rail ≥ xl,
 * single column with disclosures below that.
 */
export function WikiLayout({
  articles,
  currentEdition,
  article,
  children,
}: {
  articles: WikiArticle[];
  currentEdition?: WikiEdition;
  article?: WikiArticle;
  children: React.ReactNode;
}) {
  void articles; // (articles are passed through to the sidebar below)
  const headings = article ? extractHeadings(article) : [];
  const sidebar = (
    <WikiSidebar
      articles={articles}
      currentEdition={currentEdition ?? "java"}
      currentSlug={article?.slug}
    />
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
      {/* Breadcrumb row */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-4">
        <a href="/wiki" className="label-mono text-ink-dim hover:text-ink">
          Wiki
        </a>
        {currentEdition ? (
          <>
            <span className="label-mono text-ink-dim" aria-hidden>/</span>
            <a
              href={`/wiki/${currentEdition}`}
              className="label-mono text-ink-dim hover:text-ink"
            >
              {editionLabels[currentEdition]}
            </a>
            {article ? (
              <>
                <span className="label-mono text-ink-dim" aria-hidden>/</span>
                <span className="label-mono text-ink-muted">{article.title}</span>
              </>
            ) : null}
          </>
        ) : null}
      </nav>

      <div className="flex items-start gap-8">
        {/* Sidebar — static rail ≥1024px, disclosure below */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-[calc(var(--nav-height)+24px)] max-h-[calc(100vh-var(--nav-height)-32px)] overflow-y-auto pb-8">
            <div className="mb-4">
              <EditionSwitcher currentEdition={currentEdition ?? "java"} currentSlug={article?.slug} />
            </div>
            {sidebar}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <details className="mb-6 lg:hidden">
            <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center rounded-control border border-hairline bg-bg-elev px-4 text-ink-muted">
              Browse wiki navigation
            </summary>
            <div className="mt-3 rounded-card border border-hairline bg-bg-elev/50 p-4">
              <div className="mb-4">
                <EditionSwitcher currentEdition={currentEdition ?? "java"} currentSlug={article?.slug} />
              </div>
              {sidebar}
            </div>
          </details>

          {children}
        </div>

        {/* Right TOC rail, hidden below 1280px */}
        {article && headings.length > 0 ? (
          <aside className="hidden w-[220px] shrink-0 xl:block">
            <div className="sticky top-[calc(var(--nav-height)+24px)] max-h-[calc(100vh-var(--nav-height)-32px)] overflow-y-auto pb-8">
              <WikiToc headings={headings} />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export { wikiSlugify };
