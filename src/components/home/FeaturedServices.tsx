"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getServices } from "@/lib/api/services";
import type { ServiceRecord } from "@/types/services";

export default function FeaturedServices() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const wheelLockedRef = useRef(false);
  const wheelTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getServices()
      .then((serviceList) => {
        if (isCurrent) {
          setServices(
            serviceList
              .filter((service) => service.status === "Active")
              .slice(0, 6),
          );
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load featured services:", error);
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

  useEffect(() => {
    const carousel = carouselRef.current?.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]',
    );
    if (!carousel || !api || services.length < 2) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const activeCard = carousel.querySelector<HTMLElement>(
        '[data-featured-active="true"]',
      );
      if (!activeCard) {
        return;
      }

      const cardBounds = activeCard.getBoundingClientRect();
      const pointerOverActiveCard =
        event.clientX >= cardBounds.left &&
        event.clientX <= cardBounds.right &&
        event.clientY >= cardBounds.top &&
        event.clientY <= cardBounds.bottom;
      if (!pointerOverActiveCard) {
        return;
      }

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      if (Math.abs(delta) < 25) {
        return;
      }

      const canScroll = delta > 0 ? api.canScrollNext() : api.canScrollPrev();
      if (!canScroll) {
        return;
      }

      event.preventDefault();

      if (!wheelLockedRef.current) {
        wheelLockedRef.current = true;
        if (delta > 0) {
          api.scrollNext();
        } else {
          api.scrollPrev();
        }
      }

      if (wheelTimeoutRef.current !== null) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = window.setTimeout(() => {
        wheelLockedRef.current = false;
        wheelTimeoutRef.current = null;
      }, 220);
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      carousel.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current !== null) {
        window.clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = null;
      }
      wheelLockedRef.current = false;
    };
  }, [api, services.length]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateActiveIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateActiveIndex();
    api.on("select", updateActiveIndex);
    api.on("reInit", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
      api.off("reInit", updateActiveIndex);
    };
  }, [api]);

  return (
    <section
      id="featured-services"
      aria-labelledby="featured-services-title"
      className="relative isolate overflow-hidden bg-linear-to-br from-rose-50/80 via-[#fffaf8] to-purple-50/70 px-4 py-16 sm:px-7 sm:py-20 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="absolute -left-24 top-16 -z-10 size-72 rounded-full bg-rose-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 -z-10 size-80 rounded-full bg-purple-200/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#c65371] shadow-sm shadow-rose-100/50">
              <Sparkles aria-hidden="true" size={14} />
              Made for your moment
            </p>
            <h2
              id="featured-services-title"
              className="font-heading text-3xl font-semibold tracking-tight text-[#352a31] sm:text-4xl"
            >
              Find your next{" "}
              <span className="gradient-text">feel-good ritual.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#8e7e86] sm:text-base">
              Explore salon services chosen to help you look fresh, feel
              confident, and make time for yourself.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm text-[#756a72] shadow-sm shadow-rose-100/50 backdrop-blur">
            <ChevronDown
              aria-hidden="true"
              size={17}
              className="animate-bounce text-[#c65371]"
            />
            Featured
          </div>
        </div>

        {isLoading ? (
          <div aria-label="Loading services" aria-busy="true">
            <div className="mx-auto h-120 max-w-110 animate-pulse rounded-3xl border border-rose-100/70 bg-white/80 shadow-xl shadow-rose-100/40" />
          </div>
        ) : errorMessage ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-white/80 p-5 text-sm text-rose-700"
          >
            {errorMessage}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 px-5 py-12 text-center">
            <p className="font-heading text-lg font-semibold text-[#493943]">
              No services available just yet
            </p>
            <p className="mt-2 text-sm text-[#8e7e86]">
              Check back soon to discover what you can book.
            </p>
          </div>
        ) : (
          <div ref={carouselRef} className="mx-auto max-w-6xl">
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: services.length > 2,
              }}
              aria-label="Featured salon services"
              className="px-1"
            >
              <CarouselContent className="-ml-4 py-8">
                {services.map((service, index) => {
                  const serviceId =
                    service.id ??
                    service._id ??
                    `${service.serviceName}-${index}`;
                  const isActive = index === activeIndex;

                  return (
                    <CarouselItem
                      key={serviceId}
                      className="basis-[58%] pl-4 sm:basis-[50%] lg:basis-[42%]"
                    >
                      <div
                        data-featured-active={isActive ? "true" : undefined}
                        aria-hidden={!isActive}
                        inert={!isActive}
                        className={`h-full origin-center transition-all duration-500 ease-out motion-reduce:transition-none ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "pointer-events-none scale-[0.88] opacity-45 blur-[1px]"
                        }`}
                      >
                        <ServiceCard service={service} />
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <div className="mt-4 flex items-center justify-between px-2">
                <p
                  aria-live="polite"
                  className="text-sm font-medium text-[#756a72]"
                >
                  Service{" "}
                  <span className="font-semibold text-[#c65371]">
                    {activeIndex + 1}
                  </span>{" "}
                  of {services.length}
                </p>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static left-auto top-auto size-10 translate-y-0 border-rose-100 bg-white text-[#c65371] hover:bg-rose-50" />
                  <CarouselNext className="static right-auto top-auto size-10 translate-y-0 border-rose-100 bg-white text-[#c65371] hover:bg-rose-50" />
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {services.map((service, index) => (
                  <button
                    key={service.id ?? service._id ?? index}
                    type="button"
                    aria-label={`Show service ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-7 bg-[#c65371]"
                        : "w-2 bg-rose-200 hover:bg-rose-300"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
