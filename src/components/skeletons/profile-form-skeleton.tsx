import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div className="rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm shadow-rose-100/40 sm:p-8">
      {/* Avatar Circle */}
      <div className="flex flex-col items-center">
        <Skeleton className="size-24 rounded-full bg-rose-100/70" />
        <Skeleton className="mt-3 h-3 w-40 bg-rose-100/70" />
      </div>

      {/* Inputs Skeleton */}
      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-rose-100/70" />
          <Skeleton className="h-11 w-full rounded-xl bg-rose-100/70" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-rose-100/70" />
          <Skeleton className="h-11 w-full rounded-xl bg-rose-100/70" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 bg-rose-100/70" />
          <Skeleton className="h-11 w-full rounded-xl bg-rose-100/70" />
        </div>

        {/* Submit button */}
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-11 w-32 rounded-xl bg-rose-100/70" />
        </div>
      </div>
    </div>
  );
}
