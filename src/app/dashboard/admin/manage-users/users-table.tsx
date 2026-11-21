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
  isBlocked?: boolean;
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
  const { data: session } = authClient.useSession();

  const toggleBlocked = async (user: AdminUser) => {
    const userId = user.id ?? user._id;
    if (!userId) return;

    const isBlocked = user.isBlocked === true || user.banned === true;
    setUpdatingUserId(userId);

    try {
      const token = session?.session.token;
      if (!token) {
        throw new Error("Please sign in again to continue.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/users/${encodeURIComponent(userId)}/block`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ isBlocked: !isBlocked }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Could not update the account status (HTTP ${response.status}).`,
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          (currentUser.id ?? currentUser._id) === userId
            ? { ...currentUser, banned: !isBlocked, isBlocked: !isBlocked }
            : currentUser,
        ),
      );
      toast.add({
        type: "success",
        title: isBlocked ? "Account unblocked" : "Account blocked",
        description: `${user.name || "The user"} can ${
          isBlocked ? "sign in again" : "no longer sign in"
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
              const isAdmin = (user.role ?? "")
                .split(",")
                .some((role) => role.trim().toLowerCase() === "admin");
              const isBlocked = user.isBlocked === true || user.banned === true;
              const isCurrentUser = session?.user.id === userId;
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
                        isBlocked
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => toggleBlocked(user)}
                      disabled={!userId || isAdmin || isCurrentUser || isUpdating}
                      title={
                        isAdmin
                          ? "Admin accounts cannot be blocked"
                          : isCurrentUser
                            ? "You cannot block or unblock your own account"
                            : undefined
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:pointer-events-none disabled:opacity-50 ${
                        isBlocked
                          ? "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border border-rose-200 text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      {isUpdating
                        ? "Updating..."
                        : isBlocked
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
