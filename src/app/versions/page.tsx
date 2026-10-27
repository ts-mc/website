import type { Metadata } from "next";
import { VersionSearch } from "@/components/VersionSearch";
import { getAllVersions, getVersion } from "@/lib/versions";

export const metadata: Metadata = {
  title: "Versions | THEYSIX",
  robots: { index: false, follow: false },
};

export default function VersionsPage() {
  const versions = getAllVersions();
  const dates = versions.flatMap(({ version }) => {
    const record = getVersion(version);
    return record?.date ? [record.date] : [];
  });

  return (
    <div className="reference-chapter min-h-screen">
      <p className="reference-index">THEYSIX / VERSIONS</p>
      <h1 className="mt-6 text-5xl text-ink sm:text-7xl">Release history.</h1>
      <p className="reference-lede">Every versioned release of the site, searchable by version or date.</p>
      <VersionSearch versions={versions.map((v) => v.version)} dates={Array.from(new Set(dates))} />
      <div className="mt-12 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {versions.map(({ version }) => {
          const record = getVersion(version);
          if (!record) return null;
          return (
            <article key={version} className="py-7">
              <p className="reference-index">v{version} / {record.date}</p>
              <h2 className="mt-3 !text-lg text-ink sm:!text-xl">
                <a href={`/versions/${version}`} className="transition-colors hover:text-[var(--portal)]">{record.title}</a>
              </h2>
              {record.summary ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{record.summary}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a href={`/versions/${version}`} className="border border-[var(--rule)] px-3 py-1.5 text-[var(--ink)] hover:border-[var(--portal)]">View on site</a>
                <a href={`/versions/${version}/readme`} className="border border-[var(--rule)] px-3 py-1.5 text-[var(--ink)] hover:border-[var(--portal)]">README (GitHub)</a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
