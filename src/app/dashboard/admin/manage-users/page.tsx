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
            <div className="rounded-2xl border border-rose-100/70 bg-white p-8 text-center text-sm text-[#8e7e86]">
              Loading users...
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
