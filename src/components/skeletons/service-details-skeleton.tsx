import { Skeleton } from "@/components/ui/skeleton";

export function ServiceDetailsSkeleton() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Back Link Skeleton */}
        <Skeleton className="mb-5 h-5 w-28 bg-rose-100/70" />

        {/* Hero Card Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/70 bg-white shadow-md shadow-rose-100/40">
          {/* Service Image Skeleton */}
          <Skeleton className="aspect-21/9 w-full bg-rose-100/70" />

          {/* Details Skeleton */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-full bg-rose-100/70" />
                <Skeleton className="h-9 w-72 bg-rose-100/70" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24 bg-rose-100/70" />
                  <Skeleton className="h-4 w-20 bg-rose-100/70" />
                </div>
              </div>
              <Skeleton className="h-10 w-28 bg-rose-100/70" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 border-t border-rose-50 pt-5">
              <Skeleton className="h-4 w-full bg-rose-100/70" />
              <Skeleton className="h-4 w-5/6 bg-rose-100/70" />
              <Skeleton className="h-4 w-3/4 bg-rose-100/70" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 border-t border-rose-50 pt-6">
              <Skeleton className="h-11 w-44 rounded-xl bg-rose-100/70" />
              <Skeleton className="h-11 w-32 rounded-xl bg-rose-100/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
