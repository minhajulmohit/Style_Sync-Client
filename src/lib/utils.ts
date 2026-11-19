export { cn } from "cn"

export const formatServiceCategory = (category: string) =>
  category.replace(/&amp;/g, "&")
