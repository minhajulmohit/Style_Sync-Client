import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MoreHorizontal,
  Plus,
  Scissors,
  UsersRound,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const stats = [
  {
    label: "Appointments today",
    value: "18",
    change: "+12.5%",
    icon: CalendarDays,
    positive: true,
    color: "bg-rose-50 text-rose-500",
  },
  {
    label: "Active services",
    value: "24",
    change: "2 new this month",
    icon: Scissors,
    positive: true,
    color: "bg-violet-50 text-violet-500",
  },
  {
    label: "Total customers",
    value: "1,248",
    change: "+8.2%",
    icon: UsersRound,
    positive: true,
    color: "bg-orange-50 text-orange-500",
  },
  {
    label: "Monthly revenue",
    value: "$8,420",
    change: "-2.4%",
    icon: CircleDollarSign,
    positive: false,
    color: "bg-emerald-50 text-emerald-600",
  },
]

const appointments = [
  { initials: "AM", name: "Ava Morgan", service: "Signature Haircut", time: "09:30 AM", status: "Confirmed", color: "bg-rose-100 text-rose-600" },
  { initials: "SC", name: "Sofia Carter", service: "Glow Facial", time: "10:15 AM", status: "Pending", color: "bg-purple-100 text-purple-600" },
  { initials: "EL", name: "Emma Lee", service: "Classic Manicure", time: "11:00 AM", status: "Confirmed", color: "bg-orange-100 text-orange-600" },
  { initials: "OS", name: "Olivia Smith", service: "Balayage & Style", time: "12:30 PM", status: "Confirmed", color: "bg-emerald-100 text-emerald-600" },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[#a28d97]">
              Wednesday, November 19, 2026
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
              Good morning, Admin <span aria-hidden="true">✦</span>
            </h1>
            <p className="mt-2 text-sm text-[#8e7e86]">
              Here&apos;s what&apos;s happening at your salon today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Notifications"
              className="size-10 rounded-xl border-rose-100 bg-white text-[#806f79]"
            >
              <Bell />
            </Button>
            <Button
              render={<Link href="/dashboard/admin/add-service" />}
              className="h-10 rounded-xl gradient-surface px-4 shadow-md shadow-rose-200/50 hover:opacity-90"
            >
              <Plus />
              Add service
            </Button>
          </div>
        </div>

        <section
          aria-label="Business overview"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map(({ label, value, change, icon: Icon, positive, color }) => (
            <article
              key={label}
              className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40"
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-11 items-center justify-center rounded-2xl ${color}`}>
                  <Icon aria-hidden="true" size={20} />
                </span>
                <button
                  type="button"
                  aria-label={`More options for ${label}`}
                  className="rounded-lg p-1.5 text-[#b8aab1] transition hover:bg-rose-50 hover:text-[#806f79]"
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>
              <p className="mt-5 text-sm text-[#8e7e86]">{label}</p>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                <p className="font-heading text-2xl font-semibold tracking-tight text-[#352a31]">
                  {value}
                </p>
                <span
                  className={`mb-1 inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {change}
                </span>
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
                  You have 18 appointments scheduled
                </p>
              </div>
              <Button variant="ghost" className="h-9 rounded-xl px-3 text-xs font-semibold text-[#e45c78] hover:bg-rose-50">
                View all <ArrowRight />
              </Button>
            </div>
            <div className="divide-y divide-rose-50">
              {appointments.map((appointment) => (
                <div
                  key={appointment.name}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6"
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${appointment.color}`}>
                    {appointment.initials}
                  </span>
                  <div className="min-w-32 flex-1">
                    <p className="text-sm font-semibold text-[#493943]">{appointment.name}</p>
                    <p className="mt-0.5 text-xs text-[#9a8d95]">{appointment.service}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-[#756a72]">
                    <Clock3 size={14} className="text-[#b5a8af]" />
                    {appointment.time}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      appointment.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#352a31]">
                  Weekly overview
                </h2>
                <p className="mt-1 text-xs text-[#9a8d95]">Appointments this week</p>
              </div>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-[#e45c78]">
                This week
              </span>
            </div>
            <div className="mt-7 flex h-36 items-end justify-between gap-2">
              {[
                ["Mon", "54%"],
                ["Tue", "76%"],
                ["Wed", "88%"],
                ["Thu", "62%"],
                ["Fri", "96%"],
                ["Sat", "70%"],
                ["Sun", "42%"],
              ].map(([day, height]) => (
                <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className={`w-full max-w-7 rounded-t-lg ${
                      day === "Wed" ? "gradient-surface" : "bg-rose-100"
                    }`}
                    style={{ height }}
                  />
                  <span className="text-[10px] text-[#a898a0]">{day}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[#fff7f4] p-4">
              <p className="text-xs text-[#9a8d95]">Total bookings</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-[#493943]">
                126 <span className="text-sm font-medium text-emerald-600">+9.3%</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
