import Link from "next/link";
import { Scissors } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white px-4 py-8 sm:px-7 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-[#493943]"
          >
            <Scissors aria-hidden="true" size={18} className="text-[#c65371]" />
            StyleSync
          </Link>
          <p className="mt-1 text-xs text-[#8e7e86]">
            Salon bookings, made simple.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="text-sm text-[#756a72] transition hover:text-[#c65371]"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-sm text-[#756a72] transition hover:text-[#c65371]"
          >
            Services
          </Link>
          <Link
            href="/signin"
            className="text-sm text-[#756a72] transition hover:text-[#c65371]"
          >
            Sign in
          </Link>
        </nav>
        <p className="text-xs text-[#9a8d95]">© StyleSync</p>
      </div>
    </footer>
  );
}
