"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function updateUserBlockStatus(
  userId: string,
  isBlocked: boolean,
): Promise<{ ok: boolean; message: string }> {
  if (
    typeof userId !== "string" ||
    !userId.trim() ||
    typeof isBlocked !== "boolean"
  ) {
    return { ok: false, message: "Invalid account status update." };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { ok: false, message: "Please sign in again to continue." };
    }
    if (session.user.role?.toLowerCase() !== "admin") {
      return { ok: false, message: "Only administrators can update accounts." };
    }
    if (session.user.id === userId) {
      return {
        ok: false,
        message: "You cannot block or unblock your own account.",
      };
    }

    const response = await authenticatedFetch(
      `${baseUrl}/users/${encodeURIComponent(userId)}/block`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isBlocked }),
      },
    );

    if (!response.ok) {
      let message = `Could not update the account status (HTTP ${response.status}).`;
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data: unknown = await response.json();
        if (
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          message = data.message;
        }
      }

      return { ok: false, message };
    }

    revalidatePath("/dashboard/admin/manage-users");
    return { ok: true, message: "Account status updated." };
  } catch (error) {
    console.error("Could not update user status:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not update the account status. Please try again.",
    };
  }
}
