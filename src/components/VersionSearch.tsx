"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type VersionSearchProps = { versions: string[]; dates: string[] };

export function VersionSearch({ versions, dates }: VersionSearchProps) {
  const router = useRouter();
  const versionSet = useMemo(() => new Set(versions), [versions]);
  const dateSet = useMemo(() => new Set(dates), [dates]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim().replace(/^v/i, "");
    if (!value) return;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      if (!dateSet.has(value)) {
        setError(`No version was released on ${value}.`);
        return;
      }
      setError("");
      router.push(`/versions?date=${value}`);
      return;
    }

    if (!versionSet.has(value)) {
      setError(`Version ${value} does not exist.`);
      return;
    }
    setError("");
    router.push(`/versions/${value}`);
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-xl" role="search">
      <label htmlFor="version-search" className="reference-index block">Search by version or release date</label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="version-search"
          type="text"
          placeholder="1.0.0 or 2026-10-27"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setError(""); }}
          className="min-h-12 min-w-0 flex-1 border border-[var(--edge)] bg-[var(--raised)] px-4 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          aria-describedby={error ? "version-search-error" : undefined}
        />
        <button type="submit" className="min-h-12 border border-[var(--portal)] px-5 text-sm font-bold text-[var(--portal)] transition-colors hover:bg-[rgba(153,225,217,.14)]">Search</button>
      </div>
      {error ? <p id="version-search-error" className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}
