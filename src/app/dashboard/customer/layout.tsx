import type { ReactNode } from "react"
import { DashboardRoleGuard } from "@/components/layout/dashboard-role-guard"

export default function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <DashboardRoleGuard role="customer">{children}</DashboardRoleGuard>
}
