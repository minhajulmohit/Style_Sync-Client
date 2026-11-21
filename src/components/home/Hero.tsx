import Link from "next/link";
import { Search, WandSparkles } from "lucide-react";
import HeroBanner from "./HeroBanner";

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div className="flex flex-col items-start">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <WandSparkles aria-hidden="true" size={16} />
          <span>Your style, your way</span>
        </div>

        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Transform your look with{" "}
          <span className="text-primary">expert care.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
          Discover trusted salons, explore their services, and book your next
          appointment online with StyleSync.
        </p>

        <Link
          href="/services"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Explore Salon Services
          <Search aria-hidden="true" size={18} />
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
          <div>
            <p className="text-2xl font-semibold text-foreground">50+</p>
            <p className="mt-1 text-sm text-muted-foreground">Local stylists</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">4.9/5</p>
            <p className="mt-1 text-sm text-muted-foreground">Average rating</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/5 blur-2xl" />
        <HeroBanner />
      </div>
    </section>
  );
}
