import type { AddServicePayload } from "@/types/services"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getServices = async (
  query = "",
): Promise<AddServicePayload[]> => {
  const res = await fetch(`${baseUrl}/services?${query}`)
  return res.json()
}

export const getServiceId = async (
  serviceId: string,
): Promise<AddServicePayload | null> => {
  const res = await fetch(`${baseUrl}/services/${serviceId}`)

  const text = await res.text()
  return text ? JSON.parse(text) : null
}