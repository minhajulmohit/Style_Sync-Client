import type { ReactNode } from "react"
import { DashboardRoleGuard } from "@/components/layout/dashboard-role-guard"

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <DashboardRoleGuard role="admin">{children}</DashboardRoleGuard>
}
