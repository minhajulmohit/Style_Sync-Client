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

  return roles.includes("admin") ? "admin" : "customer"
}
