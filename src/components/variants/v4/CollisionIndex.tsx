"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const STATIC_CATEGORIES = [
  "Kitchen",
  "Cabinetry",
  "Finishes",
  "Material",
];

const label = "font-body text-[10px] tracking-[0.3em] uppercase";

const WHY_KIM = [
  {
    title: "Bespoke",
    body: "Every commission is drawn to the room it lives in. No catalogue, no presets.",
  },
  {
    title: "Material-honest",
    body: "Mahogany, melanin, brass, stone — surfaces that age, not finishes that pretend.",
  },
  {
    title: "One studio",
    body: "From the first sketch to the final fitting, the same hands. No handoffs.",
  },
  {
    title: "Documented",
    body: "Each plate is filed with materials, dimensions, and the year of execution.",
  },
];

function PropertyCard({
  project,
  number,
}: {
  project: (typeof projects)[number];
  number: string;
}) {
  return (
    <Link
      href={`/v4/work/${project.id}`}
      className="ci-reveal group block"
      aria-label={`Open ${project.title}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
        <span
          className={`absolute top-3 left-3 z-10 ${label} bg-background/90 text-foreground px-1.5 py-0.5`}
        >
          {number} / 06
        </span>
        <span className="absolute top-3 right-3 z-10 font-body text-[10px] tracking-[0.2em] uppercase bg-background/90 text-aged-brass px-1.5 py-0.5">
          {project.category}
        </span>
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl md:text-3xl font-light tracking-tight leading-[1.05] group-hover:text-aged-brass transition-colors">
          {project.title}
        </h3>
        <span className={`${label} text-foreground/40 tabular-nums`}>
          {project.year}
        </span>
      </div>
      <p className="font-display italic text-base text-foreground/65 mt-1">
        {project.subtitle}.
      </p>
      <p className={`${label} text-foreground/50 mt-3`}>
        {project.location}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {project.materials.slice(0, 3).map((m) => (
          <span key={m} className={`${label} text-foreground/45`}>
            {m}
          </span>
        ))}
      </div>
      <p
        className={`${label} text-aged-brass inline-block mt-4 border-b border-aged-brass/30 group-hover:border-aged-brass pb-0.5 transition-colors`}
      >
        Read plate →
      </p>
    </Link>
  );
}

export default function CollisionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ci-overlap",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.2 }
      );

      gsap.utils.toArray<HTMLElement>(".ci-reveal").forEach((el) => {
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

      gsap.utils.toArray<HTMLElement>(".ci-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const allCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set([...STATIC_CATEGORIES, ...projects.map((p) => p.category)])
      ),
    ],
    []
  );

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", projects.length);
    allCategories.slice(1).forEach((c) => {
      map.set(c, projects.filter((p) => p.category === c).length);
    });
    return map;
  }, [allCategories]);

  return (
    <div ref={root} className="bg-background text-foreground overflow-x-hidden">
      <section className="relative w-full h-[85vh] md:h-[92vh] overflow-hidden">
        <div className="absolute inset-0 ci-reveal">
          <Image
            src={projects[0].images[0]}
            alt="Lead photograph"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent" />
        </div>

        <div className="absolute top-6 md:top-10 left-6 md:left-12 right-6 md:right-12 flex justify-between">
          <p className={`${label} text-cream/80`}>Issue 04 / Volume I</p>
          <p className={`${label} text-cream/80 hidden md:block`}>
            Kim Interior Designs
          </p>
        </div>

        <div className="absolute left-6 md:left-12 bottom-[28vw] md:bottom-[20vw] z-10 max-w-2xl">
          <p
            className={`${label} text-aged-brass mb-3 md:mb-4 ci-fade`}
            style={{ animationDelay: "0.1s" }}
          >
            Latest
          </p>
          <p
            className="font-display italic text-cream/90 text-xl md:text-2xl leading-snug max-w-md ci-fade"
            style={{ animationDelay: "0.2s" }}
          >
            Bespoke interior design from Nairobi — quiet rooms, honest
            materials, documented as a working register.
          </p>
        </div>

        <h1
          className="ci-overlap font-display italic font-light leading-[0.78] tracking-[-0.04em] text-cream absolute left-[-2vw] md:left-[-1vw] bottom-[-12vw] md:bottom-[-9vw] text-[34vw] md:text-[28vw] z-10 pointer-events-none select-none"
        >
          collision
        </h1>
      </section>

      <section className="relative pt-[18vw] md:pt-[12vw] pb-12 md:pb-16 px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-3 ci-fade">
            <p className={`${label} text-warm-gray mb-3`}>Contents</p>
            <p className="font-body text-xs text-foreground/70 leading-relaxed">
              Six interiors, executed in the spaces of private commissions
              between 2024 and 2026. Each plate is filed under a single
              discipline; the order follows the cadence of the studio, not
              the calendar.
            </p>
          </div>

          <div className="col-span-12 md:col-span-9">
            <div
              className="flex flex-wrap items-baseline gap-x-8 gap-y-3 ci-fade"
              role="navigation"
              aria-label="Filter by category"
            >
              {allCategories.map((cat) => {
                const count = categoryCounts.get(cat) ?? 0;
                const isActive = activeCategory === cat;
                const isClickable = count > 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && setActiveCategory(cat)}
                    aria-pressed={isActive}
                    className={`group inline-flex items-baseline gap-2 transition-colors ${
                      isActive
                        ? "text-aged-brass"
                        : isClickable
                        ? "text-foreground/80 hover:text-aged-brass"
                        : "text-foreground/30 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`${label} ${
                        isActive ? "border-b border-aged-brass" : ""
                      }`}
                    >
                      {cat}
                    </span>
                    <span
                      className={`font-body text-[10px] tabular-nums ${
                        isActive ? "text-aged-brass" : "text-foreground/30"
                      }`}
                    >
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-6 md:px-12 pb-16 md:pb-24"
        aria-label="Editor’s note"
      >
        <div className="grid grid-cols-12 gap-6">
          <p className="col-span-12 md:col-span-2 ci-fade">
            <span className={`${label} text-warm-gray block`}>
              Editor&apos;s note
            </span>
            <span className="font-body text-[10px] text-foreground/30 tabular-nums">
              001
            </span>
          </p>
          <p
            className="col-span-12 md:col-span-7 md:col-start-4 font-display italic text-2xl md:text-4xl leading-[1.2] text-foreground/85 ci-fade"
          >
            An interior is not a backdrop for living. It is a coordinate
            system — for material, for light, for the slow accumulation of
            habit. The work gathered here is a record of that system being
            drawn, redrawn, and held.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24 md:pb-32">
        <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-foreground/15 pb-4 ci-fade">
          <div>
            <p className={`${label} text-warm-gray mb-2`}>
              § {activeCategory === "All" ? "All projects" : activeCategory}
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight leading-[1.05]">
              Browse the collection
            </h2>
          </div>
          <p className={`${label} text-foreground/50 hidden md:block`}>
            {String(visibleProjects.length).padStart(2, "0")} of{" "}
            {String(projects.length).padStart(2, "0")} shown
          </p>
        </div>

        {visibleProjects.length === 0 ? (
          <p className="font-display italic text-2xl text-foreground/60 py-12">
            No plates filed under {activeCategory} yet.
          </p>
        ) : (
          <div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16"
          >
            {visibleProjects.map((project, idx) => (
              <PropertyCard
                key={project.id}
                project={project}
                number={String(idx + 1).padStart(2, "0")}
              />
            ))}
          </div>
        )}
      </section>

      <section className="px-6 md:px-12 pb-24 md:pb-32 border-t border-foreground/15 pt-16 md:pt-24">
        <div className="mb-10 md:mb-16 ci-fade">
          <p className={`${label} text-warm-gray mb-3`}>Why Kim</p>
          <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight leading-[1.05] max-w-3xl">
            Four working principles, applied to every commission.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {WHY_KIM.map((feature, i) => (
            <div
              key={feature.title}
              className="ci-fade border-t border-foreground/15 pt-5"
            >
              <p className={`${label} text-warm-gray mb-3 tabular-nums`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-xl md:text-2xl font-light tracking-tight leading-[1.1] mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16 md:pb-24 ci-fade">
        <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-foreground/15 pb-4">
          <div>
            <p className={`${label} text-warm-gray mb-2`}>§ Featured plates</p>
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight leading-[1.05]">
              The full issue, plate by plate
            </h2>
          </div>
          <p className={`${label} text-foreground/50 hidden md:block`}>
            Read top to bottom
          </p>
        </div>
      </section>

      {projects.map((project, idx) => {
        const template = idx % 3;
        const number = String(idx + 1).padStart(2, "0");

        if (template === 0) {
          return (
            <section
              key={project.id}
              className="relative w-full mb-24 md:mb-40 ci-reveal"
            >
              <div className="relative w-full h-[80vh] md:h-[95vh]">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 max-w-[20ch]">
                <p className={`${label} text-cream/80 mb-3`}>
                  {number} — {project.category}
                </p>
                <h2 className="font-display text-4xl md:text-6xl text-cream font-light leading-[1] tracking-tight">
                  {project.title}
                </h2>
                <p className="font-display italic text-lg md:text-xl text-cream/70 mt-2">
                  {project.subtitle}
                </p>
                <ul className="mt-6 space-y-1">
                  {project.materials.map((m) => (
                    <li key={m} className={`${label} text-cream/60`}>
                      {m}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/v4/work/${project.id}`}
                  className={`${label} text-cream border-b border-cream/40 hover:border-cream inline-block mt-6 pb-0.5 transition-colors`}
                >
                  Read plate →
                </Link>
              </div>
            </section>
          );
        }

        if (template === 1) {
          const second = project.images[1] ?? project.images[0];
          return (
            <section
              key={project.id}
              className="relative px-6 md:px-12 mb-24 md:mb-40"
            >
              <div className="grid grid-cols-12 gap-6 md:gap-10 ci-reveal">
                <div className="col-span-12 md:col-span-7">
                  <div className="relative aspect-[4/3] md:aspect-[5/4]">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-32">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={second}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-12 grid grid-cols-12 gap-6 ci-fade">
                <p className={`col-span-12 md:col-span-2 ${label} text-warm-gray`}>
                  {number} / {project.category} / {project.year}
                </p>
                <h2 className="col-span-12 md:col-span-6 font-display text-3xl md:text-5xl font-light tracking-tight leading-[1.05]">
                  {project.title}
                </h2>
                <p className="col-span-12 md:col-span-3 font-display italic text-base md:text-lg text-foreground/70 leading-relaxed">
                  {project.subtitle}. {project.location}.
                </p>
                <p className="col-span-12 md:col-start-10">
                  <Link
                    href={`/v4/work/${project.id}`}
                    className={`${label} text-foreground border-b border-foreground/30 hover:border-aged-brass hover:text-aged-brass inline-block pb-0.5 transition-colors`}
                  >
                    Open →
                  </Link>
                </p>
              </div>
            </section>
          );
        }

        return (
          <section
            key={project.id}
            className="relative px-6 md:px-12 mb-24 md:mb-40 grid grid-cols-12 gap-6 md:gap-10 items-center ci-reveal"
          >
            <div className="col-span-12 md:col-span-4">
              <div className="relative aspect-[3/4]">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 font-body text-[10px] tabular-nums bg-background/90 px-1.5 py-0.5">
                  {number} / 06
                </span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className={`${label} text-warm-gray mb-4`}>
                {project.category} — {project.year}
              </p>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
                {project.title}
              </h2>
              <p className="font-display italic text-xl md:text-2xl text-foreground/70 mt-3">
                {project.subtitle}.
              </p>
              <p className="font-body text-sm md:text-base text-foreground/80 leading-relaxed mt-6 max-w-prose">
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {project.materials.map((m) => (
                  <span key={m} className={`${label} text-foreground/60`}>
                    {m}
                  </span>
                ))}
              </div>
              <Link
                href={`/v4/work/${project.id}`}
                className={`${label} text-aged-brass border-b border-aged-brass/40 hover:border-aged-brass inline-block mt-8 pb-0.5 transition-colors`}
              >
                Read the plate →
              </Link>
            </div>
          </section>
        );
      })}

      <section className="border-t border-foreground/15 px-6 md:px-12 py-12 ci-fade">
        <div className="grid grid-cols-12 gap-6 items-baseline">
          <p className={`col-span-12 md:col-span-2 ${label} text-warm-gray`}>
            End of issue
          </p>
          <p className="col-span-12 md:col-span-7 font-display text-2xl md:text-4xl italic font-light">
            Kim Interior Designs — a working register.
          </p>
          <p className="col-span-12 md:col-span-3 md:text-right">
            <Link
              href="/v3/work"
              className={`${label} text-foreground/70 hover:text-aged-brass border-b border-foreground/30 hover:border-aged-brass inline-block pb-0.5 transition-colors`}
            >
              View private viewing →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
