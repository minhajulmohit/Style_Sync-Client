"use server";

import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type AppointmentStatusUpdate = "Confirmed" | "Cancelled";

export type AppointmentActionResult = {
  ok: boolean;
  message: string;
};

// Admin Confirm / Cancel. Error throw না করে result return করি,
// যাতে client component toast দেখাতে পারে।
export async function updateAppointmentStatus(
  bookingId: string,
  status: AppointmentStatusUpdate,
): Promise<AppointmentActionResult> {
  if (!bookingId || (status !== "Confirmed" && status !== "Cancelled")) {
    return { ok: false, message: "Invalid appointment update." };
  }

  try {
    const response = await authenticatedFetch(
      `${baseUrl}/bookings/${encodeURIComponent(bookingId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      let message = `Could not update appointment (HTTP ${response.status}).`;
      try {
        const data = await response.json();
        if (data?.message) {
          message = data.message;
        }
      } catch {
        // server JSON না পাঠালে default message থাকবে
      }
      return { ok: false, message };
    }
  } catch (error) {
    console.error("Could not update appointment:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not connect to the server. Please try again.",
    };
  }

  revalidatePath("/dashboard/admin/manage-appointments");
  revalidatePath("/dashboard/admin");

  return {
    ok: true,
    message:
      status === "Confirmed"
        ? "The appointment has been confirmed."
        : "The appointment has been cancelled.",
  };
}
