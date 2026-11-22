import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function authenticatedFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    throw new Error("Please sign in again to continue.");
  }

  const apiToken = await auth.api.getToken({ headers: requestHeaders });
  if (!apiToken?.token) {
    throw new Error("Could not create an API access token. Please try again.");
  }

  const headersWithToken = new Headers(init.headers);
  headersWithToken.set("authorization", `Bearer ${apiToken.token}`);

  return fetch(input, {
    ...init,
    headers: headersWithToken,
    cache: init.cache ?? "no-store",
  });
}
