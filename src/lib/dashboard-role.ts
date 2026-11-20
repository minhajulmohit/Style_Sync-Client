import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function getDashboardRole(): Promise<"admin" | "customer" | null> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return null
  }

  const roles = (session.user.role ?? "")
    .split(",")
    .map((role) => role.trim().toLowerCase())

  if (roles.includes("admin")) {
    return "admin"
  }

  return roles.includes("customer") || roles.includes("user")
    ? "customer"
    : null
}
