import { Suspense } from "react";
import { UsersRound } from "lucide-react";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string | Date;
  banned?: boolean;
};

async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await authenticatedFetch(`${baseUrl}/users`);

  if (!response.ok) {
    throw new Error(`Could not load users (HTTP ${response.status}).`);
  }

  const users: AdminUser[] = await response.json();
  return users;
}

function formatDate(value?: string | Date) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

  return (
    <section
      aria-label="Registered users"
      className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40"
    >
      <div className="flex items-center justify-between border-b border-rose-100/70 px-5 py-4">
        <h2 className="font-heading font-semibold text-[#493943]">
          Registered users
        </h2>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-[#b34d68]">
          {users.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100/70 bg-rose-50/50 text-xs text-[#8e7e86]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {users.map((user, index) => (
              <tr
                key={user._id ?? user.id ?? user.email ?? index}
                className="text-[#493943]"
              >
                <td className="px-4 py-4 font-medium">
                  {user.name || "Unnamed user"}
                </td>
                <td className="px-4 py-4">{user.email || "—"}</td>
                <td className="px-4 py-4 capitalize">
                  {user.role || "—"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.banned
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {user.banned ? "Banned" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <UsersRound
                    aria-hidden="true"
                    className="mx-auto mb-3 text-[#d3b8c0]"
                    size={28}
                  />
                  <p className="font-medium text-[#493943]">
                    No users found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
