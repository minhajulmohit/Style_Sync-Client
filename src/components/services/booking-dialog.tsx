"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  createBooking,
  getBookedSlots,
  type BookedSlot,
} from "@/lib/actions/bookings";
import type { ServiceRecord } from "@/types/services";

type BookingForm = {
  date: string;
  time: string;
  message: string;
  bookedSlots: BookedSlot[] | null;
  isLoading: boolean;
  isSubmitting: boolean;
};

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isTimeUnavailable(
  time: string,
  duration: number,
  bookedSlots: BookedSlot[],
) {
  const start = timeToMinutes(time);
  const end = start + duration;

  return bookedSlots.some((bookedSlot) => {
    const bookedStart = timeToMinutes(bookedSlot.time);
    const bookedEnd = bookedStart + bookedSlot.duration;
    return start < bookedEnd && bookedStart < end;
  });
}

function getToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function isPastSlot(date: string, time: string) {
  const todayStr = getToday();
  if (date < todayStr) return true;
  if (date > todayStr) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return timeToMinutes(time) <= currentMinutes;
}

export function BookingDialog({
  service,
  serviceId,
  userId,
  onClose,
}: {
  service: ServiceRecord;
  serviceId: string;
  userId?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BookingForm>({
    date: getToday(),
    time: "",
    message: "",
    bookedSlots: null,
    isLoading: true,
    isSubmitting: false,
  });

  useEffect(() => {
    let isCurrent = true;

    getBookedSlots(serviceId, form.date)
      .then((bookedSlots) => {
        if (isCurrent) {
          setForm((current) => ({ ...current, bookedSlots }));
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load booked times:", error);
        if (isCurrent) {
          toast.add({
            type: "error",
            title: "Could not load booked times",
            description:
              error instanceof Error
                ? error.message
                : "Please try again.",
          });
        }
      })
      .finally(() => {
        if (isCurrent) {
          setForm((current) => ({ ...current, isLoading: false }));
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [serviceId, form.date]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      toast.add({
        type: "error",
        title: "Sign in required",
        description: "Please sign in before booking a service.",
      });
      return;
    }

    if (!form.bookedSlots) {
      toast.add({
        type: "error",
        title: "Availability not loaded",
        description: "Please try again before sending your booking.",
      });
      return;
    }

    if (isPastSlot(form.date, form.time)) {
      toast.add({
        type: "error",
        title: "Cannot select past time",
        description: "Please select a future time slot for today.",
      });
      return;
    }

    if (isTimeUnavailable(form.time, service.duration, form.bookedSlots)) {
      toast.add({
        type: "error",
        title: "Time already booked",
        description: "Please choose another time.",
      });
      return;
    }

    setForm((current) => ({ ...current, isSubmitting: true }));

    try {
      await createBooking({
        userId,
        serviceId,
        date: form.date,
        time: form.time,
        message: form.message.trim(),
      });
    } catch (error) {
      console.error("Could not create booking:", error);
      toast.add({
        type: "error",
        title: "Could not send booking",
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });

      try {
        const bookedSlots = await getBookedSlots(serviceId, form.date);
        setForm((current) => ({ ...current, bookedSlots }));
      } catch (availabilityError) {
        console.error("Could not refresh booked times:", availabilityError);
        toast.add({
          type: "error",
          title: "Could not refresh availability",
          description: "Please close and reopen the booking form.",
        });
      }
      return;
    } finally {
      setForm((current) => ({ ...current, isSubmitting: false }));
    }

    toast.add({
      type: "success",
      title: "Booking sent",
      description: `${service.serviceName} on ${form.date} at ${form.time}.`,
    });
    onClose();
    router.push("/dashboard/customer/my-appointments");
  };

  const timeSlots = Array.from({ length: 48 }, (_, index) => {
    const minutes = index * 30;
    const hours = Math.floor(minutes / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  }).filter((time) => timeToMinutes(time) + service.duration <= 24 * 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close booking dialog"
        className="absolute inset-0 size-full cursor-default bg-black/40"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-4 rounded-full p-2 text-xl leading-none text-[#8e7e86] hover:bg-rose-50"
        >
          &times;
        </button>
        <p className="text-sm font-medium text-[#a28d97]">Book a service</p>
        <h2
          id="booking-title"
          className="mt-1 pr-8 font-heading text-xl font-semibold text-[#352a31]"
        >
          {service.serviceName}
        </h2>
        <p className="mt-1 text-sm text-[#8e7e86]">
          Select a date and time. Times are shown in 24-hour format.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#594a53]">
              Date
              <input
                type="date"
                required
                disabled={form.isSubmitting}
                min={getToday()}
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    date: event.target.value,
                    time: "",
                    bookedSlots: null,
                    isLoading: true,
                  }))
                }
                className="h-11 w-full rounded-xl border border-rose-100 bg-[#fffdfc] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[#e96b83]"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#594a53]">
              Time
              <select
                required
                value={form.time}
                disabled={form.isLoading || form.isSubmitting || !form.bookedSlots}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-rose-100 bg-[#fffdfc] px-3 text-sm disabled:opacity-60"
              >
                <option value="">
                  {form.isLoading ? "Loading times..." : "Select a time"}
                </option>
                {timeSlots.map((time) => {
                  const isPast = isPastSlot(form.date, time);
                  const isBooked = form.bookedSlots
                    ? isTimeUnavailable(
                        time,
                        service.duration,
                        form.bookedSlots,
                      )
                    : false;
                  const isDisabled = isPast || isBooked;

                  return (
                    <option
                      key={time}
                      value={time}
                      disabled={isDisabled}
                    >
                      {time}
                      {isPast
                        ? " — Past time"
                        : isBooked
                        ? " — Unavailable"
                        : ""}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div className="rounded-xl bg-[#fff7f4] p-4">
            <p className="text-sm font-medium text-[#594a53]">
              Booked times for this date
            </p>
            {form.isLoading ? (
              <p className="mt-1 text-sm text-[#8e7e86]">Loading...</p>
            ) : form.bookedSlots === null ? (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                Booked times could not be loaded.
              </p>
            ) : form.bookedSlots.length ? (
              <p className="mt-1 text-sm text-[#b34d68]">
                {form.bookedSlots
                  .slice()
                  .sort((first, second) =>
                    first.time.localeCompare(second.time),
                  )
                  .map((bookedSlot) => `${bookedSlot.time} (${bookedSlot.duration} min)`)
                  .join(", ")}
              </p>
            ) : (
              <p className="mt-1 text-sm text-[#8e7e86]">
                No times have been booked yet.
              </p>
            )}
          </div>

          <label className="block space-y-2 text-sm font-medium text-[#594a53]">
            Additional message{" "}
            <span className="font-normal text-[#9a8d95]">(optional)</span>
            <textarea
              value={form.message}
              maxLength={500}
              rows={3}
              disabled={form.isSubmitting}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              placeholder="Anything you would like us to know?"
              className="w-full resize-y rounded-xl border border-rose-100 bg-[#fffdfc] px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[#e96b83]"
            />
          </label>

          {!userId && (
            <p className="text-sm text-[#756a72]">
              Please{" "}
              <Link
                className="font-semibold text-[#df5574] underline"
                href="/signin"
              >
                sign in
              </Link>{" "}
              to submit a booking.
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !userId ||
                form.isLoading ||
                form.isSubmitting ||
                !form.bookedSlots ||
                !form.time ||
                (form.bookedSlots
                  ? isTimeUnavailable(
                      form.time,
                      service.duration,
                      form.bookedSlots,
                    )
                  : true)
              }
              className="gradient-surface hover:opacity-90"
            >
              {form.isSubmitting ? "Sending..." : "Send booking"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
