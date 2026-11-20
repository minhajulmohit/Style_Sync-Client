import Link from "next/link";
import { ArrowLeft, Home, Scissors, Search } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import SiteFooter from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf8]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl gradient-surface shadow-xl shadow-rose-200/60">
            <Scissors aria-hidden="true" size={36} className="text-white" />
            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-white text-rose-500 shadow-md">
              <Search size={14} strokeWidth={2.5} />
            </span>
          </div>

          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-[#e45c78]">
            Error 404
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#352a31] sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8e7e86] sm:text-base">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The link
            might be broken, or the page may have been moved or removed.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/" />}
              className="h-11 rounded-xl gradient-surface px-6 text-sm font-medium shadow-md shadow-rose-200/50 hover:opacity-95"
            >
              <Home size={16} />
              Back to Home
            </Button>

            <Button
              render={<Link href="/services" />}
              variant="outline"
              className="h-11 rounded-xl border-rose-200 bg-white px-6 text-sm font-medium text-[#493943] hover:bg-rose-50 hover:text-[#c65371]"
            >
              <ArrowLeft size={16} />
              Browse Services
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
