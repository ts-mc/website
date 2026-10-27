import Link from "next/link";
import { LogSearch } from "@/components/LogSearch";
import { getLogs } from "@/lib/updates";

export const metadata = { title: "Logs | THEYSIX" };

export default function LogsPage() {
  const logs = getLogs();
  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / LOGS</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">Latest from the development team.</h1>
      <p className="reference-lede">A dated record of archive changes, maintenance, and releases.</p>
      <LogSearch dates={Array.from(new Set(logs.map((entry) => entry.date)))} />
      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {logs.map((entry) => (
            <article key={`${entry.date}-${entry.title}`} className="py-7">
              <p className="reference-index">{entry.date} {entry.type ? `/ ${entry.type}` : ""}</p>
              <h2 className="mt-3 !text-lg text-ink sm:!text-xl"><Link href={`/logs/${entry.date}`} className="transition-colors hover:text-[var(--portal)]">{entry.title}</Link></h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entry.summary}</p>
              {entry.description ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{entry.description}</p> : null}
            </article>
          ))}
      </div>
    </div>
  );
}
