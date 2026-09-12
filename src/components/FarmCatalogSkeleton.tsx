function SkeletonBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-xl ${className}`} />;
}

export function FarmCatalogSkeleton() {
  return (
    <div className="space-y-12 sm:space-y-16" aria-label="Loading farms" role="status">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-8 sm:p-12 lg:p-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="w-full max-w-2xl space-y-6">
            <SkeletonBlock className="h-7 w-56" />
            <SkeletonBlock className="h-14 w-full max-w-xl sm:h-20" />
            <SkeletonBlock className="h-12 w-full max-w-2xl" />
            <div className="flex flex-wrap gap-3">
              <SkeletonBlock className="h-12 w-32" />
              <SkeletonBlock className="h-12 w-36" />
              <SkeletonBlock className="h-12 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-44 w-44 shrink-0 sm:h-56 sm:w-56" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonBlock key={item} className="h-5 w-32" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <SkeletonBlock className="h-9 w-80 max-w-full" />
          <SkeletonBlock className="h-5 w-full max-w-lg" />
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <SkeletonBlock className="h-12 flex-1" />
            <SkeletonBlock className="h-12 w-full md:w-40" />
            <SkeletonBlock className="h-12 w-full md:w-44" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
              <SkeletonBlock className="aspect-video rounded-none" />
              <div className="space-y-4 p-5">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-10 w-full" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-5 w-20" />
                  <SkeletonBlock className="h-5 w-24" />
                </div>
                <SkeletonBlock className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}