"use client";

import { useEffect, useState } from "react";
import { ReviewsSkeleton } from "@/components/skeletons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type Review = {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  service: string;
  date: string;
};

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${baseUrl}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage("Could not load reviews.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (errorMessage) {
    return (
      <section className="py-16 bg-rose-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-rose-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 text-sm">
            Real experiences from our happy customers
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((r) => (
              <CarouselItem
                key={r._id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-white rounded-2xl border border-rose-100 p-6 h-full flex flex-col gap-4 shadow-sm">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < r.rating ? "text-yellow-400" : "text-gray-200"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    &ldquo;{r.review}&rdquo;
                  </p>

                  {/* Service tag */}
                  <span className="inline-block text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 w-fit">
                    {r.service}
                  </span>

                  {/* Avatar + Name + Date */}
                  <div className="flex items-center gap-3 pt-2 border-t border-rose-50">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm flex-shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {r.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatDate(r.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden sm:flex -left-5 border-rose-200 hover:bg-rose-50" />
          <CarouselNext className="hidden sm:flex -right-5 border-rose-200 hover:bg-rose-50" />
        </Carousel>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? "bg-rose-500 w-5" : "bg-rose-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
