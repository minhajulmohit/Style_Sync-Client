"use client";

import { useState } from "react";
import { Eye, UsersRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { updateUserBlockStatus } from "@/lib/actions/admin-users";

export type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  phone?: string | null;
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
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [pendingBlockUser, setPendingBlockUser] = useState<AdminUser | null>(
    null,
  );
  const { data: session } = authClient.useSession();

  const toggleBlocked = async (user: AdminUser) => {
    const userId = user.id ?? user._id;
    if (!userId) return;

    const isBlocked = user.isBlocked === true || user.banned === true;
    setUpdatingUserId(userId);

    try {
      const result = await updateUserBlockStatus(userId, !isBlocked);
      if (!result.ok) {
        throw new Error(result.message);
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
      setPendingBlockUser(null);
    }
  };

  return (
    <section
      aria-label="Registered users"
      className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40"
    >
      <div className="flex items-center justify-between border-b border-rose-100/70 px-5 py-4">
        <h2 className="font-heading font-semibold text-[#493943]">
          Registered customers
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
                  <td className="flex items-center gap-2 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-2 text-xs font-medium text-[#756a72] transition hover:bg-rose-50 hover:text-[#e45c78]"
                    >
                      <Eye aria-hidden="true" size={14} />
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingBlockUser(user)}
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
                  <p className="font-medium text-[#493943]">No customers found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={pendingBlockUser !== null}
        onOpenChange={(open) => {
          if (!updatingUserId && !open) {
            setPendingBlockUser(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingBlockUser?.isBlocked || pendingBlockUser?.banned
                ? "Unblock this account?"
                : "Block this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingBlockUser?.isBlocked || pendingBlockUser?.banned
                ? `${pendingBlockUser.name || "This customer"} will be able to sign in again.`
                : `${pendingBlockUser?.name || "This customer"} will no longer be able to sign in.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updatingUserId !== null}>
              Go back
            </AlertDialogCancel>
            <Button
              type="button"
              variant={
                pendingBlockUser?.isBlocked || pendingBlockUser?.banned
                  ? "default"
                  : "destructive"
              }
              disabled={updatingUserId !== null}
              onClick={() => {
                if (pendingBlockUser) {
                  void toggleBlocked(pendingBlockUser);
                }
              }}
            >
              {updatingUserId !== null
                ? "Updating..."
                : pendingBlockUser?.isBlocked || pendingBlockUser?.banned
                  ? "Unblock account"
                  : "Block account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedUser && (
        <UserDetailsModal
          user={
            users.find(
              (item) =>
                (item.id ?? item._id) === (selectedUser.id ?? selectedUser._id),
            ) ?? selectedUser
          }
          onClose={() => setSelectedUser(null)}
        />
      )}
    </section>
  );
}

// User এর সব details popup এ দেখাই
function UserDetailsModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const isBlocked = user.isBlocked === true || user.banned === true;
  const details = [
    { label: "Full Name", value: user.name || "Unnamed user" },
    { label: "Email", value: user.email || "—" },
    { label: "Phone", value: user.phone || "Not added" },
    { label: "Role", value: user.role === "admin" ? "Admin" : "Customer" },
    { label: "Joined", value: formatDate(user.createdAt) },
    { label: "Account Status", value: isBlocked ? "Blocked" : "Active" },
    { label: "User ID", value: user.id ?? user._id ?? "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close user details"
        className="absolute inset-0 size-full cursor-default bg-black/40"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#8e7e86] hover:bg-rose-50"
        >
          <X aria-hidden="true" size={18} />
        </button>

        <div className="flex items-center gap-4 pr-8">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || "User"}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-rose-50 font-heading text-xl font-semibold text-[#e45c78]">
              {(user.name || "U").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#a28d97]">User details</p>
            <h2
              id="user-details-title"
              className="mt-1 truncate font-heading text-lg font-semibold text-[#352a31]"
            >
              {user.name || "Unnamed user"}
            </h2>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-rose-50 rounded-2xl bg-[#fffaf8] px-4">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-4 py-3"
            >
              <dt className="text-xs text-[#9a8d95]">{item.label}</dt>
              <dd className="break-all text-right text-sm font-medium text-[#493943]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-rose-100 px-4 py-2 text-sm font-medium text-[#b34d68] hover:bg-rose-50"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
