import { Suspense } from "react";
import { TablePageSkeleton } from "@/components/skeletons";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAppointmentStatus } from "@/lib/actions/admin-appointments";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type AdminBooking = {
  _id?: string;
  userId: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  date: string;
  time: string;
  message?: string;
  status: string;
  paymentStatus?: string;
  cancelledBy?: string;
  createdAt?: string | Date;
};

type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
};

async function getAdminAppointments(): Promise<AdminBooking[]> {
  const response = await authenticatedFetch(`${baseUrl}/bookings`);

  if (!response.ok) {
    throw new Error(
      `Could not load appointments (HTTP ${response.status}).`,
    );
  }

  const appointments: AdminBooking[] = await response.json();
  return appointments;
}

async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await authenticatedFetch(`${baseUrl}/users`);

  if (!response.ok) {
    throw new Error(`Could not load customers (HTTP ${response.status}).`);
  }

  const users: AdminUser[] = await response.json();
  return users;
}

function getStatusStyle(status: string) {
  if (status === "Confirmed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "Cancelled") {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-amber-50 text-amber-700";
}

function formatRequestDate(value?: string | Date) {
  if (!value) return "—";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageAppointmentsPage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Salon booking requests
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            Manage Appointments
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            Review customer requests and update pending appointments.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm shadow-rose-100/40">
              <div className="mb-4 flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-rose-100/70" />
                ))}
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-rose-50 last:border-0">
                    <div className="h-4 w-36 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-44 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-28 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-20 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-7 w-16 animate-pulse rounded-full bg-rose-100/70" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <AppointmentsTable />
        </Suspense>
      </div>
    </div>
  );
}

async function AppointmentsTable() {
  const [appointments, users] = await Promise.all([
    getAdminAppointments(),
    getAdminUsers(),
  ]);
  const usersById = new Map<string, AdminUser>();

  for (const user of users) {
    if (user._id) usersById.set(user._id, user);
    if (user.id) usersById.set(user.id, user);
  }

  const sortedAppointments = [...appointments].sort((first, second) =>
    `${first.date} ${first.time}`.localeCompare(
      `${second.date} ${second.time}`,
    ),
  );

  return (
    <section
      aria-label="Appointments"
      className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100/70 bg-rose-50/50 text-xs text-[#8e7e86]">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Appointment Date &amp; Time</th>
              <th className="px-4 py-3 font-medium">Request Date</th>
              <th className="px-4 py-3 font-medium">Customer Message</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Cancelled By</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {sortedAppointments.map((appointment, index) => {
              const customer = usersById.get(appointment.userId);

              return (
                <tr
                  key={
                    appointment._id ??
                    `${appointment.userId}-${appointment.date}-${appointment.time}-${index}`
                  }
                  className="text-[#493943]"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium">
                      {customer?.name || "Customer"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#9a8d95]">
                      {customer?.email || appointment.userId}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {appointment.serviceName || "Service"}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#e45c78] whitespace-nowrap">
                    {appointment.servicePrice !== undefined && appointment.servicePrice !== null
                      ? `$${appointment.servicePrice}`
                      : "—"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {appointment.date} · {appointment.time}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#756a72]">
                    {formatRequestDate(appointment.createdAt)}
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p
                      className="line-clamp-2 text-xs text-[#756a72]"
                      title={appointment.message || ""}
                    >
                      {appointment.message?.trim() ? appointment.message : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        appointment.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appointment.paymentStatus || "Unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize text-xs text-[#9a8d95]">
                    {appointment.cancelledBy || "—"}
                  </td>
                  <td className="px-4 py-4">
                    {appointment._id &&
                    (appointment.status === "Pending" ||
                      appointment.status === "Confirmed") ? (
                      <div className="flex items-center gap-2">
                        {appointment.status === "Pending" && (
                          <form action={updateAppointmentStatus}>
                            <input
                              type="hidden"
                              name="bookingId"
                              value={appointment._id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="Confirmed"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Confirm
                            </Button>
                          </form>
                        )}
                        <form action={updateAppointmentStatus}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={appointment._id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="Cancelled"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50"
                          >
                            Cancel
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-[#9a8d95]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {sortedAppointments.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center">
                  <CalendarDays
                    aria-hidden="true"
                    className="mx-auto mb-3 text-[#d3b8c0]"
                    size={28}
                  />
                  <p className="font-medium text-[#493943]">
                    No appointments found
                  </p>
                  <p className="mt-1 text-sm text-[#9a8d95]">
                    Customer requests will appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
