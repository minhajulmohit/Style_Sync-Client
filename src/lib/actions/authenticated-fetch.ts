import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function authenticatedFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const token = session?.session?.token;

  if (!token) {
    throw new Error("Please sign in again to continue.");
  }

  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers: requestHeaders,
    cache: init.cache ?? "no-store",
  });
}
