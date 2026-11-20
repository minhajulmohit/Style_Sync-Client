import { Skeleton } from "@/components/ui/skeleton";

type TablePageSkeletonProps = {
  title?: string;
  subtitle?: string;
  showActionButton?: boolean;
  filterPillCount?: number;
  columnCount?: number;
  rowCount?: number;
};

export function TablePageSkeleton({
  title,
  subtitle,
  showActionButton = false,
  filterPillCount = 4,
  columnCount = 6,
  rowCount = 6,
}: TablePageSkeletonProps) {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 bg-rose-100/70" />
            <Skeleton className="h-4 w-72 bg-rose-100/70" />
          </div>
          {showActionButton && (
            <Skeleton className="h-10 w-36 rounded-xl bg-rose-100/70" />
          )}
        </div>

        {/* Filter Pills if any */}
        {filterPillCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {Array.from({ length: filterPillCount }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-9 w-24 rounded-full bg-rose-100/70"
              />
            ))}
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
          <div className="border-b border-rose-100/70 bg-[#fffdfc] px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-rose-100/70" />
              <Skeleton className="h-4 w-20 bg-rose-100/70" />
            </div>
          </div>

          <div className="divide-y divide-rose-50">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-4 px-6 py-4.5"
              >
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <Skeleton
                    key={colIndex}
                    className={`h-4 bg-rose-100/70 ${
                      colIndex === 0
                        ? "w-40"
                        : colIndex === 1
                        ? "w-48"
                        : colIndex === columnCount - 1
                        ? "w-20 rounded-lg"
                        : "w-24"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
