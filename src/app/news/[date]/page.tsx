import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsForDate } from "@/lib/updates";

type NewsDayPageProps = { params: { date: string } };

export function generateMetadata({ params }: NewsDayPageProps): Metadata {
  return { title: `${params.date} News | THEYSIX` };
}

export default function NewsDayPage({ params }: NewsDayPageProps) {
  const entries = getNewsForDate(params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date) || !entries.length) notFound();

  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / NEWS / {params.date}</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">News & announcements.</h1>
      <p className="reference-lede">Updates published on {params.date}.</p>
      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {entries.map((entry, entryIndex) => (
          <article key={`${entry.title}-${entryIndex}`} className="py-7">
            <p className="reference-index">{entry.type ?? "update"}</p>
            <h2 className="mt-3 text-2xl text-ink">{entry.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entry.summary}</p>
            {entry.author && <p className="mt-2 text-sm text-[var(--muted)]">By {entry.author}</p>}
            {entry.image && <Image {...entry.image} alt={entry.image.alt} className="mt-5 h-auto w-full max-w-2xl" />}
            {entry.description && <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entry.description}</p>}
            {entry.body?.map((block, index) => {
              if (block.type === "heading") return <h3 key={index} className="mt-7 text-xl text-ink">{block.text}</h3>;
              if (block.type === "paragraph") return <p key={index} className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{block.text}</p>;
              return <ul key={index} className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-sm leading-7 text-[var(--muted)]">{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>;
            })}
            {entry.links && <ul className="mt-4 flex flex-wrap gap-x-6">
              {entry.links.map((link) => <li key={link.href}><a href={link.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--portal)] underline">{link.label}</a></li>)}
            </ul>}
            {entry.href && <a href={entry.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--portal)]">Open related link →</a>}
          </article>
        ))}
      </div>
      <Link href="/news" className="mt-8 inline-flex text-sm font-semibold text-[var(--portal)]">← All news</Link>
    </div>
  );
}
