import { Suspense } from "react";
import { BadgeDollarSign } from "lucide-react";
import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Transaction = {
  _id?: string;
  sessionId?: string;
  customer_email?: string;
  userId?: string;
  payment_intent?: string;
  payment_status?: string;
  payment_date?: string | Date;
};

async function getTransactions(): Promise<Transaction[]> {
  const response = await authenticatedFetch(`${baseUrl}/payments`);

  if (!response.ok) {
    throw new Error(`Could not load transactions (HTTP ${response.status}).`);
  }

  const transactions: Transaction[] = await response.json();
  return transactions;
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
            <div className="rounded-2xl border border-rose-100/70 bg-white p-8 text-center text-sm text-[#8e7e86]">
              Loading transactions...
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
  const transactions = await getTransactions();

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
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-rose-100/70 bg-rose-50/50 text-xs text-[#8e7e86]">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Payment intent</th>
              <th className="px-4 py-3 font-medium">Session ID</th>
              <th className="px-4 py-3 font-medium">Payment status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {transactions.map((transaction, index) => (
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
                  {transaction.customer_email || transaction.userId || "—"}
                </td>
                <td className="max-w-52 break-all px-4 py-4 text-xs">
                  {transaction.payment_intent || "—"}
                </td>
                <td className="max-w-52 break-all px-4 py-4 text-xs">
                  {transaction.sessionId || "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      transaction.payment_status?.toLowerCase() === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {transaction.payment_status || "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {formatDate(transaction.payment_date)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
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
