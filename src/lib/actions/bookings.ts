

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getBookings = async (query = ""): Promise<unknown[]> => {
  const res = await fetch(`${baseUrl}/bookings?${query}`);

  if (!res.ok) {
    throw new Error(`Could not load bookings (HTTP ${res.status}).`);
  }

  return res.json();
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