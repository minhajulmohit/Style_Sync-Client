import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";
import { getStripe } from "@/lib/stripe";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type PaymentPageProps = {
  searchParams: Promise<{
    session_id?: string;
    cancelled?: string;
  }>;
};

type VerificationResult = {
  success?: boolean;
  message?: string;
};

function PaymentStatus({
  isSuccess,
  title,
  message,
  bookingId,
  sessionId,
  amount,
}: {
  isSuccess: boolean;
  title: string;
  message: string;
  bookingId?: string;
  sessionId?: string;
  amount?: string;
}) {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-[#fffaf8] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-rose-100/70 bg-white p-7 text-center shadow-lg shadow-rose-100/50 sm:p-9">
        <span
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 aria-hidden="true" size={28} />
          ) : (
            <CircleAlert aria-hidden="true" size={28} />
          )}
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-[#352a31]">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8e7e86]">{message}</p>
        {amount && (
          <p className="mt-5 text-2xl font-semibold text-[#e45c78]">
            {amount}
          </p>
        )}
        {bookingId && (
          <p className="mt-4 text-xs text-[#9a8d95]">
            Appointment: <span className="font-mono">{bookingId}</span>
          </p>
        )}
        {sessionId && (
          <p className="mt-2 break-all text-xs text-[#9a8d95]">
            Stripe session: <span className="font-mono">{sessionId}</span>
          </p>
        )}
        <Link
          href="/dashboard/customer/my-appointments"
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e45c78] px-5 text-sm font-semibold text-white transition hover:bg-[#d64f70]"
        >
          Back to appointments
        </Link>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage({ searchParams }: PaymentPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-[#fffaf8] px-4 text-sm text-[#8e7e86]">
          Checking payment...
        </main>
      }
    >
      <PaymentResult searchParams={searchParams} />
    </Suspense>
  );
}

async function PaymentResult({ searchParams }: PaymentPageProps) {
  const { session_id: sessionId, cancelled } = await searchParams;

  if (cancelled === "1") {
    return (
      <PaymentStatus
        isSuccess={false}
        title="Payment cancelled"
        message="Your appointment is still unpaid. You can try the payment again from My Appointments."
      />
    );
  }

  if (!sessionId) {
    return (
      <PaymentStatus
        isSuccess={false}
        title="Payment session not found"
        message="Return to My Appointments and start checkout again."
      />
    );
  }

  const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId);
  if (stripeSession.status !== "complete" || stripeSession.payment_status !== "paid") {
    return (
      <PaymentStatus
        isSuccess={false}
        title="Payment not completed"
        message="Stripe has not confirmed this payment. Your appointment remains unpaid."
        sessionId={sessionId}
      />
    );
  }

  const response = await authenticatedFetch(
    `${baseUrl}/payment/success-verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    },
  );
  const result: VerificationResult = await response.json();

  if (!response.ok || !result.success) {
    return (
      <PaymentStatus
        isSuccess={false}
        title="Payment verification failed"
        message={
          result.message ||
          "Stripe received the payment, but the appointment could not be updated. Please contact support."
        }
        sessionId={sessionId}
      />
    );
  }

  const amount =
    stripeSession.amount_total !== null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: stripeSession.currency?.toUpperCase() ?? "USD",
        }).format(stripeSession.amount_total / 100)
      : undefined;

  return (
    <PaymentStatus
      isSuccess
      title="Payment successful"
      message="Your payment is verified and your appointment is marked as paid."
      bookingId={stripeSession.metadata?.bookingId}
      sessionId={sessionId}
      amount={amount}
    />
  );
}
