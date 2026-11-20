"use client";

import { useState } from "react";
import { UsersRound } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string | Date;
  banned?: boolean;
};

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

export function ManageUsersTable({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const toggleBlocked = async (user: AdminUser) => {
    const userId = user.id ?? user._id;
    if (!userId) return;

    setUpdatingUserId(userId);

    try {
      const { error } = user.banned
        ? await authClient.admin.unbanUser({ userId })
        : await authClient.admin.banUser({ userId });

      if (error) {
        throw new Error(error.message || "Could not update the account status.");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          (currentUser.id ?? currentUser._id) === userId
            ? { ...currentUser, banned: !user.banned }
            : currentUser,
        ),
      );
      toast.add({
        type: "success",
        title: user.banned ? "Account unblocked" : "Account blocked",
        description: `${user.name || "The user"} can ${
          user.banned ? "sign in again" : "no longer sign in"
        }.`,
      });
    } catch (error) {
      console.error("Could not update user status:", error);
      toast.add({
        type: "error",
        title: "Could not update account status",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

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
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100/70 bg-rose-50/50 text-xs text-[#8e7e86]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {users.map((user, index) => {
              const userId = user.id ?? user._id;
              const isAdmin = user.role?.toLowerCase() === "admin";
              const isUpdating = updatingUserId === userId;

              return (
                <tr
                  key={userId ?? user.email ?? index}
                  className="text-[#493943]"
                >
                  <td className="px-4 py-4 font-medium">
                    {user.name || "Unnamed user"}
                  </td>
                  <td className="px-4 py-4">{user.email || "—"}</td>
                  <td className="px-4 py-4 capitalize">{user.role || "—"}</td>
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
                      {user.banned ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => toggleBlocked(user)}
                      disabled={!userId || isAdmin || isUpdating}
                      title={isAdmin ? "Admin accounts cannot be blocked" : undefined}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:pointer-events-none disabled:opacity-50 ${
                        user.banned
                          ? "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border border-rose-200 text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      {isUpdating
                        ? "Updating..."
                        : user.banned
                          ? "Unblock"
                          : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <UsersRound
                    aria-hidden="true"
                    className="mx-auto mb-3 text-[#d3b8c0]"
                    size={28}
                  />
                  <p className="font-medium text-[#493943]">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
