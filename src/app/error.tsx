"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// পুরো site এর error boundary
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-4 py-16">
      <section
        role="alert"
        className="w-full max-w-md rounded-3xl border border-rose-100/70 bg-white p-8 text-center shadow-lg shadow-rose-100/50"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-[#e45c78]">
          <TriangleAlert aria-hidden="true" size={26} />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-[#352a31]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8e7e86]">
          We could not load this page right now. Please try again.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#e45c78] px-5 text-sm font-semibold text-white transition hover:bg-[#d64f70]"
          >
            <RefreshCw aria-hidden="true" size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl border border-rose-200 px-5 text-sm font-semibold text-[#493943] transition hover:bg-rose-50"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
