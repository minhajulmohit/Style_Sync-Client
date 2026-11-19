"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Scissors } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import { getServices } from "@/lib/api/services";
import type { ServiceRecord } from "@/types/services";

export default function ManageServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const serviceList = await getServices();
        setServices(serviceList);
      } catch (error) {
        console.error("Could not load services:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not load services. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadServices();
  }, []);

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[#a28d97]">
              Salon service catalog
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
              Manage Services
            </h1>
            <p className="mt-2 text-sm text-[#8e7e86]">
              View, update, delete the services available to your customers.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/admin/add-service" />}
            className="h-10 rounded-xl gradient-surface px-4 shadow-md shadow-rose-200/50 hover:opacity-90"
          >
            <Plus />
            Add New Service
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-rose-100/70 bg-white text-sm text-[#8e7e86]">
            <LoaderCircle
              aria-hidden="true"
              className="mb-3 animate-spin text-[#e45c78]"
              size={24}
            />
            Loading services...
          </div>
        ) : errorMessage ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
          >
            {errorMessage}
          </div>
        ) : services.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-white px-5 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e45c78]">
              <Scissors aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
              No services yet
            </h2>
            <p className="mt-1 text-sm text-[#8e7e86]">
              Add your first service to show it here.
            </p>
          </div>
        ) : (
          <section
            aria-label="All services"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={
                  service.id ?? service._id ?? `${service.serviceName}-${index}`
                }
                service={service}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
