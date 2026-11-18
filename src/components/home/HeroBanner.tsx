"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/delfina-pan-wJoB8D3hnzc-unsplash.jpg",
    alt: "A stylist blow-drying a client's hair in a salon",
  },
  {
    src: "/billow926-v-g9h0XU_x0-unsplash.jpg",
    alt: "A stylist cutting a client's hair",
  },
  {
    src: "/gulom-nazarov-DrG4V5skbMY-unsplash.jpg",
    alt: "A barber carefully trimming a client's hair",
  },
  {
    src: "/marcel-strauss-SrZ528lUY-U-unsplash.jpg",
    alt: "A warmly lit salon interior",
  },
];

type AnimationPhase = "waiting" | "cutting" | "revealing";

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("waiting");
  const nextIndex = (currentIndex + 1) % slides.length;

  useEffect(() => {
    if (phase === "cutting") {
      return;
    }

    const delay = phase === "waiting" ? 4000 : 2000;
    const timer = window.setTimeout(() => {
      if (phase === "waiting") {
        setPhase("cutting");
      } else {
        setCurrentIndex(nextIndex);
        setPhase("waiting");
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [nextIndex, phase]);

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[nextIndex];

  return (
    <div
      className="hero-banner relative aspect-4/5 w-full overflow-hidden rounded-[2rem] bg-muted shadow-xl"
      role="group"
      aria-label="Salon photo slideshow"
    >
      {phase !== "waiting" && (
        <Image
          src={nextSlide.src}
          alt={phase === "revealing" ? nextSlide.alt : ""}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      )}

      {phase === "revealing" ? (
        <>
          <div className="hero-banner__piece hero-banner__piece--top">
            <Image
              src={currentSlide.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="hero-banner__piece hero-banner__piece--bottom">
            <Image
              src={currentSlide.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </>
      ) : (
        <Image
          src={currentSlide.src}
          alt={currentSlide.alt}
          fill
          preload={currentIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      )}

      {phase === "cutting" && (
        <>
          <svg
            className="hero-banner__cut-line"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              position: "absolute",
              zIndex: 15,
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <path
              d="M0 50 L5 48.8 L10 51.2 L15 49 L20 50.8 L25 48.9 L30 51.1 L35 49.2 L40 50.7 L45 48.8 L50 51.2 L55 49.2 L60 50.8 L65 48.8 L70 51.2 L75 49.1 L80 50.9 L85 48.8 L90 51.2 L95 49 L100 50"
              pathLength={100}
              fill="none"
              stroke="white"
              strokeWidth={0.6}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) {
                  setPhase("revealing");
                }
              }}
            />
          </svg>
          <div
            className="hero-banner__scissors"
            aria-hidden="true"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              animationDuration: "2.6s",
              background: "transparent",
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                width: "3rem",
                height: "3rem",
                overflow: "visible",
                stroke: "var(--brand-pink)",
              }}
            >
              <g className="hero-banner__scissor-blade hero-banner__scissor-blade--upper">
                <circle cx="6" cy="6" r="3" fill="none" />
                <path d="M8.6 8.6l10.4 10.4" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 12 12; -9 12 12; 0 12 12; -9 12 12; 0 12 12"
                  dur="500ms"
                  repeatCount="indefinite"
                />
              </g>
              <g className="hero-banner__scissor-blade hero-banner__scissor-blade--lower">
                <circle cx="6" cy="18" r="3" fill="none" />
                <path d="M8.6 15.4l10.4 -10.4" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 12 12; 9 12 12; 0 12 12; 9 12 12; 0 12 12"
                  dur="500ms"
                  repeatCount="indefinite"
                />
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
