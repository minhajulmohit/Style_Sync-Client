import { Skeleton } from "@/components/ui/skeleton";

export function BrowseServicesSkeleton() {
  return (
    <main className="min-h-screen bg-[#fffaf8]">
      {/* Hero Search Section Skeleton */}
      <section className="bg-linear-to-br from-rose-50 via-[#fffaf8] to-purple-50 px-4 pb-10 pt-12 sm:px-7 sm:pb-14 sm:pt-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Skeleton className="mx-auto h-7 w-48 rounded-full bg-rose-100/70" />
            <Skeleton className="mx-auto h-12 w-80 bg-rose-100/70" />
            <Skeleton className="mx-auto h-4 max-w-xl bg-rose-100/70" />
          </div>

          {/* Search Box Skeleton */}
          <div className="mx-auto mt-9 max-w-5xl rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-rose-100/50 backdrop-blur space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl bg-rose-100/70" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 bg-rose-100/70" />
              <Skeleton className="h-10 w-36 rounded-xl bg-rose-100/70" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full bg-rose-100/70" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Skeleton */}
      <section className="px-4 pb-16 pt-9 sm:px-7 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-between">
            <Skeleton className="h-8 w-48 bg-rose-100/70" />
            <Skeleton className="h-4 w-28 bg-rose-100/70" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-3 shadow-sm shadow-rose-100/40"
              >
                <Skeleton className="aspect-16/10 rounded-xl bg-rose-100/70" />
                <div className="space-y-3 p-2 pt-5">
                  <Skeleton className="h-5 w-3/5 bg-rose-100/70" />
                  <Skeleton className="h-4 w-full bg-rose-100/70" />
                  <Skeleton className="h-4 w-2/3 bg-rose-100/70" />
                  <Skeleton className="h-10 w-full rounded-xl bg-rose-100/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
