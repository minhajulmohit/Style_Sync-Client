export const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

export const SERVICE_STATUSES = ["Active", "Inactive"] as const

export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

export type AddServicePayload = {
  serviceName: string
  category: ServiceCategory
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
}

export type ServiceRecord = AddServicePayload & {
  id?: string
  _id?: string
}

export type ImgBBUploadResponse = {
  success: boolean
  data?: {
    display_url: string
  }
  error?: {
    message?: string
  }
}
