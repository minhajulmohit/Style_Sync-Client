import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://style-sync-server.vercel.app"
    : "http://localhost:8000");
const backendPrefix = "/api/backend";

function isPublicRequest(method: string, path: string) {
  const isServiceDetails = /^\/services\/[a-f\d]{24}$/i.test(path);

  return (
    method === "GET" &&
    (path === "/services" || isServiceDetails || path === "/reviews")
  );
}

export async function proxy(request: NextRequest) {
  const backendPath = request.nextUrl.pathname.slice(backendPrefix.length);
  if (!backendPath.startsWith("/") || backendPath.startsWith("//")) {
    return NextResponse.json({ message: "Invalid API path." }, { status: 400 });
  }

  const targetUrl = new URL(backendBaseUrl);
  targetUrl.pathname = `${targetUrl.pathname.replace(/\/$/, "")}${backendPath}`;
  targetUrl.search = request.nextUrl.search;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("cookie");
  requestHeaders.delete("authorization");

  if (!isPublicRequest(request.method.toUpperCase(), backendPath)) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const apiToken = await auth.api.getToken({ headers: request.headers });
    if (!apiToken?.token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    requestHeaders.set("authorization", `Bearer ${apiToken.token}`);
  }

  return NextResponse.rewrite(targetUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/api/backend/:path*",
};
