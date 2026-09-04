"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import V6GallerySection from "./V6GallerySection";

gsap.registerPlugin(ScrollTrigger);

const label = "font-body text-[10px] tracking-[0.3em] uppercase";
const meta = "font-body text-[11px] tracking-[0.22em] uppercase";

const SERVICES = [
  {
    no: "01",
    title: "Kitchens",
    body:
      "Bespoke kitchen design, manufacturing and installation. From concept sketch to a finished room you cook in for decades.",
  },
  {
    no: "02",
    title: "Wardrobes",
    body:
      "Tailored wardrobes, walk-in closets and dressing rooms. Hand-finished joinery in mahogany, oak or painted MDF.",
  },
  {
    no: "03",
    title: "Bath Vanities",
    body:
      "Bath vanities and full fit-outs. Stone tops, brass hardware, soft-close hardware, considered lighting.",
  },
  {
    no: "04",
    title: "Shop Fit-Outs",
    body:
      "Commercial interior fit-outs — showrooms, retail, hospitality. From first measurement to handover.",
  },
];

const PROCESS = [
  { no: "01", title: "Consult", body: "We visit, hear the brief." },
  { no: "02", title: "Design", body: "Plans, samples, 3D studies." },
  { no: "03", title: "Craft", body: "Built to spec in our workshop." },
  { no: "04", title: "Install", body: "On site, clean and dust-aware." },
];

const MARQUEE_WORDS = [
  "Kitchens",
  "Wardrobes",
  "Bath Vanities",
  "Shop Fit-Outs",
  "Bespoke Joinery",
  "Interior Architecture",
  "Nairobi · Kenya",
  "Material-Honest",
];

function Counter({ to, suffix = "" }: { to: string; suffix?: string }) {
  // Intentionally unused — kept as a future hook for live counts.
  void to;
  void suffix;
  return null;
}

