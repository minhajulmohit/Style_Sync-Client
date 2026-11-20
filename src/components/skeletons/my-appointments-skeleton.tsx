import { Skeleton } from "@/components/ui/skeleton";

export function MyAppointmentsSkeleton() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 bg-rose-100/70" />
            <Skeleton className="h-4 w-72 bg-rose-100/70" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl bg-rose-100/70" />
        </div>

        {/* Filter Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full bg-rose-100/70" />
          ))}
        </div>

        {/* Appointments List / Table Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
          <div className="divide-y divide-rose-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="size-16 rounded-2xl bg-rose-100/70" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 bg-rose-100/70" />
                    <Skeleton className="h-3 w-32 bg-rose-100/70" />
                    <Skeleton className="h-4 w-24 bg-rose-100/70" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-7 w-20 rounded-full bg-rose-100/70" />
                  <Skeleton className="h-7 w-16 rounded-full bg-rose-100/70" />
                  <Skeleton className="h-9 w-20 rounded-xl bg-rose-100/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
