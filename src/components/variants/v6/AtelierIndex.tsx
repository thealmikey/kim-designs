"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/lib/projects";
import V6GallerySection from "./V6GallerySection";
import VideoShowcase from "./VideoShowcase";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: "kitchens",
    title: "Bespoke",
    subtitle: "KITCHENS",
    image: "/images/pvc-foilwrap-and-high-gloss-handless-kitchen/01.jpg",
    href: "/kitchens",
  },
  {
    id: "wardrobes",
    title: "Tailored",
    subtitle: "WARDROBES",
    image: "/images/classic-wardrobe/01.jpg",
    href: "/wardrobes",
  },
  {
    id: "bath-vanities",
    title: "Premium",
    subtitle: "VANITIES",
    image: "/images/bath-vanities/01.jpg",
    href: "/bath-vanities",
  },
  {
    id: "walk-in-closets",
    title: "Custom",
    subtitle: "WALK-IN CLOSETS",
    image: "/images/walk-in-closet/01.jpg",
    href: "/wardrobes",
  },
  {
    id: "gypsum-ceilings",
    title: "Decorative",
    subtitle: "GYPSUM CEILINGS",
    image: "/images/gypsum-ceilings/01.jpeg",
    href: "/contact",
  },
];

const ABOUT_CONTENT = {
  title: "Winterior Design Creative Solutions by Professional Designers",
  body: "Your kitchen and interiors are an expression of who you are, and its design should match your space and feel. Winterior Design closely collaborates with clients to evolve every concept. Whether you have traditional tastes or desire a modern feel, we design your dream kitchen to suit your taste and budget.",
  features: [
    {
      title: "Reasonable Prices",
      description: "We design kitchens and other interior fittings that fulfill needs of all people and offer it at affordable and fair prices",
      image: "/images/bath-vanities/01.jpg",
    },
    {
      title: "Exclusive design",
      description: "Mixture of imagination, experience and professionalism is the secret of our design!",
      image: "/images/better-wardrobes/01.jpg",
    },
    {
      title: "Professional Team",
      description: "We are proud of our amicable, professional and always developing team!",
      image: "/images/high-gloss-handless-kitchen/01.jpg",
    },
  ],
};

const PROCESS_STEPS = [
  { step: "Step 1", title: "Identifying client's needs and objectives." },
  { step: "Step 2", title: "Personalized 3D design samples to give you an idea of the look and feel" },
  { step: "Step 3", title: "Delivering client's envisioned products. Our clients are always exemplary happy. Thank you for trusting us with your interiors" },
];

function Counter({ to, suffix = "" }: { to: string; suffix?: string }) {
  void to;
  void suffix;
  return null;
}

