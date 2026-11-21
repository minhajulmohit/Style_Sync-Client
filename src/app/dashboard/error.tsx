"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 py-10 sm:px-7 lg:px-10">
      <section
        role="alert"
        className="mx-auto max-w-xl rounded-2xl border border-rose-100 bg-white p-7 text-center shadow-sm"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-[#e45c78]">
          <TriangleAlert aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold text-[#352a31]">
          Could not load dashboard data
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#8e7e86]">
          The server did not respond correctly. Please try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#e45c78] px-4 text-sm font-semibold text-white transition hover:bg-[#d64f70]"
          >
            <RefreshCw aria-hidden="true" size={15} />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-xl border border-rose-200 px-4 text-sm font-semibold text-[#493943] transition hover:bg-rose-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