export default function AtelierIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Cycle hero (slower, with cross-fade)
  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % Math.min(6, projects.length));
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  // Mouse parallax for hero
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

  // Reduced-motion guard
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

  // GSAP entrance + scroll reveals
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const ctx = gsap.context(() => {
      // Hero stagger reveal
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl
        .fromTo(
          ".at-hero-eyebrow",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
        )
        .fromTo(
          ".at-hero-title-line",
          { y: 60, opacity: 0, rotateX: -25 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.12,
          },
          "-=0.5"
        )
        .fromTo(
          ".at-hero-sub",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          ".at-hero-cta",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        );

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>(".at-img-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".at-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // Slow hero Ken Burns
      gsap.utils.toArray<HTMLElement>(".at-kenburns img").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 1.0, x: 0 },
          {
            scale: 1.08,
            x: i % 2 === 0 ? -20 : 20,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 3,
            },
          }
        );
      });

      // Parallax floating
      gsap.utils.toArray<HTMLElement>(".at-parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.2");
        gsap.to(el, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  return (
    <div
      ref={root}
      className="bg-[#F5F1E9] text-[#171716] overflow-x-hidden"
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
    >
      {/* ============ HERO ============ */}
      <section
        className="relative w-full min-h-[100svh] overflow-hidden"
        style={{ marginTop: "calc(28px + 1.75rem + 0px)" }}
      >
        {/* Background photos cycling — curated order (6 strongest photos) */}
        <div className="at-kenburns absolute inset-0">
          {(() => {
            const heroIds = [
              "pvc-foilwrap-and-high-gloss-handless-kitchen",
              "high-gloss-handless-kitchen",
              "spray-paint-kitchen",
              "bathroom-vanities",
              "wardropes",
              "walk-in-closet",
            ];
            const heroProjects = heroIds
              .map((id) => projects.find((p) => p.id === id))
              .filter((p): p is (typeof projects)[number] => Boolean(p));
            return heroProjects.map((p, i) => (
              <div
                key={p.id}
                className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
                style={{ opacity: heroIndex === i ? 1 : 0 }}
                aria-hidden={heroIndex !== i}
              >
                <Image
                  src={p.images[0]}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ));
          })()}
        </div>

        {/* Bright legibility veil — slightly stronger at the bottom to anchor the headline, transparent at the top so the eyebrow reads clearly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,23,22,0.15) 0%, rgba(23,23,22,0.05) 30%, rgba(23,23,22,0.45) 65%, rgba(23,23,22,0.78) 100%)",
          }}
        />

        {/* Headline + sub + CTA — asymmetric, bottom-anchored */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 lg:px-16 pb-12 md:pb-20">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-9">
              <h1
                className="at-hero-title font-display font-light leading-[0.88] tracking-[-0.04em] text-[#F5F1E9]"
                style={{
                  fontSize: "clamp(2.75rem, 7.6vw, 8.5rem)",
                  fontFamily: "var(--font-cormorant), serif",
                  perspective: "1000px",
                  textShadow: "0 2px 30px rgba(23,23,22,0.45)",
                }}
              >
                <span className="at-hero-title-line block">Interiors</span>
                <span className="at-hero-title-line block">with a sense</span>
                <span className="at-hero-title-line block">of place.</span>
              </h1>
            </div>
            <div className="col-span-12 md:col-span-3 at-hero-cta md:text-right space-y-4 mt-6 md:mt-0">
              {/* Sub paragraph: brighter + backed with a soft dark plate for legibility */}
              <p
                className="at-hero-sub relative inline-block md:max-w-xs md:ml-auto font-display italic text-[#F5F1E9] text-base md:text-lg leading-snug px-4 py-3 md:px-0 md:py-0"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  background:
                    "linear-gradient(180deg, rgba(23,23,22,0.35) 0%, rgba(23,23,22,0.55) 100%)",
                  boxShadow: "0 4px 30px -10px rgba(23,23,22,0.6)",
                }}
              >
                Bespoke kitchens, wardrobes, and fit-outs — drawn for the
                way you actually live.
              </p>
              <div className="flex md:justify-end gap-2 flex-wrap">
                <Link
                  href="#v6-gallery"
                  className="group relative inline-flex items-center gap-2 bg-[#F5F1E9] text-[#171716] px-5 py-3 font-body text-[11px] font-bold tracking-[0.22em] uppercase overflow-hidden"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[#A68A64] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  />
                  <span className="relative group-hover:text-[#F5F1E9] transition-colors">
                    View Projects
                  </span>
                  <span className="relative group-hover:text-[#F5F1E9] group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
                <a
                  href="https://wa.me/254728846560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 border-2 border-[#F5F1E9] text-[#F5F1E9] px-5 py-3 font-body text-[11px] font-bold tracking-[0.22em] uppercase hover:bg-[#25D366] hover:border-[#25D366] transition-colors"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Photo pagination dots — match curated hero order */}
        <div className="absolute right-6 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col gap-3">
          {["pvc-foilwrap-and-high-gloss-handless-kitchen", "high-gloss-handless-kitchen", "spray-paint-kitchen", "bathroom-vanities", "wardropes", "walk-in-closet"].map((id, i) => {
            const p = projects.find((x) => x.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setHeroIndex(i)}
                aria-label={`View ${p?.title ?? "project"}`}
                className="group flex items-center gap-3"
              >
                <span
                  className={`block w-1 transition-all duration-500 ${
                    heroIndex === i
                      ? "h-10 bg-[#A68A64]"
                      : "h-4 bg-[#F5F1E9]/40 group-hover:bg-[#F5F1E9]/80"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Scroll prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase font-bold text-[#F5F1E9]/80">
            Scroll
          </p>
          <div className="w-px h-10 bg-[#F5F1E9]/30 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-px h-4 bg-[#A68A64]"
              style={{ animation: "scrollLine 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* ============ MARQUEE STRIP ============ */}
      <section className="relative bg-[#171716] text-[#F5F1E9] py-5 md:py-6 overflow-hidden border-y border-[#A68A64]/40">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{
            animation: "marquee 38s linear infinite",
            width: "max-content",
          }}
        >
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map(
            (w, i) => (
              <span
                key={i}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-light tracking-tight inline-flex items-center gap-12"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {w}
                <span
                  className="text-[#A68A64] text-2xl"
                  aria-hidden
                >
                  ✦
                </span>
              </span>
            )
          )}
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          @keyframes scrollLine {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(400%);
            }
          }
        `}</style>
      </section>

      {/* ============ INTRO ============ */}
      <section className="px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-3 at-fade">
            <p className={`${label} text-[#A68A64] mb-3 font-bold`}>
              § About the studio
            </p>
            <div className="hidden md:block w-12 h-px bg-[#A68A64] mt-2" />
          </div>
          <div className="col-span-12 md:col-span-8 at-fade">
            <h2
              className="font-display font-light tracking-[-0.025em] leading-[1.0] text-[#171716]"
              style={{
                fontSize: "clamp(1.75rem, 3.4vw, 3rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              We design and build
              <br />
              interiors that age with grace —
              kitchens, wardrobes, bath vanities and full fit-outs across
              Nairobi and beyond.
            </h2>
            <p className="mt-6 font-body text-sm md:text-base text-[#171716]/80 leading-relaxed max-w-2xl">
              Since 2014, Winterior Design has been the studio clients call
              when the work has to look like a magazine but live like a
              home. Our joinery workshop, design team, and installation
              crew work as one — the same hands, from first sketch to final
              fitting.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
              <Link
                href="/studio"
                className={`${label} text-[#171716] hover:text-[#A68A64] inline-flex items-center gap-2 border-b border-[#171716]/40 hover:border-[#A68A64] pb-0.5 transition-colors`}
              >
                Read our story <span aria-hidden>→</span>
              </Link>
              <span className={`${meta} text-[#171716]/40`}>
                Enterprise Rd · Nairobi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES (rotating, animated rows) ============ */}
      <section className="bg-[#171716] text-[#F5F1E9] px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16 at-fade">
          <div className="col-span-12 md:col-span-4">
            <p className={`${label} text-[#A68A64] mb-3 font-bold`}>
              § What we do
            </p>
            <h2
              className="font-display font-light leading-[1.0] tracking-[-0.025em]"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Four
              <br />
              disciplines.
            </h2>
          </div>
          <p
            className="col-span-12 md:col-span-6 md:col-start-7 font-display italic text-lg md:text-xl text-[#F5F1E9]/80 leading-snug"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            One studio, four hands-on disciplines. End-to-end delivery
            from sketch to handover.
          </p>
        </div>

        <ul className="border-t border-[#F5F1E9]/15">
          {SERVICES.map((s) => (
            <li
              key={s.no}
              className="at-fade border-b border-[#F5F1E9]/15 group transition-all duration-300 hover:bg-[#A68A64] hover:px-4 md:hover:px-6"
            >
              <Link
                href="/services"
                className="grid grid-cols-12 gap-6 md:gap-10 items-baseline py-6 md:py-8"
              >
                <p
                  className={`col-span-3 md:col-span-1 ${label} text-[#A68A64] group-hover:text-[#171716] tabular-nums font-bold transition-colors`}
                >
                  {s.no}
                </p>
                <h3
                  className="col-span-9 md:col-span-4 font-display font-light tracking-[-0.01em] text-[#F5F1E9] group-hover:text-[#171716] transition-colors"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                >
                  {s.title}
                </h3>
                <p className="col-span-12 md:col-span-6 font-body text-sm md:text-base text-[#F5F1E9]/80 group-hover:text-[#171716]/85 leading-relaxed max-w-xl transition-colors">
                  {s.body}
                </p>
                <p
                  className={`hidden md:block col-span-1 ${label} text-[#F5F1E9]/40 group-hover:text-[#171716] text-right transition-all duration-300 group-hover:translate-x-2`}
                >
                  →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ============ EMBEDDED GALLERY ============ */}
      <V6GallerySection />

      {/* ============ PROCESS ============ */}
      <section className="px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-[#F5F1E9]">
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16 at-fade">
          <div className="col-span-12 md:col-span-3">
            <p className={`${label} text-[#A68A64] mb-3 font-bold`}>
              § Our process
            </p>
          </div>
          <h2
            className="col-span-12 md:col-span-8 font-display font-light leading-[1.0] tracking-[-0.025em] text-[#171716]"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            A quiet method, <span className="italic">applied with discipline.</span>
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-6 relative">
          {PROCESS.map((p, i) => (
            <li
              key={p.no}
              className="at-fade relative border-t-2 border-[#171716] pt-6 hover:border-[#A68A64] transition-colors duration-300 group"
            >
              <div className="flex items-baseline justify-between mb-3">
                <p
                  className={`${label} text-[#A68A64] tabular-nums font-bold`}
                >
                  {p.no}
                </p>
                <p
                  className={`${label} text-[#171716]/30 group-hover:text-[#A68A64] transition-colors`}
                >
                  Step {i + 1} of 4
                </p>
              </div>
              <h3
                className="font-display font-light text-[#171716] group-hover:text-[#A68A64] text-3xl md:text-4xl tracking-tight mb-3 transition-colors"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {p.title}
              </h3>
              <p className="font-body text-sm text-[#171716]/75 leading-relaxed">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ MATERIALS ============ */}
      <section className="bg-gradient-to-br from-[#171716] to-[#2C2C2C] text-[#F5F1E9] px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="col-span-12 md:col-span-4 at-fade">
            <p className={`${label} text-[#A68A64] mb-3 font-bold`}>
              § Material palette
            </p>
            <h2
              className="font-display font-light leading-[1.0] tracking-[-0.025em]"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Surfaces that
              <br />
              <span className="italic">age with grace.</span>
            </h2>
            <p
              className="font-display italic text-base text-[#F5F1E9]/70 mt-5"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Natural stone, brass, hardwood, hand-plaster, linen —
              sourced where the work is best made.
            </p>
          </div>
          <ul className="col-span-12 md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 at-fade">
            {[
              "Natural Oak",
              "Mahogany",
              "Brushed Brass",
              "Travertine",
              "Hand-plaster",
              "Linen",
              "Quartz",
              "Walnut",
              "Tempered Glass",
            ].map((m) => (
              <li
                key={m}
                className={`${label} text-[#F5F1E9]/75 border-b border-[#F5F1E9]/15 pb-2 hover:text-[#A68A64] hover:border-[#A68A64] transition-colors`}
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FEATURED CALLOUT ============ */}
      {featured.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
            <Link
              href={`/v6/work/${featured[0].id}`}
              className="col-span-12 md:col-span-7 at-img-reveal block relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#171716]/5 group order-2 md:order-1"
              aria-label={`Open ${featured[0].title}`}
            >
              <Image
                src={featured[0].images[0]}
                alt={featured[0].title}
                fill
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="col-span-12 md:col-span-4 md:col-start-9 at-fade order-1 md:order-2">
              <p className={`${label} text-[#A68A64] mb-3 font-bold`}>
                Featured project
              </p>
              <h3
                className="font-display font-light leading-[1.0] tracking-[-0.025em] text-[#171716]"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontFamily: "var(--font-cormorant), serif",
                }}
              >
                {featured[0].title}
              </h3>
              <p
                className="font-display italic text-lg md:text-xl text-[#171716]/70 mt-3"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {featured[0].subtitle}.
              </p>
              <p className="font-body text-sm md:text-base text-[#171716]/80 leading-relaxed mt-5 max-w-sm">
                {featured[0].description}
              </p>
              <Link
                href={`/v6/work/${featured[0].id}`}
                className={`${label} text-[#171716] hover:text-[#A68A64] inline-flex items-center gap-2 border-b border-[#171716]/40 hover:border-[#A68A64] pb-0.5 mt-7 transition-colors font-bold`}
              >
                View plate <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ CONTACT CTA ============ */}
      <section className="relative bg-[#171716] text-[#F5F1E9] px-6 md:px-12 lg:px-16 py-20 md:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#A68A64] rounded-full blur-3xl opacity-30"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#A68A64] rounded-full blur-3xl opacity-20"
        />
        <div className="relative grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-6 at-fade">
            <p className={`${label} text-[#A68A64] mb-4 font-bold`}>
              § Start a project
            </p>
            <h2
              className="font-display font-light leading-[0.95] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.25rem, 5.5vw, 5rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Let&apos;s create
              <br />
              something{" "}
              <span className="italic">worth coming home to.</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 bg-[#A68A64] text-[#F5F1E9] px-6 py-4 font-body text-[11px] font-bold tracking-[0.22em] uppercase overflow-hidden"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[#F5F1E9] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                />
                <span className="relative group-hover:text-[#171716] transition-colors">
                  Get a Quote
                </span>
                <span className="relative group-hover:text-[#171716] group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Link>
              <a
                href="https://wa.me/254728846560"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-[#F5F1E9] px-6 py-4 font-body text-[11px] font-bold tracking-[0.22em] uppercase transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 at-fade">
            <p className="font-body text-base md:text-lg text-[#F5F1E9]/85 leading-relaxed mb-8">
              Tell us a little about your space — the room, the brief, the
              way you want to live in it. We will reply within two working
              days.
            </p>
            <div className="space-y-3 border-t border-[#F5F1E9]/15 pt-5">
              <div className="flex items-baseline justify-between gap-3 border-b border-[#F5F1E9]/10 pb-3">
                <span className={`${meta} text-[#A68A64] font-bold`}>
                  Email
                </span>
                <a
                  href="mailto:info@winteriordesign.co.ke"
                  className="font-body text-sm text-[#F5F1E9] hover:text-[#A68A64] transition-colors"
                >
                  info@winteriordesign.co.ke
                </a>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-[#F5F1E9]/10 pb-3">
                <span className={`${meta} text-[#A68A64] font-bold`}>
                  Phone
                </span>
                <a
                  href="tel:+254755164654"
                  className="font-body text-sm text-[#F5F1E9] hover:text-[#A68A64] transition-colors"
                >
                  +254 755 164 654
                </a>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-[#F5F1E9]/10 pb-3">
                <span className={`${meta} text-[#A68A64] font-bold`}>
                  Studio
                </span>
                <span className="font-body text-sm text-[#F5F1E9] text-right">
                  Enterprise Rd
                  <br />
                  Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Variant chooser — slim strip above the shared footer */}
      <section className="bg-[#F5F1E9] border-t border-[#171716]/15 px-6 md:px-12 lg:px-16 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            className="font-display italic text-sm md:text-base text-[#171716]/70"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <span className="text-[#A68A64] font-semibold not-italic font-body text-[10px] tracking-[0.3em] uppercase mr-2 align-middle">
              § Other variants
            </span>
            Compare visual systems across the studio.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-body tracking-[0.3em] uppercase font-semibold text-[#171716]/70">
            <Link
              href="/home-v5"
              className="hover:text-[#A68A64] transition-colors"
            >
              v5 · Home
            </Link>
            <span className="text-[#171716]/20">·</span>
            <Link
              href="/v4/work"
              className="hover:text-[#A68A64] transition-colors"
            >
              v4 · Issue
            </Link>
            <span className="text-[#171716]/20">·</span>
            <Link
              href="/v3/work"
              className="hover:text-[#A68A64] transition-colors"
            >
              v3 · Viewing
            </Link>
            <span className="text-[#171716]/20">·</span>
            <Link
              href="/v2/work"
              className="hover:text-[#A68A64] transition-colors"
            >
              v2 · Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}