export default function AtelierIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const goToSlide = (next: number) =>
    setHeroIndex(Math.min(Math.max(next, 0), SERVICES.length - 1));

  // Auto-advance. Keyed on heroIndex so the timer restarts whenever a slide
  // changes — including manual navigation — giving the visitor a full
  // interval to read the slide they picked.
  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % SERVICES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [heroIndex]);

  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".wk-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".wk-scale-in").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.05, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  return (
    <div
      ref={root}
      className="bg-white text-[#333333] overflow-x-hidden"
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
    >
      {/* ============ HERO SLIDER ============ */}
      <section className="relative w-full min-h-[100vh] overflow-hidden">
        <div className="absolute inset-0">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
              style={{ opacity: heroIndex === i ? 1 : 0 }}
              aria-hidden={heroIndex !== i}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/40 via-transparent to-[#000000]/80" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center px-6 lg:px-16 z-10">
          <div className="relative w-full max-w-4xl">
            {/* Localised scrim. The full-bleed gradient above leaves the middle
                of the slide uncovered, so light photos wash out the copy.
                This sits behind the text block only and fades out to the right,
                rather than dimming the whole photograph. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-8 -left-8 right-0 bg-gradient-to-r from-[#000000]/65 via-[#000000]/45 to-transparent"
            />
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="transition-opacity duration-[800ms] ease-out"
                style={{ opacity: heroIndex === i ? 1 : 0, position: heroIndex === i ? "relative" : "absolute", pointerEvents: heroIndex === i ? "auto" : "none" }}
                aria-hidden={heroIndex !== i}
              >
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-3 font-semibold wk-fade">
                  {service.title}
                </p>
                <h1 className="font-display font-medium leading-[1.0] tracking-[-0.01em] text-[#FFFFFF] wk-fade" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                  {service.subtitle}
                </h1>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-3 mt-8 px-6 py-3 bg-[#FF6600] text-[#FFFFFF] font-body text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#D95500] transition-colors wk-fade"
                >
                  ENQUIRE
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Hero arrows — omitted at each end so there is nowhere to go. */}
        {heroIndex > 0 && (
          <button
            type="button"
            onClick={() => goToSlide(heroIndex - 1)}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full border border-[#FFFFFF]/35 text-[#FFFFFF] bg-[#000000]/25 backdrop-blur-sm transition-colors hover:bg-[#FF6600] hover:border-[#FF6600] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
        {heroIndex < SERVICES.length - 1 && (
          <button
            type="button"
            onClick={() => goToSlide(heroIndex + 1)}
            aria-label="Next slide"
            className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full border border-[#FFFFFF]/35 text-[#FFFFFF] bg-[#000000]/25 backdrop-blur-sm transition-colors hover:bg-[#FF6600] hover:border-[#FF6600] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}

        {/* Hero pagination */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`View slide ${i + 1}`}
              aria-current={heroIndex === i}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] ${
                heroIndex === i ? "bg-[#FF6600] w-6" : "bg-[#FFFFFF]/40 hover:bg-[#FFFFFF]/80"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase font-bold text-[#FFFFFF]/60">Scroll</p>
          <div className="w-[1px] h-10 bg-[#FFFFFF]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#FF6600]" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ============ VIDEO SHOWCASE ============ */}
      <VideoShowcase />

      {/* ============ SERVICES GRID ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group flex flex-col bg-[#F4F4F4] overflow-hidden wk-scale-in"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EAEAEA]">
                <Image
                  src={service.image}
                  alt={service.subtitle}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              {/* Caption sits below the photograph so the image is never
                  overlaid and no empty band is left under it. */}
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-1.5 font-bold">
                  {service.title}
                </p>
                <h3
                  className="font-display font-medium text-lg md:text-xl text-[#333333] leading-[1.15]"
                  style={{ fontFamily: "var(--font-roboto), sans-serif" }}
                >
                  {service.subtitle}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-2 font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#FF6600]">
                  Enquire
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#F4F4F4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5 wk-fade">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-3 font-bold">About Us</p>
            <h2 className="font-display font-medium leading-[1.05] tracking-[-0.01em] text-[#333333] mb-6" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
              {ABOUT_CONTENT.title}
            </h2>
            <p className="font-body text-base md:text-lg text-[#333333]/85 leading-relaxed max-w-md">
              {ABOUT_CONTENT.body}
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {ABOUT_CONTENT.features.map((feature, i) => (
              <div key={feature.title} className="relative aspect-[4/3] overflow-hidden bg-[#F4F4F4] wk-scale-in">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-2 font-semibold">{feature.title}</p>
                  <p className="font-body text-sm text-[#FFFFFF]/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-white">
        <div className="text-center wk-fade mb-12 md:mb-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-3 font-bold">Our Process</p>
          <h2 className="font-display font-medium leading-[1.05] tracking-[-0.01em] text-[#333333]" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
            Creating your space together
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="wk-fade text-center p-6 md:p-8 border border-[#C6C5CA] hover:border-[#FF6600]/50 transition-colors">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-3 font-semibold">{step.step}</p>
              <p className="font-body text-base md:text-lg text-[#333333]/90 leading-relaxed">{step.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PORTFOLIO/GALLERY ============ */}
      <V6GallerySection />

      {/* ============ BEFORE & AFTER ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#F4F4F4]">
        <div className="text-center wk-fade mb-12 md:mb-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] mb-3 font-bold">Before & After</p>
          <h2 className="font-display font-medium leading-[1.05] tracking-[-0.01em] text-[#333333]" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
            A modern approach to design
          </h2>
          <p className="font-body text-base md:text-lg text-[#333333]/85 leading-relaxed max-w-2xl mx-auto mt-6">
            Work with an experienced designer to create your one-of-a-kind kitchen, backed by a perfect fit guarantee.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            "/images/pvc-foilwrap-and-high-gloss-handless-kitchen/02.jpg",
            "/images/high-gloss-handless-kitchen/02.jpg",
          ].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden bg-[#F4F4F4] wk-scale-in">
              <Image src={src} alt="Before & After" fill className="object-cover transition-transform duration-1000 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </div>
  );
}