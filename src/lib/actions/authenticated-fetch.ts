import { headers } from "next/headers";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

const API_JWT_ISSUER = "stylesync-client";
const API_JWT_AUDIENCE = "stylesync-server";
const API_JWT_LIFETIME = "5m";

async function createApiToken(userId: string): Promise<string> {
  const secret = process.env.API_JWT_SECRET;
  const key = secret ? new TextEncoder().encode(secret) : null;

  if (!key || key.byteLength < 32) {
    throw new Error("API_JWT_SECRET must be configured with at least 32 bytes.");
  }

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(API_JWT_ISSUER)
    .setAudience(API_JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(API_JWT_LIFETIME)
    .sign(key);
}

export async function authenticatedFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Please sign in again to continue.");
  }

  const token = await createApiToken(userId);
  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers: requestHeaders,
    cache: init.cache ?? "no-store",
  });
}
