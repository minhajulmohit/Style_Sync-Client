import { Suspense } from "react";
import { BadgeDollarSign } from "lucide-react";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Transaction = {
  _id?: string;
  sessionId?: string;
  stripeSessionId?: string;
  status?: string;
  customer_email?: string;
  userId?: string;
  payment_intent?: string;
  payment_status?: string;
  payment_date?: string | Date;
  amount_total?: number | null;
  currency?: string | null;
  bookingId?: string;
  serviceName?: string;
  appointmentDate?: string;
};

type BookingInfo = {
  _id?: string;
  serviceName?: string;
  date?: string;
  time?: string;
};

type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
};

async function getTransactions(): Promise<Transaction[]> {
  const response = await authenticatedFetch(`${baseUrl}/payments`);

  if (!response.ok) {
    throw new Error(`Could not load transactions (HTTP ${response.status}).`);
  }

  const transactions: Transaction[] = await response.json();
  return transactions;
}

async function getBookings(): Promise<Map<string, BookingInfo>> {
  try {
    const response = await authenticatedFetch(`${baseUrl}/bookings`);
    if (!response.ok) return new Map();
    const bookings: BookingInfo[] = await response.json();
    const map = new Map<string, BookingInfo>();
    for (const b of bookings) {
      if (b._id) map.set(b._id, b);
    }
    return map;
  } catch {
    return new Map();
  }
}

async function getUsers(): Promise<Map<string, AdminUser>> {
  try {
    const response = await authenticatedFetch(`${baseUrl}/users`);
    if (!response.ok) return new Map();
    const users: AdminUser[] = await response.json();
    const map = new Map<string, AdminUser>();
    for (const u of users) {
      if (u._id) map.set(u._id, u);
      if (u.id) map.set(u.id, u);
    }
    return map;
  } catch {
    return new Map();
  }
}

function formatDate(value?: string | Date) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// লম্বা Stripe session id ছোট করে দেখাই: cs_test_a1b2...x9y8
function shortSessionId(sessionId?: string) {
  if (!sessionId) return "—";
  if (sessionId.length <= 20) return sessionId;
  return `${sessionId.slice(0, 14)}...${sessionId.slice(-6)}`;
}

// Stripe "paid" / "complete" দুটোকেই "Paid" দেখাই
function getPaymentStatusLabel(transaction: Transaction) {
  const status = (
    transaction.payment_status ||
    transaction.status ||
    ""
  ).toLowerCase();

  if (status === "paid" || status === "complete") return "Paid";
  if (status === "unpaid") return "Unpaid";
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatAmount(amount?: number | null, currency?: string | null) {
  if (amount === null || amount === undefined) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() ?? "USD",
  }).format(amount / 100);
}

export default function TransactionsPage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Verified payment records
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            Review payment records received from the payment service.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm shadow-rose-100/40">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-rose-50 last:border-0">
                    <div className="h-4 w-40 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-36 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-28 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-4 w-20 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-rose-100/70" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <TransactionsTable />
        </Suspense>
      </div>
    </div>
  );
}

async function TransactionsTable() {
  const [transactions, bookingsMap, usersMap] = await Promise.all([
    getTransactions(),
    getBookings(),
    getUsers(),
  ]);

  return (
    <section
      aria-label="Transactions"
      className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40"
    >
      <div className="flex items-center justify-between border-b border-rose-100/70 px-5 py-4">
        <h2 className="font-heading font-semibold text-[#493943]">
          Payment records
        </h2>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-[#b34d68]">
          {transactions.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100/70 bg-rose-50/50 text-xs text-[#8e7e86]">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Related Service</th>
              <th className="px-4 py-3 font-medium">Appointment Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Stripe Session ID</th>
              <th className="px-4 py-3 font-medium">Payment Status</th>
              <th className="px-4 py-3 font-medium">Transaction Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {transactions.map((transaction, index) => {
              const customer = transaction.userId ? usersMap.get(transaction.userId) : undefined;
              const booking = transaction.bookingId ? bookingsMap.get(transaction.bookingId) : undefined;
              const relatedService = transaction.serviceName || booking?.serviceName || (transaction.bookingId ? "Salon Service" : "—");
              const appointmentDate = transaction.appointmentDate || (booking?.date ? `${booking.date} · ${booking.time}` : "—");
              const sessionId = transaction.sessionId || transaction.stripeSessionId;
              const statusLabel = getPaymentStatusLabel(transaction);

              return (
                <tr
                  key={
                    transaction._id ??
                    transaction.sessionId ??
                    transaction.payment_intent ??
                    index
                  }
                  className="text-[#493943]"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#493943]">
                      {customer?.name || "Customer"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#9a8d95]">
                      {transaction.customer_email || customer?.email || transaction.userId || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {relatedService}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#756a72]">
                    {appointmentDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-[#e45c78]">
                    {formatAmount(transaction.amount_total, transaction.currency)}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium uppercase text-[#756a72]">
                    {transaction.currency || "usd"}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-[#756a72]">
                    <span title={sessionId}>{shortSessionId(sessionId)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusLabel === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#756a72]">
                    {formatDate(transaction.payment_date)}
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center">
                  <BadgeDollarSign
                    aria-hidden="true"
                    className="mx-auto mb-3 text-[#d3b8c0]"
                    size={28}
                  />
                  <p className="font-medium text-[#493943]">
                    No transactions found
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
