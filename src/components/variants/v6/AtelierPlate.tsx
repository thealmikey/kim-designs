"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, projectById } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const label = "font-body text-[10px] tracking-[0.3em] uppercase";
const meta = "font-body text-[11px] tracking-[0.2em] uppercase";

interface Props {
  slug: string;
}

export default function AtelierPlate({ slug }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const project = projectById(slug);
  const all = projects;
  const idx = useMemo(() => all.findIndex((p) => p.id === slug), [all, slug]);
  const prev = idx > 0 ? all[idx - 1] : all[all.length - 1];
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : all[0];

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

  useEffect(() => {
    if (prefersReducedMotion.current || !project) return;
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        ".atp-hero-eyebrow",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".atp-hero-title",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", delay: 0.45 }
      );
      gsap.fromTo(
        ".atp-hero-meta > *",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.85 }
      );

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>(".atp-img-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".atp-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div
        className="bg-[#F5F1E9] text-[#171716] min-h-[80vh] flex items-center justify-center px-6"
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
      >
        <div className="text-center">
          <p className={`${label} text-[#716D65] mb-4`}>Plate not found</p>
          <h1
            className="font-display font-light text-4xl md:text-6xl leading-tight mb-8"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            This commission is not in the register.
          </h1>
          <Link
            href="/v6/work"
            className={`${label} text-[#171716] border-b border-[#171716]/40 hover:border-[#A68A64] hover:text-[#A68A64] pb-0.5 transition-colors`}
          >
            ← Return to the register
          </Link>
        </div>
      </div>
    );
  }

  const hero = project.images[0];
  const remaining = project.images.slice(1);

  return (
    <div
      ref={root}
      className="bg-[#F5F1E9] text-[#171716] overflow-x-hidden"
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
    >
      {/* ============ HERO COVER ============ */}
      <section className="relative w-full h-[88vh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 atp-img-reveal">
          <Image
            src={hero}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/55 via-transparent to-transparent" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 pt-28 md:pt-32">
          <Link
            href="/v6/work"
            className={`${label} text-[#F5F1E9]/85 hover:text-[#F5F1E9] inline-flex items-center gap-2 atp-hero-eyebrow transition-colors`}
          >
            <span aria-hidden>←</span>
            <span>The register</span>
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 lg:px-16 pb-12 md:pb-20">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <p className={`${label} text-[#F5F1E9]/85 mb-3 atp-hero-eyebrow`}>
                {project.category} · {project.location} · {project.year}
              </p>
              <h1
                className="atp-hero-title font-display font-light leading-[0.95] tracking-[-0.025em] text-[#F5F1E9]"
                style={{
                  fontSize: "clamp(2.5rem, 6.5vw, 7rem)",
                  fontFamily: "var(--font-cormorant), serif",
                }}
              >
                {project.title}
              </h1>
              <p
                className="font-display italic text-[#F5F1E9]/85 mt-4 text-xl md:text-2xl"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {project.subtitle}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ META PANEL ============ */}
      <section className="px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10 atp-hero-meta">
          <div className="col-span-6 md:col-span-3">
            <p className={`${label} text-[#716D65] mb-2`}>Location</p>
            <p className="font-body text-sm md:text-base text-[#171716]">
              {project.location}
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className={`${label} text-[#716D65] mb-2`}>Year</p>
            <p className="font-body text-sm md:text-base text-[#171716] tabular-nums">
              {project.year}
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className={`${label} text-[#716D65] mb-2`}>Discipline</p>
            <p className="font-body text-sm md:text-base text-[#171716]">
              {project.category}
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className={`${label} text-[#716D65] mb-2`}>Status</p>
            <p className="font-body text-sm md:text-base text-[#171716]">
              Completed
            </p>
          </div>
        </div>
      </section>

      {/* ============ INTRODUCTION ============ */}
      <section className="px-6 md:px-12 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-3 atp-fade">
            <p className={`${label} text-[#A68A64] mb-4`}>§ The brief</p>
          </div>
          <p
            className="col-span-12 md:col-span-7 md:col-start-5 font-display italic text-2xl md:text-4xl leading-[1.25] text-[#171716] atp-fade"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {project.description}
          </p>
        </div>
      </section>

      {/* ============ FULL-BLEED IMAGE ============ */}
      {remaining[0] && (
        <section className="px-6 md:px-12 lg:px-16 py-8 md:py-12">
          <div className="atp-img-reveal relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#171716]/5">
            <Image
              src={remaining[0]}
              alt={`${project.title} — detail`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>
      )}

      {/* ============ MATERIALS ============ */}
      <section className="bg-[#EFE9DE] px-6 md:px-12 lg:px-16 py-20 md:py-28 mt-8 md:mt-16">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-4 atp-fade">
            <p className={`${label} text-[#A68A64] mb-4`}>§ Material palette</p>
            <h2
              className="font-display font-light leading-[1.02] tracking-[-0.02em] text-[#171716]"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Surfaces that
              <br />
              <span className="italic">hold the room.</span>
            </h2>
          </div>
          <ul className="col-span-12 md:col-span-7 md:col-start-6 atp-fade">
            {project.materials.map((m, i) => (
              <li
                key={m}
                className="border-b border-[#171716]/15 py-5 flex items-baseline justify-between gap-4"
              >
                <span
                  className="font-display text-xl md:text-2xl font-light text-[#171716]"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {m}
                </span>
                <span
                  className={`${label} text-[#716D65] tabular-nums`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ REMAINING IMAGES (rotated aspect ratios) ============ */}
      {remaining.length > 1 && (
        <section className="px-6 md:px-12 lg:px-16 py-20 md:py-32">
          <div className="mb-10 md:mb-16 atp-fade">
            <p className={`${label} text-[#716D65] mb-3`}>§ The plate</p>
            <h2
              className="font-display font-light leading-[1.02] tracking-[-0.02em] text-[#171716]"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Additional views.
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            {remaining.slice(1).map((src, i) => {
              const layout = i % 3;
              const aspect =
                layout === 0
                  ? "aspect-[4/5]"
                  : layout === 1
                  ? "aspect-[3/2]"
                  : "aspect-square";
              const col =
                layout === 0
                  ? "col-span-12 md:col-span-5"
                  : layout === 1
                  ? "col-span-12 md:col-span-4 md:col-start-7 md:mt-24"
                  : "col-span-12 md:col-span-3";
              return (
                <div
                  key={src + i}
                  className={`${col} atp-img-reveal relative ${aspect} overflow-hidden bg-[#171716]/5`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — view ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ RELATED PLATES ============ */}
      <section className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {prev && (
            <Link
              href={`/v6/work/${prev.id}`}
              className="group atp-fade block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171716]/5 mb-4">
                <Image
                  src={prev.images[0]}
                  alt={prev.title}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className={`${label} text-[#716D65] mb-2`}>← Previous</p>
              <h3
                className="font-display text-2xl md:text-3xl font-light tracking-tight group-hover:text-[#A68A64] transition-colors"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {prev.title}
              </h3>
              <p className="font-display italic text-base text-[#171716]/65 mt-1">
                {prev.subtitle}.
              </p>
            </Link>
          )}
          {next && (
            <Link
              href={`/v6/work/${next.id}`}
              className="group atp-fade block md:text-right"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171716]/5 mb-4">
                <Image
                  src={next.images[0]}
                  alt={next.title}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className={`${label} text-[#716D65] mb-2`}>Next →</p>
              <h3
                className="font-display text-2xl md:text-3xl font-light tracking-tight group-hover:text-[#A68A64] transition-colors"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {next.title}
              </h3>
              <p className="font-display italic text-base text-[#171716]/65 mt-1">
                {next.subtitle}.
              </p>
            </Link>
          )}
        </div>
      </section>

      {/* ============ FOOTER CTA ============ */}
      <section className="border-t border-[#171716]/15 px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6 items-baseline atp-fade">
          <p className={`col-span-12 md:col-span-2 ${label} text-[#716D65]`}>
            Continue
          </p>
          <p
            className="col-span-12 md:col-span-7 font-display italic text-xl md:text-2xl text-[#171716]/85"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Kim Interior Designs — a working register of completed
            commissions.
          </p>
          <p className="col-span-12 md:col-span-3 md:text-right">
            <Link
              href="/contact"
              className={`${label} text-[#171716] hover:text-[#A68A64] border-b border-[#171716]/40 hover:border-[#A68A64] inline-block pb-0.5 transition-colors`}
            >
              Start a project →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}