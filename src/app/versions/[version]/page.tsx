import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVersion } from "@/lib/versions";

type VersionDetailPageProps = {
  params: Promise<{ version: string }>;
};

export async function generateMetadata({ params }: VersionDetailPageProps): Promise<Metadata> {
  const { version } = await params;
  return { title: `v${version} | Versions | THEYSIX`, robots: { index: false, follow: false } };
}

export default async function VersionDetailPage({ params }: VersionDetailPageProps) {
  const { version } = await params;
  const record = getVersion(version);
  if (!record) notFound();

  const typeColor: Record<string, string> = {
    added: "text-[#4CAF50]",
    fixed: "text-[#4CADD0]",
    changed: "text-[#F5A623]",
    removed: "text-[#FB7185]",
  };

  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / VERSIONS / {record.version}</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">{record.title}</h1>
      <p className="reference-lede">Version {record.version} — released {record.date}.</p>
      {record.summary ? <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{record.summary}</p> : null}

      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {record.changes.map((change, index) => (
          <div key={index} className="flex items-start gap-4 py-4">
            <span className={`shrink-0 font-mono text-xs font-bold uppercase ${typeColor[change.type.toLowerCase()] ?? "text-[var(--muted)]"}`}>{change.type}</span>
            <p className="text-sm leading-7 text-[var(--muted)]">{change.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/versions" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--portal)]">← All versions</Link>
        <a href={`/versions/${record.version}/readme`} className="inline-flex min-h-11 items-center border border-[var(--rule)] px-4 text-sm font-semibold text-[var(--ink)] hover:border-[var(--portal)]">README (GitHub)</a>
      </div>
    </div>
  );
}
