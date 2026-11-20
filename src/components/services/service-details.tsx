"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarPlus,
  Clock3,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getServiceId } from "@/lib/api/services";
import { DeleteServiceButton } from "@/components/services/delete-service-button";
import { ServiceStatusToggle } from "@/components/services/service-status-toggle";
import { UpdateServiceButton } from "@/components/services/update-service-button";
import { BookingDialog } from "@/components/services/booking-dialog";
import { updateService } from "@/lib/actions/services";
import type { AddServicePayload, ServiceRecord } from "@/types/services";

export function ServiceDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/signin");
    }
  }, [session, isSessionPending, router]);

  useEffect(() => {
    let isCurrent = true;

    getServiceId(id)
      .then((result) => {
        if (isCurrent) {
          setService(result);
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load service details:", error);
        if (isCurrent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load service details.",
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
  }, [id]);

  const isAdmin = (session?.user?.role ?? "")
    .split(",")
    .some((role) => role.trim().toLowerCase() === "admin");

  const handleStatusToggle = async () => {
    if (!service || isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);
    setStatusError("");

    const updatedServicePayload: AddServicePayload = {
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image,
      status: service.status === "Active" ? "Inactive" : "Active",
    };

    try {
      await updateService(
        service.id ?? service._id ?? id,
        updatedServicePayload,
      );
      setService({ ...service, ...updatedServicePayload });
    } catch (error) {
      console.error("Could not update service status:", error);
      setStatusError(
        error instanceof Error
          ? error.message
          : "Could not update service status. Please try again.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={isAdmin ? "/dashboard/admin/manage-services" : "/"}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8e7e86] transition hover:text-[#e45c78]"
        >
          <ArrowLeft size={16} />
          {isAdmin ? "Back to services" : "Back home"}
        </Link>

        {isLoading || isSessionPending ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-rose-100/70 bg-white text-sm text-[#8e7e86]">
            Loading service details...
          </div>
        ) : errorMessage ? (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
          >
            {errorMessage}
          </p>
        ) : !service ? (
          <div className="rounded-2xl border border-rose-100/70 bg-white p-8 text-center">
            <h1 className="font-heading text-xl font-semibold text-[#352a31]">
              Service not found
            </h1>
            <p className="mt-2 text-sm text-[#8e7e86]">
              This service may have been removed or is unavailable.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm font-medium text-[#a28d97]">
              Service details
            </p>
            <h1 className="mb-6 font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
              {service.serviceName}
            </h1>

            <div className="overflow-hidden rounded-3xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/50">
              <div className="grid md:grid-cols-2">
                <div className="relative min-h-64 bg-linear-to-br from-rose-50 via-orange-50 to-purple-50 md:min-h-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full min-h-64 items-center justify-center text-[#e77a8e] md:min-h-100">
                      <ImageIcon aria-hidden="true" size={40} />
                    </div>
                  )}
                  <span className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-medium text-[#b34d68] shadow-sm backdrop-blur">
                    {service.category}
                  </span>
                </div>

                <div className="flex flex-col p-5 sm:p-8">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      service.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {service.status}
                  </span>
                  <h2 className="mt-5 font-heading text-xl font-semibold text-[#352a31]">
                    About this service
                  </h2>
                  <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-7 text-[#756a72]">
                    {service.description}
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#fff7f4] p-4">
                      <p className="text-xs text-[#9a8d95]">Price</p>
                      <p className="mt-1 font-heading text-xl font-semibold text-[#e45c78]">
                        ${service.price}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#fff7f4] p-4">
                      <p className="text-xs text-[#9a8d95]">Duration</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 font-heading text-xl font-semibold text-[#493943]">
                        <Clock3
                          aria-hidden="true"
                          size={17}
                          className="text-[#e77a8e]"
                        />
                        {service.duration} mins
                      </p>
                    </div>
                  </div>

                  {!isSessionPending &&
                    (isAdmin ? (
                      <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        <UpdateServiceButton
                          service={service}
                          serviceId={service.id ?? service._id ?? id}
                          onUpdated={(updatedService) =>
                            setService(updatedService)
                          }
                        />
                        <DeleteServiceButton
                          serviceId={service.id ?? service._id ?? id}
                          serviceName={service.serviceName}
                        />
                        <ServiceStatusToggle
                          status={service.status}
                          disabled={isUpdatingStatus}
                          isUpdating={isUpdatingStatus}
                          onToggle={handleStatusToggle}
                        />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsBookingOpen(true)}
                        className="mt-7 h-11 w-full rounded-xl gradient-surface shadow-md shadow-rose-200/50 hover:opacity-90"
                      >
                        <CalendarPlus aria-hidden="true" />
                        Book Now
                      </Button>
                    ))}
                  {statusError && (
                    <p
                      role="alert"
                      className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                      {statusError}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {isBookingOpen && (
              <BookingDialog
                service={service}
                serviceId={service.id ?? service._id ?? id}
                userId={session?.user.id}
                onClose={() => setIsBookingOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
