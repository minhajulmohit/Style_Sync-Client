"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  Clock3,
  Eye,
  ImageIcon,
  Scissors,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { getServices } from "@/lib/api/services"
import {
  cancelBooking,
  getBookings,
  type BookingRecord,
} from "@/lib/actions/bookings"
import type { ServiceRecord } from "@/types/services"

type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled"
type AppointmentFilter = "All" | AppointmentStatus

type Appointment = {
  id: string
  bookingId?: string
  serviceName: string
  image?: string
  category?: string
  date: string
  time: string
  requestDate?: string | Date
  price?: number
  message?: string
  status: string
  paymentStatus: string
  cancelledBy?: "user" | "admin"
}

type PageState = {
  userId: string | null
  appointments: Appointment[]
  isLoading: boolean
  error: string
}

const filters: AppointmentFilter[] = [
  "All",
  "Pending",
  "Confirmed",
  "Cancelled",
]

function formatDate(date: string) {
  const parsedDate = new Date(date.includes("T") ? date : `${date}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatRequestDate(value?: string | Date) {
  if (!value) {
    return "—"
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return "—"
  }

  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function normalizeStatus(status: string) {
  const normalized = status.trim().toLowerCase()

  if (normalized === "pending") return "Pending"
  if (normalized === "confirmed") return "Confirmed"
  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled"
  }

  return status
}

function normalizeCancelledBy(cancelledBy?: string): "user" | "admin" | undefined {
  const normalized = cancelledBy?.trim().toLowerCase()

  if (normalized === "user" || normalized === "admin") {
    return normalized
  }

  return undefined
}

function getAppointmentId(booking: BookingRecord) {
  return (
    booking._id ??
    `${booking.serviceId}-${booking.date}-${booking.time}`
  )
}

function getAppointment(
  booking: BookingRecord,
  servicesById: Map<string, ServiceRecord>,
): Appointment {
  const service = servicesById.get(booking.serviceId)

  return {
    id: getAppointmentId(booking),
    bookingId: booking._id,
    serviceName: service?.serviceName ?? booking.serviceName ?? "Service unavailable",
    image: service?.image,
    category: service?.category,
    date: booking.date,
    time: booking.time,
    requestDate: booking.createdAt,
    price: booking.servicePrice ?? service?.price,
    message: booking.message,
    status: normalizeStatus(booking.status),
    paymentStatus: booking.paymentStatus ?? "Unpaid",
    cancelledBy: normalizeCancelledBy(booking.cancelledBy),
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-rose-50 text-rose-700",
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const isPaid = status.toLowerCase() === "paid"

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isPaid
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  )
}

function CancellationLabel({
  cancelledBy,
}: {
  cancelledBy?: "user" | "admin"
}) {
  if (!cancelledBy) {
    return null
  }

  return (
    <p className="mt-1 text-[11px] font-medium text-[#8e7e86]">
      Cancelled by {cancelledBy}
    </p>
  )
}

function ServiceImage({ appointment }: { appointment: Appointment }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-rose-50 via-orange-50 to-purple-50">
      {appointment.image ? (
        <Image
          src={appointment.image}
          alt={appointment.serviceName}
          fill
          unoptimized
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-[#e77a8e]">
          <ImageIcon aria-hidden="true" size={20} />
        </div>
      )}
    </div>
  )
}

function AppointmentActions({
  appointment,
  isCancelling,
  onCancel,
  onViewDetails,
}: {
  appointment: Appointment
  isCancelling: boolean
  onCancel: (appointment: Appointment) => void
  onViewDetails: (appointment: Appointment) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {appointment.status === "Pending" && appointment.bookingId && (
        <Button
          type="button"
          variant="outline"
          disabled={isCancelling}
          onClick={() => onCancel(appointment)}
          className="h-9 rounded-xl border-rose-100 text-[#b34d68] hover:bg-rose-50"
        >
          {isCancelling ? "Cancelling..." : "Cancel Request"}
        </Button>
      )}
      {appointment.status === "Confirmed" &&
        appointment.paymentStatus === "Unpaid" &&
        appointment.bookingId && (
          <form action="/api/checkout_sessions" method="POST">
            <input
              type="hidden"
              name="bookingId"
              value={appointment.bookingId}
            />
            <Button
              type="submit"
              className="h-9 rounded-xl bg-[#e45c78] text-white hover:bg-[#d64f70]"
            >
              Pay Now
            </Button>
          </form>
        )}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onViewDetails(appointment)}
        className="h-9 rounded-xl text-[#756a72] hover:bg-rose-50 hover:text-[#e45c78]"
      >
        <Eye aria-hidden="true" />
        View Details
      </Button>
    </div>
  )
}

function AppointmentDetails({
  appointment,
  onClose,
}: {
  appointment: Appointment
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close appointment details"
        className="absolute inset-0 size-full cursor-default bg-black/40"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-details-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full text-[#8e7e86] hover:bg-rose-50"
        >
          <X aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-3 pr-9">
          <ServiceImage appointment={appointment} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#a28d97]">
              Appointment details
            </p>
            <h2
              id="appointment-details-title"
              className="mt-1 font-heading text-lg font-semibold text-[#352a31]"
            >
              {appointment.serviceName}
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-xs text-[#9a8d95]">Category</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#493943]">
              <Scissors aria-hidden="true" size={15} className="text-[#e77a8e]" />
              {appointment.category ?? "Not available"}
            </p>
          </div>
          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-xs text-[#9a8d95]">Date &amp; time</p>
            <p className="mt-1 text-sm font-medium text-[#493943]">
              {formatDate(appointment.date)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#756a72]">
              <Clock3 aria-hidden="true" size={13} />
              {appointment.time}
            </p>
          </div>
          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-xs text-[#9a8d95]">Request date</p>
            <p className="mt-1 text-sm font-medium text-[#493943]">
              {formatRequestDate(appointment.requestDate)}
            </p>
          </div>
          {appointment.price !== undefined && (
            <div className="rounded-xl bg-[#fff7f4] p-4">
              <p className="text-xs text-[#9a8d95]">Price</p>
              <p className="mt-1 text-lg font-semibold text-[#e45c78]">
                ${appointment.price.toFixed(2)}
              </p>
            </div>
          )}
          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-xs text-[#9a8d95]">Appointment status</p>
            <div className="mt-2">
              <StatusBadge status={appointment.status} />
              {appointment.status === "Cancelled" && (
                <CancellationLabel cancelledBy={appointment.cancelledBy} />
              )}
            </div>
          </div>
          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-xs text-[#9a8d95]">Payment status</p>
            <div className="mt-2">
              <PaymentStatusBadge status={appointment.paymentStatus} />
            </div>
          </div>
          {appointment.message && (
            <div className="rounded-xl bg-[#fff7f4] p-4 sm:col-span-2">
              <p className="text-xs text-[#9a8d95]">Your message</p>
              <p className="mt-1 whitespace-pre-line text-sm text-[#493943]">
                {appointment.message}
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-rose-100 text-[#b34d68] hover:bg-rose-50"
          >
            Close
          </Button>
        </div>
      </section>
    </div>
  )
}

export default function MyAppointmentsPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession()
  const [pageState, setPageState] = useState<PageState>({
    userId: null,
    appointments: [],
    isLoading: true,
    error: "",
  })
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>("All")
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const userId = session?.user.id

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (!userId) {
      return
    }

    let isCurrent = true

    const loadAppointments = async () => {
      try {
        const query = new URLSearchParams({ userId })
        const [bookings, services] = await Promise.all([
          getBookings(query.toString()),
          getServices(),
        ])
        const servicesById = new Map(
          services.flatMap((service) => {
            const serviceId = service.id ?? service._id
            return serviceId ? [[serviceId, service] as const] : []
          }),
        )
        const appointments = bookings.map((booking) =>
          getAppointment(booking, servicesById),
        )

        if (isCurrent) {
          setPageState({ userId, appointments, isLoading: false, error: "" })
        }
      } catch (error) {
        console.error("Could not load appointments:", error)
        if (isCurrent) {
          setPageState({
            userId,
            appointments: [],
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Could not load appointments.",
          })
        }
      }
    }

    void loadAppointments()

    return () => {
      isCurrent = false
    }
  }, [isSessionPending, userId])

  const visibleAppointments =
    activeFilter === "All"
      ? pageState.appointments
      : pageState.appointments.filter(
          (appointment) => appointment.status === activeFilter,
        )

  const handleCancel = async (appointment: Appointment) => {
    if (
      appointment.status !== "Pending" ||
      !appointment.bookingId ||
      !userId ||
      cancellingId
    ) {
      return
    }

    setCancellingId(appointment.id)

    try {
      await cancelBooking(appointment.bookingId, userId)
      setPageState((current) => ({
        ...current,
        appointments: current.appointments.map((item) =>
          item.id === appointment.id
            ? { ...item, status: "Cancelled", cancelledBy: "user" }
            : item,
        ),
      }))
      toast.add({
        type: "success",
        title: "Appointment cancelled",
        description: "Your pending request has been cancelled.",
      })
    } catch (error) {
      console.error("Could not cancel appointment:", error)
      toast.add({
        type: "error",
        title: "Could not cancel appointment",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setCancellingId(null)
    }
  }
  const isLoading =
    isSessionPending ||
    Boolean(userId && (pageState.isLoading || pageState.userId !== userId))
  const pageError =
    !isSessionPending && !userId
      ? "Please sign in to view your appointments."
      : pageState.userId === userId
        ? pageState.error
        : ""

  return (
    <main className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Your personal space
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            My Appointments
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            View your salon appointment requests.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
          <div className="flex flex-col gap-4 border-b border-rose-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#352a31]">
                Appointment requests
              </h2>
              {!isLoading && !pageError && (
                <p className="mt-1 text-xs text-[#9a8d95]">
                  {pageState.userId === userId
                    ? pageState.appointments.length
                    : 0}{" "}
                  appointments in your list
                </p>
              )}
            </div>
            <div
              aria-label="Filter appointments by status"
              className="flex gap-2 overflow-x-auto pb-1 sm:pb-0"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition ${
                    activeFilter === filter
                      ? "bg-[#e45c78] text-white shadow-sm shadow-rose-200"
                      : "bg-rose-50 text-[#8e7e86] hover:bg-rose-100 hover:text-[#b34d68]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center text-sm text-[#8e7e86]">
              Loading your appointments...
            </div>
          ) : pageError ? (
            <p
              role="alert"
              className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              {pageError}
            </p>
          ) : visibleAppointments.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-[#e77a8e]">
                <CalendarDays aria-hidden="true" size={24} />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
                No appointments found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-[#8e7e86]">
                {activeFilter === "All"
                  ? "You have not booked any services yet."
                  : `You have no ${activeFilter.toLowerCase()} appointments.`}
              </p>
              {activeFilter === "All" && (
                <Link
                  href="/services"
                  className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#e45c78] px-4 text-sm font-semibold text-white transition hover:bg-[#d64f70]"
                >
                  Browse services
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1180px] text-left">
                  <thead className="bg-[#fffaf8] text-xs font-medium text-[#9a8d95]">
                    <tr>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Date &amp; time</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Request date</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Payment</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {visibleAppointments.map((appointment) => (
                      <tr key={appointment.id} className="align-middle">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ServiceImage appointment={appointment} />
                            <p className="max-w-56 truncate text-sm font-semibold text-[#493943]">
                              {appointment.serviceName}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#756a72]">
                          {appointment.category ?? "—"}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-[#493943]">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8e7e86]">
                            <Clock3 aria-hidden="true" size={13} />
                            {appointment.time}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-[#493943]">
                          {appointment.price !== undefined
                            ? `$${appointment.price.toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[#756a72]">
                          {formatRequestDate(appointment.requestDate)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={appointment.status} />
                          {appointment.status === "Cancelled" && (
                            <CancellationLabel
                              cancelledBy={appointment.cancelledBy}
                            />
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <PaymentStatusBadge
                            status={appointment.paymentStatus}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <AppointmentActions
                            appointment={appointment}
                            isCancelling={cancellingId === appointment.id}
                            onCancel={handleCancel}
                            onViewDetails={setSelectedAppointment}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-rose-50 md:hidden">
                {visibleAppointments.map((appointment) => (
                  <article key={appointment.id} className="space-y-4 p-5">
                    <div className="flex items-center gap-3">
                      <ServiceImage appointment={appointment} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-[#493943]">
                          {appointment.serviceName}
                        </h3>
                        <p className="mt-1 text-xs text-[#9a8d95]">
                          {appointment.category ?? "Category unavailable"}
                        </p>
                      </div>
                      {appointment.price !== undefined && (
                        <p className="shrink-0 text-sm font-semibold text-[#e45c78]">
                          ${appointment.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl bg-[#fffaf8] p-3">
                      <div>
                        <p className="text-[11px] text-[#9a8d95]">
                          Date &amp; time
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#493943]">
                          {formatDate(appointment.date)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#756a72]">
                          <Clock3 aria-hidden="true" size={12} />
                          {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#9a8d95]">
                          Request date
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#493943]">
                          {formatRequestDate(appointment.requestDate)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] text-[#9a8d95]">
                          Status
                        </p>
                        <StatusBadge status={appointment.status} />
                        {appointment.status === "Cancelled" && (
                          <CancellationLabel
                            cancelledBy={appointment.cancelledBy}
                          />
                        )}
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] text-[#9a8d95]">
                          Payment
                        </p>
                        <PaymentStatusBadge
                          status={appointment.paymentStatus}
                        />
                      </div>
                    </div>
                    <AppointmentActions
                      appointment={appointment}
                      isCancelling={cancellingId === appointment.id}
                      onCancel={handleCancel}
                      onViewDetails={setSelectedAppointment}
                    />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </main>
  )
}
