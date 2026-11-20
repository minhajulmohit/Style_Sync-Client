import { Suspense } from "react";
import { AdminOverviewSkeleton } from "@/components/skeletons";
import {
  ArrowRight,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Plus,
  Scissors,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type AdminService = {
  _id?: string;
  id?: string;
};

type AdminBooking = {
  _id?: string;
  userId: string;
  serviceName?: string;
  date: string;
  time: string;
  status: string;
};

type AdminPayment = {
  sessionId?: string;
};

async function getAdminData<T>(path: string): Promise<T> {
  const response = await authenticatedFetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Could not load dashboard data (HTTP ${response.status}).`);
  }

  return response.json();
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminOverviewSkeleton />}>
      <AdminDashboardData />
    </Suspense>
  );
}

async function AdminDashboardData() {
  const [users, services, bookings, payments] = await Promise.all([
    getAdminData<AdminUser[]>("/users"),
    getAdminData<AdminService[]>("/services"),
    getAdminData<AdminBooking[]>("/bookings"),
    getAdminData<AdminPayment[]>("/payments"),
  ]);
  const today = toLocalDateString(new Date());
  const customers = users.filter(
    (user) =>
      !(user.role ?? "")
        .split(",")
        .some((role) => role.trim().toLowerCase() === "admin"),
  );
  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;
  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;
  const todaysAppointments = bookings
    .filter(
      (booking) =>
        booking.date === today && booking.status !== "Cancelled",
    )
    .sort((first, second) => first.time.localeCompare(second.time));
  const usersById = new Map<string, AdminUser>();

  for (const user of users) {
    const userId = user._id ?? user.id;
    if (userId) usersById.set(userId, user);
  }

  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  weekStart.setDate(weekStart.getDate() - mondayOffset);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return toLocalDateString(date);
  });
  const weeklyCounts = weekDates.map(
    (date) =>
      bookings.filter(
        (booking) =>
          booking.date === date && booking.status !== "Cancelled",
      ).length,
  );
  const maxWeeklyCount = Math.max(1, ...weeklyCounts);
  const weekTotal = weeklyCounts.reduce((total, count) => total + count, 0);
  const stats = [
    {
      label: "Registered customers",
      value: customers.length,
      detail: "Customer accounts",
      icon: UsersRound,
      color: "bg-rose-50 text-rose-500",
    },
    {
      label: "Active services",
      value: services.length,
      detail: "Available for booking",
      icon: Scissors,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Appointment requests",
      value: bookings.length,
      detail: "All appointment requests",
      icon: ClipboardList,
      color: "bg-orange-50 text-orange-500",
    },
    {
      label: "Pending appointments",
      value: pendingCount,
      detail: "Awaiting confirmation",
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Confirmed appointments",
      value: confirmedCount,
      detail: "Confirmed bookings",
      icon: CalendarCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Successful payments",
      value: payments.length,
      detail: "Verified Stripe payments",
      icon: CircleDollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[#a28d97]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
              Salon overview
            </h1>
            <p className="mt-2 text-sm text-[#8e7e86]">
              Live appointments, customers, services, and payments.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/admin/add-service" />}
            className="h-10 rounded-xl gradient-surface px-4 shadow-md shadow-rose-200/50 hover:opacity-90"
          >
            <Plus />
            Add service
          </Button>
        </div>

        <section
          aria-label="Business overview"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {stats.map(({ label, value, detail, icon: Icon, color }) => (
            <article
              key={label}
              className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40"
            >
              <span
                className={`flex size-11 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon aria-hidden="true" size={20} />
              </span>
              <p className="mt-5 text-sm text-[#8e7e86]">{label}</p>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                <p className="font-heading text-2xl font-semibold tracking-tight text-[#352a31]">
                  {value}
                </p>
                <span className="mb-1 text-xs text-[#9a8d95]">{detail}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.8fr)]">
          <section className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-50 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#352a31]">
                  Today&apos;s appointments
                </h2>
                <p className="mt-1 text-xs text-[#9a8d95]">
                  {todaysAppointments.length} scheduled today
                </p>
              </div>
              <Button
                render={<Link href="/dashboard/admin/manage-appointments" />}
                variant="ghost"
                className="h-9 rounded-xl px-3 text-xs font-semibold text-[#e45c78] hover:bg-rose-50"
              >
                View all <ArrowRight />
              </Button>
            </div>
            <div className="divide-y divide-rose-50">
              {todaysAppointments.map((appointment, index) => {
                const customer = usersById.get(appointment.userId);

                return (
                  <div
                    key={
                      appointment._id ??
                      `${appointment.userId}-${appointment.time}-${index}`
                    }
                    className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-600">
                      {(customer?.name ?? "Customer")
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <div className="min-w-32 flex-1">
                      <p className="text-sm font-semibold text-[#493943]">
                        {customer?.name || "Customer"}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9a8d95]">
                        {appointment.serviceName || "Service"}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-[#756a72]">
                      <Clock3 size={14} className="text-[#b5a8af]" />
                      {formatTime(appointment.time)}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-[#b34d68]">
                      {appointment.status}
                    </span>
                  </div>
                );
              })}
              {todaysAppointments.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-[#9a8d95]">
                  No appointments scheduled for today.
                </p>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#352a31]">
                  Weekly overview
                </h2>
                <p className="mt-1 text-xs text-[#9a8d95]">
                  Active appointments this week
                </p>
              </div>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-[#e45c78]">
                This week
              </span>
            </div>
            <div className="mt-7 flex h-36 items-end justify-between gap-2">
              {weekDates.map((date, index) => {
                const height = Math.max(
                  weeklyCounts[index] === 0 ? 5 : 14,
                  Math.round((weeklyCounts[index] / maxWeeklyCount) * 100),
                );
                const day = new Date(`${date}T00:00:00`).toLocaleDateString(
                  "en-US",
                  { weekday: "short" },
                );

                return (
                  <div
                    key={date}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className={`w-full max-w-7 rounded-t-lg ${
                        weeklyCounts[index] > 0
                          ? "gradient-surface"
                          : "bg-rose-100"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-[#a898a0]">{day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl bg-[#fff7f4] p-4">
              <p className="text-xs text-[#9a8d95]">Total bookings this week</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-[#493943]">
                {weekTotal}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
