import { Suspense } from "react";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";
import { ManageUsersTable, type AdminUser } from "./users-table";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await authenticatedFetch(`${baseUrl}/users`);

  if (!response.ok) {
    throw new Error(`Could not load users (HTTP ${response.status}).`);
  }

  const users: AdminUser[] = await response.json();
  return users;
}

export default function ManageUsersPage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Salon customer accounts
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            View registered customers and account status.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm shadow-rose-100/40">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-rose-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 animate-pulse rounded-full bg-rose-100/70" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 animate-pulse rounded bg-rose-100/70" />
                        <div className="h-3 w-48 animate-pulse rounded bg-rose-100/70" />
                      </div>
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded-full bg-rose-100/70" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-rose-100/70" />
                    <div className="size-8 animate-pulse rounded-lg bg-rose-100/70" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
}

async function UsersTable() {
  const users = await getAdminUsers();
  return <ManageUsersTable users={users} />;
}
