import type { ServiceRecord } from "@/types/services"

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://style-sync-server.vercel.app"
    : "http://localhost:8000");

function getApiBaseUrl() {
  return typeof window === "undefined" ? backendBaseUrl : "/api/backend";
}

export const getServices = async (
  query = "",
): Promise<ServiceRecord[]> => {
  const res = await fetch(`${getApiBaseUrl()}/services?${query}`)

  if (!res.ok) {
    throw new Error(`Could not load services (HTTP ${res.status}).`)
  }

  return res.json()
}

export const getServiceId = async (
  serviceId: string,
): Promise<ServiceRecord | null> => {
  const res = await fetch(
    `${getApiBaseUrl()}/services/${encodeURIComponent(serviceId)}`,
  )

  if (!res.ok) {
    throw new Error(`Could not load service (HTTP ${res.status}).`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}