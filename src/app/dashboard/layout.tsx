import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider className="min-h-[calc(100svh-5rem)] bg-[#fffaf8]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <header className="flex h-14 items-center border-b border-rose-100/70 bg-white/80 px-4 sm:px-7">
          <SidebarTrigger className="text-[#756a72]" />
          <span className="ml-1 text-sm font-medium text-[#756a72]">
            Workspace
          </span>
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
