import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Scissors,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const appointments = [
  {
    day: "24",
    month: "NOV",
    service: "Signature Haircut & Blowout",
    salon: "The Rose Studio",
    time: "Monday · 10:30 AM",
    status: "Confirmed",
  },
  {
    day: "02",
    month: "DEC",
    service: "Glow & Go Facial",
    salon: "The Rose Studio",
    time: "Tuesday · 2:00 PM",
    status: "Pending",
  },
]

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Your personal space
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            Welcome back, there <span aria-hidden="true">✦</span>
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            A little time for yourself looks good on you.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f45b79] via-[#f27883] to-[#a36be3] p-6 text-white shadow-xl shadow-rose-200/50 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -right-2 -top-12 size-48 rounded-full border border-white/15" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                <Sparkles size={14} />
                Your next appointment
              </span>
              <h2 className="mt-5 max-w-lg font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Make room for a little me-time.
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Your Signature Haircut &amp; Blowout is coming up soon.
              </p>
              <Button className="mt-6 h-10 rounded-xl bg-white px-4 font-semibold text-[#d64f70] shadow-sm hover:bg-white/90">
                View appointment <ArrowRight />
              </Button>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:min-w-64">
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-[#df5574]">
                <span className="text-[10px] font-bold tracking-widest">NOV</span>
                <span className="font-heading text-2xl font-semibold leading-6">24</span>
              </div>
              <div>
                <p className="font-semibold">The Rose Studio</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                  <Clock3 size={13} /> Monday · 10:30 AM
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin size={13} /> Downtown
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
          <section className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-50 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#352a31]">
                  My Appointments
                </h2>
                <p className="mt-1 text-xs text-[#9a8d95]">
                  Keep track of your upcoming salon visits
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-[#e45c78]">
                2 upcoming
              </span>
            </div>
            <div className="divide-y divide-rose-50">
              {appointments.map((appointment) => (
                <article
                  key={appointment.service}
                  className="flex flex-wrap items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#fff3f2] text-[#e45c78]">
                    <span className="text-[10px] font-bold tracking-widest">
                      {appointment.month}
                    </span>
                    <span className="font-heading text-xl font-semibold leading-5">
                      {appointment.day}
                    </span>
                  </div>
                  <div className="min-w-40 flex-1">
                    <h3 className="text-sm font-semibold text-[#493943]">
                      {appointment.service}
                    </h3>
                    <p className="mt-1 text-xs text-[#9a8d95]">{appointment.salon}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#756a72]">
                      <CalendarDays size={13} className="text-[#e77a8e]" />
                      {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      appointment.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {appointment.status === "Confirmed" && <Check size={12} />}
                    {appointment.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${appointment.service}`}
                    className="rounded-xl text-[#a898a0] hover:bg-rose-50 hover:text-[#e45c78]"
                  >
                    <ArrowRight />
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/40 sm:p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <Scissors aria-hidden="true" size={20} />
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold text-[#352a31]">
                Your beauty routine
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#8e7e86]">
                You&apos;ve had 6 appointments with us. Thanks for making us part
                of your self-care!
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-rose-50 pt-4">
                <span className="text-xs text-[#9a8d95]">Appointments made</span>
                <span className="font-heading text-lg font-semibold text-[#493943]">06</span>
              </div>
            </section>

            <section className="rounded-2xl border border-rose-100/70 bg-gradient-to-br from-[#fff4f1] to-[#f8f0ff] p-5 sm:p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/80 text-[#e96b83] shadow-sm">
                <Sparkles aria-hidden="true" size={18} />
              </span>
              <h2 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
                Your next glow-up?
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#8e7e86]">
                Explore services picked just for you and find your next favorite.
              </p>
              <Button variant="ghost" className="mt-3 h-9 rounded-xl px-0 text-sm font-semibold text-[#df5574] hover:bg-transparent hover:text-[#c94162]">
                Explore services <ArrowRight />
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}