"use client";

import { useEffect, useState } from "react";
import { Search, Scissors, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";
import { Input } from "@/components/ui/input";
import { getServices } from "@/lib/api/services";
import { formatServiceCategory } from "@/lib/utils";
import type { ServiceRecord } from "@/types/services";

export default function BrowseServices() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    let isCurrent = true;

    getServices()
      .then((serviceList) => {
        if (isCurrent) {
          setServices(
            serviceList.filter((service) => service.status === "Active"),
          );
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load services:", error);
        if (isCurrent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load services. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const availableCategories = Array.from(
    new Set(services.map((service) => formatServiceCategory(service.category))),
  );

  const query = searchQuery.trim().toLowerCase();
  const visibleServices = services.filter((service) => {
    const category = formatServiceCategory(service.category);
    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;
    const matchesQuery =
      !query ||
      [service.serviceName, service.description, category].some((value) =>
        value.toLowerCase().includes(query),
      );

    return matchesCategory && matchesQuery;
  });

  if (sortOrder === "price-low") {
    visibleServices.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-high") {
    visibleServices.sort((a, b) => b.price - a.price);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOrder("default");
  };

  return (
    <main className="min-h-screen bg-[#fffaf8]">
      <section className="relative isolate overflow-hidden bg-linear-to-br from-rose-50 via-[#fffaf8] to-purple-50 px-4 pb-10 pt-12 sm:px-7 sm:pb-14 sm:pt-16 lg:px-10">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 -z-10 size-80 rounded-full bg-rose-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 left-1/4 -z-10 size-72 rounded-full bg-purple-200/25 blur-3xl"
        />

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c65371] shadow-sm shadow-rose-100/60">
              <Sparkles aria-hidden="true" size={14} />
              The StyleSync service menu
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#352a31] sm:text-5xl">
              A little time for{" "}
              <span className="gradient-text">you.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8e7e86] sm:text-base">
              Find a treatment that fits your day. Browse bookable services,
              compare details, and choose your next feel-good appointment.
            </p>

            {!isLoading && !errorMessage && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm text-[#756a72] shadow-sm shadow-rose-100/50">
                <Scissors
                  aria-hidden="true"
                  size={16}
                  className="text-[#c65371]"
                />
                <span>
                  <strong className="font-semibold text-[#493943]">
                    {services.length}
                  </strong>{" "}
                  bookable {services.length === 1 ? "service" : "services"}
                </span>
              </div>
            )}
          </div>

          <div className="mx-auto mt-9 max-w-5xl rounded-3xl border border-white/80 bg-white/75 p-4 shadow-lg shadow-rose-100/50 backdrop-blur sm:p-5">
            <label
              htmlFor="service-search"
              className="mb-2 block text-sm font-medium text-[#493943]"
            >
              Search services
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b39fa9]"
              />
              <Input
                id="service-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder="Try haircut, facial, or massage..."
                className="h-12 rounded-2xl border-rose-100 bg-white pl-11 text-sm shadow-sm shadow-rose-100/30 placeholder:text-[#b5a8af] focus-visible:border-rose-300 focus-visible:ring-rose-100"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="service-sort"
                className="text-sm font-medium text-[#493943]"
              >
                Sort by price
              </label>
              <select
                id="service-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.currentTarget.value)}
                className="h-10 rounded-xl border border-rose-100 bg-white px-3 text-sm text-[#756a72] outline-none focus-visible:border-rose-300 focus-visible:ring-3 focus-visible:ring-rose-100"
              >
                <option value="default">Default order</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>

            <div id="browse-by-category" className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8d95]">
                Browse by category
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={selectedCategory === "All"}
                  onClick={() => setSelectedCategory("All")}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === "All"
                      ? "gradient-surface border-transparent shadow-sm shadow-rose-200/50"
                      : "border-rose-100 bg-white text-[#756a72] hover:bg-rose-50"
                  }`}
                >
                  All services
                </button>
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "gradient-surface border-transparent shadow-sm shadow-rose-200/50"
                        : "border-rose-100 bg-white text-[#756a72] hover:bg-rose-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Available services"
        className="px-4 pb-16 pt-9 sm:px-7 sm:pb-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-medium text-[#a28d97]">
                Ready when you are
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
                {selectedCategory === "All"
                  ? "Available services"
                  : selectedCategory}
              </h2>
            </div>
            {!isLoading && !errorMessage && (
              <p className="text-sm text-[#8e7e86]">
                Showing {visibleServices.length} of {services.length}
              </p>
            )}
          </div>

          {isLoading ? (
            <div
              aria-label="Loading services"
              aria-busy="true"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-3 shadow-sm shadow-rose-100/40"
                >
                  <div className="aspect-16/10 animate-pulse rounded-xl bg-rose-50" />
                  <div className="space-y-3 p-2 pt-5">
                    <div className="h-5 w-3/5 animate-pulse rounded bg-rose-50" />
                    <div className="h-4 w-full animate-pulse rounded bg-rose-50" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-rose-50" />
                    <div className="h-10 animate-pulse rounded-xl bg-rose-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
            >
              {errorMessage}
            </div>
          ) : visibleServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={
                    service.id ??
                    service._id ??
                    `${service.serviceName}-${index}`
                  }
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 px-5 py-14 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e45c78]">
                <Search aria-hidden="true" size={21} />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
                {services.length === 0
                  ? "No services available right now"
                  : "No matching services"}
              </h3>
              <p className="mt-2 text-sm text-[#8e7e86]">
                {services.length === 0
                  ? "Please check back soon for bookable salon services."
                  : "Try another search or choose a different category."}
              </p>
              {services.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-[#c65371] transition hover:bg-rose-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
