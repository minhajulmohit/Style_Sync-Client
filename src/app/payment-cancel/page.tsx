import Link from "next/link";
import { CircleX } from "lucide-react";

// Stripe এ Cancel চাপলে এই page এ আসবে
export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-rose-100/70 bg-white p-7 text-center shadow-lg shadow-rose-100/50 sm:p-9">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <CircleX aria-hidden="true" size={28} />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-[#352a31]">
          Payment cancelled
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8e7e86]">
          You cancelled the payment, so no money was charged. Your appointment
          is still <span className="font-semibold">Unpaid</span>. You can pay
          again anytime from My Appointments.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/customer/my-appointments"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#e45c78] px-5 text-sm font-semibold text-white transition hover:bg-[#d64f70]"
          >
            Back to My Appointments
          </Link>
          <Link
            href="/services"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 px-5 text-sm font-semibold text-[#493943] transition hover:bg-rose-50"
          >
            Browse Services
          </Link>
        </div>
      </section>
    </main>
  );
}
