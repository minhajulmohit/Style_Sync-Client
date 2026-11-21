import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"

let mongoClient: MongoClient | undefined

async function getUserRole(userId: string): Promise<string | null> {
  if (!process.env.MONGODB_URL || !ObjectId.isValid(userId)) {
    return null
  }

  mongoClient ??= new MongoClient(process.env.MONGODB_URL)
  await mongoClient.connect()
  const user = await mongoClient
    .db("StyleSync")
    .collection("user")
    .findOne({ _id: new ObjectId(userId) })

  return typeof user?.role === "string" ? user.role : null
}

export async function getDashboardRole(): Promise<"admin" | "customer" | null> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return null
  }

  const sessionRole =
    typeof session.user.role === "string" ? session.user.role : ""
  const roles = (sessionRole || (await getUserRole(session.user.id)) || "")
    .split(",")
    .map((role) => role.trim().toLowerCase())

  if (roles.includes("admin")) {
    return "admin"
  }

  return roles.includes("customer") || roles.includes("user")
    ? "customer"
    : null
}
