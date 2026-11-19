import type { ServiceRecord } from "@/types/services"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getServices = async (
  query = "",
): Promise<ServiceRecord[]> => {
  const res = await fetch(`${baseUrl}/services?${query}`)

  if (!res.ok) {
    throw new Error(`Could not load services (HTTP ${res.status}).`)
  }

  return res.json()
}

export const getServiceId = async (
  serviceId: string,
): Promise<ServiceRecord | null> => {
  const res = await fetch(`${baseUrl}/services/${serviceId}`)

  if (!res.ok) {
    throw new Error(`Could not load service (HTTP ${res.status}).`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}