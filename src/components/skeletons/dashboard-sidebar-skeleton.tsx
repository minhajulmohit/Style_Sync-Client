import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenuItem } from "@/components/ui/sidebar";

export function DashboardSidebarHeaderSkeleton() {
  return <Skeleton className="mt-1 h-3 w-28 bg-rose-100/70" />;
}

export function DashboardSidebarMenuSkeleton() {
  return (
    <>
      {["w-24", "w-32", "w-28", "w-36", "w-20"].map((width, index) => (
        <SidebarMenuItem key={index}>
          <div className="flex h-11 items-center gap-3 rounded-xl px-3">
            <Skeleton className="size-4 shrink-0 rounded-md bg-rose-100/70" />
            <Skeleton
              className={`h-3 bg-rose-100/70 group-data-[collapsible=icon]:hidden ${width}`}
            />
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function DashboardSidebarPromoSkeleton() {
  return (
    <div className="mx-3 mt-6 rounded-2xl bg-rose-50/50 p-4 group-data-[collapsible=icon]:hidden">
      <Skeleton className="mb-3 size-5 rounded-md bg-rose-100/70" />
      <Skeleton className="h-4 w-32 bg-rose-100/70" />
      <Skeleton className="mt-2 h-10 w-full bg-rose-100/70" />
    </div>
  );
}

export function DashboardSidebarFooterSkeleton() {
  return (
    <div
      className="flex h-auto items-center gap-2 rounded-xl p-2 group-data-[collapsible=icon]:justify-center"
      aria-label="Loading account"
    >
      <Skeleton className="size-9 shrink-0 rounded-full bg-rose-100/70 group-data-[collapsible=icon]:size-8" />
      <div className="min-w-0 flex-1 space-y-2 group-data-[collapsible=icon]:hidden">
        <Skeleton className="h-3 w-28 bg-rose-100/70" />
        <Skeleton className="h-2.5 w-36 bg-rose-100/70" />
      </div>
    </div>
  );
}
