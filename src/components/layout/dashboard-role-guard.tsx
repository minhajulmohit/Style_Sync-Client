import { Suspense, type ReactNode } from "react"
import { redirect } from "next/navigation"
import { getDashboardRole } from "@/lib/dashboard-role"

function DashboardLoading() {
  return (
    <div className="min-h-[50vh] p-6 space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-rose-100/70" />
      <div className="h-4 w-64 animate-pulse rounded bg-rose-100/70" />
      <div className="grid gap-4 sm:grid-cols-3 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-rose-100/70" />
        ))}
      </div>
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
