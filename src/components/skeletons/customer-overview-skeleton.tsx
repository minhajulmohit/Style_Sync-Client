import { Skeleton } from "@/components/ui/skeleton";

export function CustomerOverviewSkeleton() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-7 space-y-2">
          <Skeleton className="h-4 w-28 bg-rose-100/70" />
          <Skeleton className="h-8 w-72 bg-rose-100/70" />
          <Skeleton className="h-4 w-60 bg-rose-100/70" />
        </div>

        {/* Hero Next Appointment Card Skeleton */}
        <div className="rounded-[1.75rem] border border-rose-100/70 bg-gradient-to-br from-rose-100/60 to-purple-100/60 p-6 sm:p-9">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <Skeleton className="h-6 w-36 rounded-full bg-white/60" />
              <Skeleton className="h-9 w-64 bg-white/70" />
              <Skeleton className="h-4 w-48 bg-white/60" />
              <Skeleton className="h-10 w-40 rounded-xl bg-white/80" />
            </div>
            <div className="flex h-24 w-64 items-center gap-4 rounded-2xl border border-white/40 bg-white/40 p-4">
              <Skeleton className="size-14 rounded-xl bg-white/80" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/80" />
                <Skeleton className="h-3 w-16 bg-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
          {/* Upcoming Appointments List Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
            <div className="flex items-center justify-between border-b border-rose-50 px-5 py-5 sm:px-6">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40 bg-rose-100/70" />
                <Skeleton className="h-3 w-32 bg-rose-100/70" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full bg-rose-100/70" />
            </div>
            <div className="divide-y divide-rose-50">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-5 sm:px-6">
                  <Skeleton className="size-14 shrink-0 rounded-2xl bg-rose-100/70" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-44 bg-rose-100/70" />
                    <Skeleton className="h-3 w-20 bg-rose-100/70" />
                    <Skeleton className="h-3 w-36 bg-rose-100/70" />
                  </div>
                  <Skeleton className="h-7 w-20 rounded-full bg-rose-100/70" />
                </div>
              ))}
            </div>
          </div>

          {/* Routine and Suggestion Cards */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40 sm:p-6 space-y-3">
              <Skeleton className="size-11 rounded-2xl bg-rose-100/70" />
              <Skeleton className="h-5 w-40 bg-rose-100/70" />
              <Skeleton className="h-4 w-52 bg-rose-100/70" />
              <div className="border-t border-rose-50 pt-4 flex justify-between">
                <Skeleton className="h-4 w-28 bg-rose-100/70" />
                <Skeleton className="h-6 w-8 bg-rose-100/70" />
              </div>
            </div>

            <div className="rounded-2xl border border-rose-100/70 bg-white p-5 sm:p-6 space-y-3">
              <Skeleton className="size-10 rounded-xl bg-rose-100/70" />
              <Skeleton className="h-5 w-36 bg-rose-100/70" />
              <Skeleton className="h-4 w-48 bg-rose-100/70" />
              <Skeleton className="h-8 w-32 rounded-xl bg-rose-100/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
