import { Suspense, type ReactNode } from "react"
import { redirect } from "next/navigation"
import { getDashboardRole } from "@/lib/dashboard-role"

function DashboardLoading() {
  return (
    <div className="px-6 py-10 text-sm text-[#8e7e86]">
      Checking your account...
    </div>
  )
}

async function RequireRole({
  role,
  children,
}: {
  role: "admin" | "customer"
  children: ReactNode
}) {
  const currentRole = await getDashboardRole()

  if (!currentRole) {
    redirect("/signin")
  }

  if (currentRole !== role) {
    redirect(`/dashboard/${currentRole}`)
  }

  return children
}

async function RedirectToDashboard(): Promise<ReactNode> {
  const role = await getDashboardRole()

  if (!role) {
    return redirect("/signin")
  }

  return redirect(`/dashboard/${role}`)
}

export function DashboardRoleGuard({
  role,
  children,
}: {
  role: "admin" | "customer"
  children: ReactNode
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <RequireRole role={role}>{children}</RequireRole>
    </Suspense>
  )
}

export function DashboardHomeRedirect() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <RedirectToDashboard />
    </Suspense>
  )
}
