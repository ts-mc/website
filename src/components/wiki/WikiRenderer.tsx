import Link from "next/link";
import Image from "next/image";
import { ExternalLink, PlayCircle } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import type { WikiBodyBlock } from "@/types/wiki";

/*
 * Inline `[markdown](url)` links appear inside paragraph and list text, so
 * every text-bearing block runs through this tiny parser before rendering.
 */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          return (
            <a
              key={index}
              href={match[2]}
              target={match[2].startsWith("http") ? "_blank" : undefined}
              rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
            >
              {match[1]}
            </a>
          );
        }
        return <>{part}</>;
      })}
    </>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function WikiRenderer({ blocks }: { blocks: WikiBodyBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const id = slugify(block.text);
            const Tag = block.level === 2 ? "h2" : "h3";
            return (
              <div key={index} className="group pt-4">
                <Tag
                  id={id}
                  className={
                    block.level === 2
                      ? "scroll-mt-24 border-b border-hairline pb-2 text-xl font-bold tracking-tight text-ink"
                      : "scroll-mt-24 text-base font-bold tracking-tight text-ink"
                  }
                >
                  <a href={`#${id}`} className="no-underline">
                    {block.text}
                    <span
                      aria-hidden
                      className="ml-2 text-brand opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      #
                    </span>
                  </a>
                </Tag>
              </div>
            );
          }
          case "paragraph":
            return (
              <p key={index} className="text-[15.5px] leading-7 text-ink-muted">
                <InlineText text={block.text} />
              </p>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`space-y-1.5 pl-6 text-[15.5px] leading-7 text-ink-muted ${block.ordered ? "list-decimal" : "list-disc"
                  } marker:text-ink-dim`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }
          case "ruleList":
            return (
              <dl key={index} className="space-y-4">
                {block.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <dt className="text-[15.5px] font-bold text-ink">{item.title}</dt>
                    <dd className="mt-1 text-[15.5px] leading-7 text-ink-muted">
                      <InlineText text={item.text} />
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case "code":
            return <CodeBlock key={index} code={block.code} language={block.language} />;
          case "image":
            return (
              <figure key={index} className="my-6">
                <div className="overflow-hidden rounded-card border border-hairline bg-bg-elev">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    width={960}
                    height={540}
                    className="h-auto w-full"
                    unoptimized
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-ink-dim">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "video": {
            const id = block.src.match(
              /(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/,
            )?.[1];
            return (
              <figure key={index} className="my-6">
                {id ? (
                  <div className="overflow-hidden rounded-card border border-hairline">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}`}
                      title={block.title}
                      loading="lazy"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </div>
                ) : (
                  <a
                    href={block.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-6 items-center gap-2 text-[15.5px] text-brand hover:underline"
                  >
                    <PlayCircle className="size-4" aria-hidden />
                    {block.title}
                  </a>
                )}
                {block.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-ink-dim">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          }
          case "link":
            return (
              <a
                key={index}
                href={block.href}
                target={block.href.startsWith("http") ? "_blank" : undefined}
                rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group my-6 flex items-start gap-3 rounded-card border border-hairline bg-bg-elev px-4 py-3 transition-colors hover:border-hairline-hover hover:bg-surface-hover"
              >
                <ExternalLink className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block text-[15.5px] font-semibold text-ink group-hover:text-brand-hi">
                    {block.label}
                  </span>
                  {block.description ? (
                    <span className="mt-0.5 block text-sm leading-6 text-ink-muted">
                      {block.description}
                    </span>
                  ) : null}
                </span>
              </a>
            );
          case "callout":
            return (
              <Callout key={index} variant={block.variant}>
                <InlineText text={block.text} />
              </Callout>
            );
          case "table":
            return (
              <div
                key={index}
                className="my-6 overflow-x-auto rounded-card border border-hairline"
              >
                <table className="w-full border-collapse text-left text-[14.5px]">
                  <thead>
                    <tr className="bg-bg-elev">
                      {block.head.map((cell, cellIndex) => (
                        <th
                          key={cellIndex}
                          scope="col"
                          className="label-mono border-b border-hairline px-4 py-2.5 text-ink-muted"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? "bg-white/[0.02]" : ""}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border-b border-hairline px-4 py-2.5 align-top leading-6 text-ink-muted last:border-b-0"
                          >
                            <InlineText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export { slugify as wikiSlugify };
