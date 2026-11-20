

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type BookingRecord = {
  _id?: string;
  userId: string;
  serviceId: string;
  serviceName?: string;
  date: string;
  time: string;
  duration?: number;
  message?: string;
  status: string;
  cancelledBy?: string;
};

export type BookedSlot = {
  time: string;
  duration: number;
};

type NewBooking = Pick<
  BookingRecord,
  "userId" | "serviceId" | "date" | "time" | "message"
>;

export const getBookings = async (query = ""): Promise<BookingRecord[]> => {
  const res = await fetch(`${baseUrl}/bookings?${query}`);

  if (!res.ok) {
    throw new Error(`Could not load bookings (HTTP ${res.status}).`);
  }

  return res.json();
};

export const getBookedSlots = async (
  serviceId: string,
  date: string,
): Promise<BookedSlot[]> => {
  const query = new URLSearchParams({ serviceId, date });
  const res = await fetch(`${baseUrl}/bookings/availability?${query}`);

  if (!res.ok) {
    throw new Error(`Could not load available times (HTTP ${res.status}).`);
  }

  const result: { bookedSlots: BookedSlot[] } = await res.json();
  return result.bookedSlots;
};

export const createBooking = async (booking: NewBooking): Promise<void> => {
  const res = await fetch(`${baseUrl}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (res.status === 409) {
    throw new Error("This time overlaps an existing booking. Choose another time.");
  }

  if (!res.ok) {
    throw new Error(`Could not create booking (HTTP ${res.status}).`);
  }
};

export const cancelBooking = async (
  bookingId: string,
  userId: string,
): Promise<void> => {
  const res = await fetch(`${baseUrl}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "Cancelled",
      cancelledBy: "user",
      userId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Could not cancel booking (HTTP ${res.status}).`);
  }

  const result: { matchedCount?: number } = await res.json();
  if (result.matchedCount === 0) {
    throw new Error("This pending appointment could not be found.");
  }
};

export const getBookingsCount = async (
  query = "",
): Promise<{ count: number }> => {
  const res = await fetch(`${baseUrl}/bookings/count?${query}`);

  if (!res.ok) {
    throw new Error(`Could not load booking count (HTTP ${res.status}).`);
  }

  return res.json();
};