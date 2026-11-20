"use server";

import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function updateAppointmentStatus(formData: FormData) {
  const bookingId = formData.get("bookingId");
  const status = formData.get("status");

  if (
    typeof bookingId !== "string" ||
    !bookingId ||
    typeof status !== "string" ||
    !["Confirmed", "Cancelled"].includes(status)
  ) {
    throw new Error("Invalid appointment update.");
  }

  const response = await authenticatedFetch(
    `${baseUrl}/bookings/${encodeURIComponent(bookingId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Could not update appointment (HTTP ${response.status}).`,
    );
  }

  revalidatePath("/dashboard/admin/manage-appointments");
}
