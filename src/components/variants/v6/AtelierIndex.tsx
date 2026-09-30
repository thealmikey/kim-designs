"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import V6GallerySection from "./V6GallerySection";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: "kitchens",
    title: "COMPLETELY SYNERGIZED",
    subtitle: "KITCHEN FITTING",
    image: "/images/pvc-foilwrap-and-high-gloss-handless-kitchen/01.jpg",
    href: "/kitchens",
  },
  {
    id: "classic-solid-wood",
    title: "CLASSIC SOLID WOOD",
    subtitle: "KITCHENS",
    image: "/images/classic-wardrobe/01.jpg",
    href: "/kitchens?style=classic",
  },
  {
    id: "spray-paint",
    title: "SPRAY PAINT",
    subtitle: "KITCHENS",
    image: "/images/spray-paint-kitchen/01.jpg",
    href: "/kitchens?style=spray-paint",
  },
  {
    id: "wardrobes",
    title: "CUSTOM WARDROBES",
    subtitle: "WALK-IN CLOSETS",
    image: "/images/wardropes/01.jpg",
    href: "/wardrobes",
  },
];

const ABOUT_CONTENT = {
  title: "Wood Kivu Creative Solutions by Professional Designers",
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
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % Math.min(4, projects.length));
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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
      className="bg-[#0A0A0A] text-[#FFFFFF] overflow-x-hidden"
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
          <div className="w-full max-w-4xl">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="transition-opacity duration-[800ms] ease-out"
                style={{ opacity: heroIndex === i ? 1 : 0, position: heroIndex === i ? "relative" : "absolute", pointerEvents: heroIndex === i ? "auto" : "none" }}
                aria-hidden={heroIndex !== i}
              >
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-3 font-semibold wk-fade">
                  {service.title}
                </p>
                <h1 className="font-display font-light leading-[1.0] tracking-[-0.02em] text-[#FFFFFF] wk-fade" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                  {service.subtitle}
                </h1>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-3 mt-8 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-body text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#E8C56D] transition-colors wk-fade"
                >
                  ENQUIRE
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Hero pagination */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHeroIndex(i)}
              aria-label={`View slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                heroIndex === i ? "bg-[#D4A843] w-6" : "bg-[#FFFFFF]/40 hover:bg-[#FFFFFF]/80"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase font-bold text-[#FFFFFF]/60">Scroll</p>
          <div className="w-[1px] h-10 bg-[#FFFFFF]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#D4A843]" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ============ SERVICES GRID ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative aspect-[4/3] overflow-hidden bg-[#141414] wk-scale-in"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-1.5 font-semibold">
                  {service.title}
                </p>
                <h3 className="font-display font-light text-2xl md:text-[1.7rem] text-[#FFFFFF] tracking-tight leading-[1.05]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {service.subtitle}
                </h3>
                <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0A0A0A] font-body text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  ENQUIRE
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#141414]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5 wk-fade">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-3 font-bold">About Us</p>
            <h2 className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#FFFFFF] mb-6" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
              {ABOUT_CONTENT.title}
            </h2>
            <p className="font-body text-base md:text-lg text-[#FFFFFF]/70 leading-relaxed max-w-md">
              {ABOUT_CONTENT.body}
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {ABOUT_CONTENT.features.map((feature, i) => (
              <div key={feature.title} className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A] wk-scale-in">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-2 font-semibold">{feature.title}</p>
                  <p className="font-body text-sm text-[#FFFFFF]/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="text-center wk-fade mb-12 md:mb-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-3 font-bold">Our Process</p>
          <h2 className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#FFFFFF]" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
            Creating your space together
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="wk-fade text-center p-6 md:p-8 border border-[#2A2A2A] hover:border-[#D4A843]/50 transition-colors">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-3 font-semibold">{step.step}</p>
              <p className="font-body text-base md:text-lg text-[#FFFFFF]/80 leading-relaxed">{step.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PORTFOLIO/GALLERY ============ */}
      <V6GallerySection />

      {/* ============ BEFORE & AFTER ============ */}
      <section className="px-6 lg:px-16 py-16 md:py-24 bg-[#141414]">
        <div className="text-center wk-fade mb-12 md:mb-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#D4A843] mb-3 font-bold">Before & After</p>
          <h2 className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#FFFFFF]" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}>
            A modern approach to design
          </h2>
          <p className="font-body text-base md:text-lg text-[#FFFFFF]/70 leading-relaxed max-w-2xl mx-auto mt-6">
            Work with an experienced designer to create your one-of-a-kind kitchen, backed by a perfect fit guarantee.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            "/images/pvc-foilwrap-and-high-gloss-handless-kitchen/02.jpg",
            "/images/high-gloss-handless-kitchen/02.jpg",
          ].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A] wk-scale-in">
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