"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  ChartNoAxesCombined,
  CircleUserRound,
  LayoutDashboard,
  Scissors,
  Settings2,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminLinks = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
  {
    label: "Manage Services",
    icon: Scissors,
    path: "/dashboard/admin/manage-services",
  },
  {
    label: "Add Service",
    icon: Settings2,
    path: "/dashboard/admin/add-service",
  },
  {
    label: "Manage Appointments",
    icon: CalendarDays,
    path: "/dashboard/admin/manage-appointments",
  },
  {
    label: "Manage Users",
    icon: UsersRound,
    path: "/dashboard/admin/manage-users",
  },
  {
    label: "Transactions",
    icon: BadgeDollarSign,
    path: "/dashboard/admin/transitions",
  },
  {
    label: "My Profile",
    icon: CircleUserRound,
    path: "/dashboard/admin/admin-profile",
  },
];

const customerLinks = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard/customer" },
  {
    label: "My Appointments",
    icon: CalendarDays,
    path: "/dashboard/customer/my-appointments",
  },
  {
    label: "My Profile",
    icon: CircleUserRound,
    path: "/dashboard/customer/user-profile",
  },
];

export function DashboardSidebar() {
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user?.role ?? "")
    .split(",")
    .some((role) => role.trim().toLowerCase() === "admin");
  const links = isAdmin ? adminLinks : customerLinks;
  const name =
    session?.user?.name || (isAdmin ? "Admin account" : "Customer account");
  const email =
    session?.user?.email ||
    (isAdmin ? "admin@stylesync.com" : "customer@stylesync.com");

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="top-0! h-svh! border-r border-rose-100/70 bg-white"
    >
      <SidebarHeader className="px-5 pb-5 pt-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1">
        <Link
          href="/"
          aria-label="StyleSync home"
          title="Home"
          className="flex w-full items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/40 group-data-[collapsible=icon]:justify-center"
        >
          <span className="gradient-surface flex size-10 items-center justify-center rounded-2xl shadow-md shadow-rose-200/60">
            <Scissors aria-hidden="true" size={19} />
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-heading text-lg font-bold tracking-tight text-[#352a31]">
              StyleSync
            </p>
            <p className="text-xs text-[#9a8d95]">
              {isAdmin ? "Salon workspace" : "Your beauty space"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ab9da5] group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map(({ label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    isActive={label === "Overview"}
                    size="lg"
                    tooltip={label}
                    className="h-11 rounded-xl px-3 text-[#756a72] data-active:bg-rose-50 data-active:text-[#e94f72] data-active:shadow-sm data-active:shadow-rose-100/70"
                  >
                    <Icon aria-hidden="true" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 mt-6 rounded-2xl bg-linear-to-br from-rose-50 via-orange-50 to-purple-50 p-4 group-data-[collapsible=icon]:hidden">
          <ChartNoAxesCombined
            aria-hidden="true"
            className="mb-3 text-[#e96b83]"
            size={20}
          />
          <p className="text-sm font-semibold text-[#493943]">
            {isAdmin ? "Grow your salon" : "A little self-care?"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#8d7c85]">
            {isAdmin
              ? "Keep your services fresh and your clients smiling."
              : "Your next favorite look is just an appointment away."}
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-rose-100/70 p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={name}
              className="h-auto rounded-xl p-2"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-200 to-orange-100 text-sm font-semibold text-[#8b4356] group-data-[collapsible=icon]:size-8">
                <span className="group-data-[collapsible=icon]:hidden">
                  {name.charAt(0).toUpperCase()}
                </span>
                <UserRound
                  aria-hidden="true"
                  className="hidden group-data-[collapsible=icon]:block"
                  size={16}
                />
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-semibold text-[#493943]">
                  {name}
                </span>
                <span className="block truncate text-xs font-normal text-[#9a8d95]">
                  {email}
                </span>
              </span>
              <UserRound
                aria-hidden="true"
                className="ml-auto text-[#b5a8af] group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
