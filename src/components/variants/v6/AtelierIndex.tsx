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
      setHeroIndex((i) => (i + 1) % Math.min(6, projects.length));
    }, 6500);
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
        style={{ marginTop: "calc(var(--nav-height) + var(--category-bar-height))" }}
      >
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

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,23,22,0.15) 0%, rgba(23,23,22,0.05) 30%, rgba(23,23,22,0.45) 65%, rgba(23,23,22,0.78) 100%)",
          }}
        />

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

      {/* ============ GALLERY ============ */}
      <V6GallerySection />

      <style jsx>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400%);
          }
        }
      `}</style>
    </div>
  );
}