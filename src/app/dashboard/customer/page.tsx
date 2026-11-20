import { Suspense } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Scissors,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type CustomerBooking = {
  _id?: string;
  serviceName?: string;
  date: string;
  time: string;
  status: string;
};

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

function formatAppointmentDate(date: string, time: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const dateLabel = Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return `${dateLabel} · ${formatTime(time)}`;
}

export default function CustomerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-10 text-sm text-[#8e7e86]">
          Loading your appointments...
        </div>
      }
    >
      <CustomerDashboardData />
    </Suspense>
  );
}

async function CustomerDashboardData() {
  const [session, response] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    authenticatedFetch(`${baseUrl}/bookings`),
  ]);

  if (!response.ok) {
    throw new Error(`Could not load appointments (HTTP ${response.status}).`);
  }

  const bookings: CustomerBooking[] = await response.json();
  const today = toLocalDateString(new Date());
  const upcomingAppointments = bookings
    .filter(
      (booking) =>
        booking.date >= today &&
        (booking.status === "Pending" || booking.status === "Confirmed"),
    )
    .sort(
      (first, second) =>
        `${first.date} ${first.time}`.localeCompare(
          `${second.date} ${second.time}`,
        ),
    );
  const nextAppointment = upcomingAppointments[0];
  const userName = session?.user.name || "there";

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Your personal space
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            Welcome back, {userName} <span aria-hidden="true">✦</span>
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
                <Sparkles aria-hidden="true" size={14} />
                Your next appointment
              </span>
              <h2 className="mt-5 max-w-lg font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {nextAppointment
                  ? nextAppointment.serviceName || "Your upcoming visit"
                  : "Make room for a little me-time."}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                {nextAppointment
                  ? formatAppointmentDate(
                      nextAppointment.date,
                      nextAppointment.time,
                    )
                  : "You have no upcoming appointments right now."}
              </p>
              <Button
                render={
                  <Link href="/dashboard/customer/my-appointments" />
                }
                className="mt-6 h-10 rounded-xl bg-white px-4 font-semibold text-[#d64f70] shadow-sm hover:bg-white/90"
              >
                View appointments <ArrowRight />
              </Button>
            </div>
            {nextAppointment && (
              <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:min-w-64">
                <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-[#df5574]">
                  <span className="text-[10px] font-bold tracking-widest">
                    {new Date(
                      `${nextAppointment.date}T00:00:00`,
                    ).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="font-heading text-2xl font-semibold leading-6">
                    {new Date(
                      `${nextAppointment.date}T00:00:00`,
                    ).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">StyleSync</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                    <Clock3 size={13} />
                    {formatTime(nextAppointment.time)}
                  </p>
                </div>
              </div>
            )}
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
                  Your upcoming salon visits
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-[#e45c78]">
                {upcomingAppointments.length} upcoming
              </span>
            </div>
            <div className="divide-y divide-rose-50">
              {upcomingAppointments.slice(0, 4).map((appointment, index) => (
                <article
                  key={
                    appointment._id ??
                    `${appointment.date}-${appointment.time}-${index}`
                  }
                  className="flex flex-wrap items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#fff3f2] text-[#e45c78]">
                    <span className="text-[10px] font-bold tracking-widest">
                      {new Date(`${appointment.date}T00:00:00`)
                        .toLocaleDateString("en-US", { month: "short" })
                        .toUpperCase()}
                    </span>
                    <span className="font-heading text-xl font-semibold leading-5">
                      {new Date(`${appointment.date}T00:00:00`).getDate()}
                    </span>
                  </div>
                  <div className="min-w-40 flex-1">
                    <h3 className="text-sm font-semibold text-[#493943]">
                      {appointment.serviceName || "Salon service"}
                    </h3>
                    <p className="mt-1 text-xs text-[#9a8d95]">StyleSync</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#756a72]">
                      <CalendarDays size={13} className="text-[#e77a8e]" />
                      {formatAppointmentDate(
                        appointment.date,
                        appointment.time,
                      )}
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
                </article>
              ))}
              {upcomingAppointments.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <p className="font-medium text-[#493943]">
                    No upcoming appointments
                  </p>
                  <Button
                    render={<Link href="/services" />}
                    variant="ghost"
                    className="mt-2 text-[#df5574]"
                  >
                    Browse services <ArrowRight />
                  </Button>
                </div>
              )}
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
                Your appointment history is ready whenever you need it.
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-rose-50 pt-4">
                <span className="text-xs text-[#9a8d95]">Appointments made</span>
                <span className="font-heading text-lg font-semibold text-[#493943]">
                  {bookings.length}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-rose-100/70 bg-linear-to-br from-[#fff4f1] to-[#f8f0ff] p-5 sm:p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/80 text-[#e96b83] shadow-sm">
                <Sparkles aria-hidden="true" size={18} />
              </span>
              <h2 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
                Your next glow-up?
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#8e7e86]">
                Explore available services and find your next favorite.
              </p>
              <Button
                render={<Link href="/services" />}
                variant="ghost"
                className="mt-3 h-9 rounded-xl px-0 text-sm font-semibold text-[#df5574] hover:bg-transparent hover:text-[#c94162]"
              >
                Explore services <ArrowRight />
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
