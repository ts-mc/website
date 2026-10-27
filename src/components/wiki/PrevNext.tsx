import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { WikiArticle } from "@/types/wiki";

export function PrevNext({
  previous,
  next,
}: {
  previous?: WikiArticle;
  next?: WikiArticle;
}) {
  return (
    <nav aria-label="Article pagination" className="mt-12 grid gap-4 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/wiki/${previous.edition}/${previous.slug}`}
          className="glass flex min-h-11 flex-col justify-center gap-1 rounded-card px-4 py-3 text-left transition-colors hover:bg-surface-hover"
        >
          <span className="label-mono flex items-center gap-1.5 text-ink-dim">
            <ArrowLeft className="size-3.5" aria-hidden /> Previous
          </span>
          <span className="font-semibold leading-6 text-ink group-hover:text-brand-hi">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <Link
          href={`/wiki/${next.edition}/${next.slug}`}
          className="glass flex min-h-11 flex-col justify-center gap-1 rounded-card px-4 py-3 text-right transition-colors hover:bg-surface-hover sm:col-start-2"
        >
          <span className="label-mono flex items-center justify-end gap-1.5 text-ink-dim">
            Next <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="font-semibold leading-6 text-ink">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
