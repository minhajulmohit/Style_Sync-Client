import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/types/services";

export default function ServiceCategories() {
  return (
    <section
      aria-labelledby="service-categories-title"
      className="bg-white px-4 py-14 sm:px-7 sm:py-16 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-[#c65371]">
            Explore your options
          </p>
          <h2
            id="service-categories-title"
            className="font-heading text-3xl font-semibold tracking-tight text-[#352a31]"
          >
            Browse by category
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#8e7e86]">
            Find the right service for your next salon visit.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category}
              href="/services#browse-by-category"
              className="group flex min-h-24 items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-[#fffaf8] p-4 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md hover:shadow-rose-100/50"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#c65371]">
                  <Sparkles aria-hidden="true" size={18} />
                </span>
                <span className="text-sm font-semibold text-[#493943]">
                  {category}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                size={17}
                className="shrink-0 text-[#b8aab1] transition group-hover:text-[#c65371]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
