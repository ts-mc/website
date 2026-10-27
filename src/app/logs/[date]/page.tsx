import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLogsForDate } from "@/lib/updates";

type LogDayPageProps = {
  params: { date: string };
};

export function generateMetadata({ params }: LogDayPageProps): Metadata {
  return { title: `${params.date} Log | THEYSIX` };
}

export default function LogDayPage({ params }: LogDayPageProps) {
  const entries = getLogsForDate(params.date);
  if (!entries.length) notFound();

  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / LOGS / {params.date}</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">Daily changelog.</h1>
      <p className="reference-lede">Updates published on {params.date}.</p>
      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {entries.map((entry) => (
          <article key={entry.title} className="py-7">
            <p className="reference-index">{entry.type ?? "update"}</p>
            <h2 className="mt-3 text-2xl text-ink">{entry.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entry.summary}</p>
          </article>
        ))}
      </div>
      <Link href="/logs" className="mt-8 inline-flex text-sm font-semibold text-[var(--portal)]">← All logs</Link>
    </div>
  );
}
