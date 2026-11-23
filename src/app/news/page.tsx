import { getNews } from "@/lib/updates";
import Link from "next/link";

export const metadata = { title: "News | THEYSIX" };

export default function NewsPage() {
  const news = getNews();
  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / NEWS</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">Important updates & fixes.</h1>
      <p className="reference-lede">New farms, resources, and notes from the TheySix community.</p>
      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {news.map((entry) => (
          <article key={`${entry.date}-${entry.title}`} className="py-7">
            <p className="reference-index">{entry.date}</p>
            <h2 className="mt-3 !text-lg text-ink sm:!text-xl"><Link href={`/news/${entry.date}`} className="transition-colors hover:text-[var(--portal)]">{entry.title}</Link></h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entry.summary}</p>
            <Link href={`/news/${entry.date}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--portal)]">Read update →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
