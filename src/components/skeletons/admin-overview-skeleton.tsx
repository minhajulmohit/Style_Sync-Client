import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverviewSkeleton() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-rose-100/70" />
            <Skeleton className="h-8 w-56 bg-rose-100/70" />
            <Skeleton className="h-4 w-72 bg-rose-100/70" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl bg-rose-100/70" />
        </div>

        {/* 6 Stats Cards Grid */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40"
            >
              <Skeleton className="size-11 rounded-2xl bg-rose-100/70" />
              <Skeleton className="mt-5 h-4 w-28 bg-rose-100/70" />
              <div className="mt-2 flex items-end justify-between">
                <Skeleton className="h-8 w-16 bg-rose-100/70" />
                <Skeleton className="h-3 w-24 bg-rose-100/70" />
              </div>
            </div>
          ))}
        </section>

        {/* Lower Grid: Today's Appointments & Weekly Chart */}
        <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.8fr)]">
          {/* Today's Appointments Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
            <div className="flex items-center justify-between border-b border-rose-50 px-5 py-5 sm:px-6">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44 bg-rose-100/70" />
                <Skeleton className="h-3 w-28 bg-rose-100/70" />
              </div>
              <Skeleton className="h-8 w-20 rounded-xl bg-rose-100/70" />
            </div>
            <div className="divide-y divide-rose-50 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4">
                  <Skeleton className="size-10 rounded-full bg-rose-100/70" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32 bg-rose-100/70" />
                    <Skeleton className="h-3 w-48 bg-rose-100/70" />
                  </div>
                  <Skeleton className="h-4 w-16 bg-rose-100/70" />
                  <Skeleton className="h-6 w-20 rounded-full bg-rose-100/70" />
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Overview Skeleton */}
          <div className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-32 bg-rose-100/70" />
                <Skeleton className="h-3 w-40 bg-rose-100/70" />
              </div>
              <Skeleton className="h-6 w-16 rounded-lg bg-rose-100/70" />
            </div>
            <div className="mt-7 flex h-36 items-end justify-between gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <Skeleton
                    className="w-full max-w-7 rounded-t-lg bg-rose-100/70"
                    style={{ height: `${20 + ((i * 13) % 70)}%` }}
                  />
                  <Skeleton className="h-2 w-5 bg-rose-100/70" />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[#fff7f4] p-4 space-y-2">
              <Skeleton className="h-3 w-28 bg-rose-100/70" />
              <Skeleton className="h-7 w-12 bg-rose-100/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
