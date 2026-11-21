"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, ImageIcon, LoaderCircle, PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteServiceButton } from "@/components/services/delete-service-button";
import { ServiceStatusToggle } from "@/components/services/service-status-toggle";
import { UpdateServiceButton } from "@/components/services/update-service-button";
import { getAdminServices, updateService } from "@/lib/actions/services";
import { formatServiceCategory } from "@/lib/utils";
import type { AddServicePayload, ServiceRecord } from "@/types/services";

export default function ManageServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingServiceId, setUpdatingServiceId] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const serviceList = await getAdminServices();
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

  const handleStatusToggle = async (service: ServiceRecord) => {
    const serviceId = service.id ?? service._id;
    if (!serviceId || updatingServiceId) {
      return;
    }

    const updatedService: AddServicePayload = {
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image,
      status: service.status === "Active" ? "Inactive" : "Active",
    };

    setUpdatingServiceId(serviceId);
    setActionError("");

    try {
      await updateService(serviceId, updatedService);
      setServices((currentServices) =>
        currentServices.map((currentService) =>
          (currentService.id ?? currentService._id) === serviceId
            ? { ...currentService, ...updatedService }
            : currentService,
        ),
      );
    } catch (error) {
      console.error("Could not update service status:", error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not update service status. Please try again.",
      );
    } finally {
      setUpdatingServiceId("");
    }
  };

  const replaceService = (updatedService: ServiceRecord) => {
    const updatedServiceId = updatedService.id ?? updatedService._id;
    if (!updatedServiceId) {
      return;
    }

    setServices((currentServices) =>
      currentServices.map((service) =>
        (service.id ?? service._id) === updatedServiceId
          ? updatedService
          : service,
      ),
    );
  };

  const removeService = (serviceId: string) => {
    setServices((currentServices) =>
      currentServices.filter(
        (service) => (service.id ?? service._id) !== serviceId,
      ),
    );
  };

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
              View and manage the services available to your customers.
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
          <div className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm shadow-rose-100/40">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-rose-50 last:border-0">
                  <div className="size-12 animate-pulse rounded-xl bg-rose-100/70 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-rose-100/70" />
                    <div className="h-3 w-64 animate-pulse rounded bg-rose-100/70" />
                  </div>
                  <div className="h-4 w-20 animate-pulse rounded bg-rose-100/70" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-rose-100/70" />
                  <div className="flex gap-2">
                    <div className="size-8 animate-pulse rounded-lg bg-rose-100/70" />
                    <div className="size-8 animate-pulse rounded-lg bg-rose-100/70" />
                  </div>
                </div>
              ))}
            </div>
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
              <PackageOpen aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-4 font-heading text-lg font-semibold text-[#493943]">
              No services yet
            </h2>
            <p className="mt-1 text-sm text-[#8e7e86]">
              Add your first service to show it here.
            </p>
          </div>
        ) : (
          <>
            {actionError && (
              <p
                role="alert"
                className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                {actionError}
              </p>
            )}
            <div className="overflow-x-auto rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-rose-100 text-xs uppercase tracking-wide text-[#8e7e86]">
                    <th scope="col" className="px-5 py-4 font-medium">
                      Service
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Category
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Price &amp; duration
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => {
                    const serviceId = service.id ?? service._id;

                    return (
                      <tr
                        key={
                          serviceId ?? `${service.serviceName}-${index}`
                        }
                        className="border-b border-rose-50 last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50 text-[#e77a8e]">
                              {service.image ? (
                                <Image
                                  src={service.image}
                                  alt=""
                                  fill
                                  unoptimized
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              )}
                            </div>
                            <span className="font-medium text-[#493943]">
                              {service.serviceName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#756a72]">
                          {formatServiceCategory(service.category)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-[#756a72]">
                          <p className="font-medium text-[#493943]">
                            ${service.price}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#8e7e86]">
                            <Clock3 aria-hidden="true" size={13} />
                            {service.duration} mins
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <ServiceStatusToggle
                            status={service.status}
                            disabled={
                              !serviceId || Boolean(updatingServiceId)
                            }
                            isUpdating={updatingServiceId === serviceId}
                            onToggle={() => void handleStatusToggle(service)}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {serviceId && (
                              <>
                                <Link
                                  href={`/services/${serviceId}`}
                                  aria-label={`View ${service.serviceName}`}
                                  title="View details"
                                  className="inline-flex size-10 items-center justify-center rounded-xl border border-rose-100 text-[#756a72] transition hover:bg-rose-50 hover:text-[#d95272]"
                                >
                                  <Eye aria-hidden="true" size={17} />
                                </Link>
                                <UpdateServiceButton
                                  service={service}
                                  serviceId={serviceId}
                                  onUpdated={replaceService}
                                />
                                <DeleteServiceButton
                                  serviceId={serviceId}
                                  serviceName={service.serviceName}
                                  onDeleted={() => removeService(serviceId)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
