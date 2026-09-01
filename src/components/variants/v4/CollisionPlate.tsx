"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, projectById } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const label = "font-body text-[10px] tracking-[0.3em] uppercase";

interface Props {
  slug: string;
}

function ArchitecturalSketch() {
  return (
    <svg
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      className="w-full h-16 md:h-24 text-foreground/25"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        <line x1="0" y1="60" x2="800" y2="60" />
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1={i * 50}
            y1="50"
            x2={i * 50}
            y2="70"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line x1="100" y1="20" x2="100" y2="100" />
        <line x1="700" y1="20" x2="700" y2="100" />
        <line x1="95" y1="20" x2="105" y2="20" />
        <line x1="95" y1="100" x2="105" y2="100" />
        <line x1="695" y1="20" x2="705" y2="20" />
        <line x1="695" y1="100" x2="705" y2="100" />
        <text
          x="100"
          y="14"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="currentColor"
        >
          0
        </text>
        <text
          x="700"
          y="14"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="currentColor"
          textAnchor="end"
        >
          2400
        </text>
        <text
          x="400"
          y="114"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="currentColor"
          textAnchor="middle"
        >
          § SECTION A — A
        </text>
      </g>
    </svg>
  );
}

export default function CollisionPlate({ slug }: Props) {
  const project = projectById(slug);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cp-overlap",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.2 }
      );
      gsap.utils.toArray<HTMLElement>(".cp-reveal").forEach((el) => {
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
      gsap.utils.toArray<HTMLElement>(".cp-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <p className={`${label} text-warm-gray mb-3`}>Plate not found</p>
          <h1 className="font-display italic text-5xl">Missing entry</h1>
          <Link
            href="/v4/work"
            className={`${label} text-aged-brass border-b border-aged-brass/40 inline-block mt-8 pb-0.5`}
          >
            ← Return to index
          </Link>
        </div>
      </div>
    );
  }

  const i = projects.findIndex((p) => p.id === slug);
  const next = projects[(i + 1) % projects.length];
  const prev = projects[(i - 1 + projects.length) % projects.length];

  const cover = project.images[0];
  const stack = project.images.slice(1);
  const pairing = stack[0] ?? cover;
  const fullbleed = stack[1] ?? stack[0] ?? cover;
  const rest = stack.slice(2);

  return (
    <div ref={root} className="bg-background text-foreground overflow-x-hidden">
      <section className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden">
        <div className="absolute inset-0 cp-reveal">
          <Image
            src={cover}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
        </div>
        <h1 className="cp-overlap font-display italic font-light leading-[0.82] tracking-[-0.04em] text-cream absolute left-[-2vw] md:left-[-1vw] bottom-[-10vw] md:bottom-[-7vw] text-[24vw] md:text-[18vw] z-10 pointer-events-none select-none">
          {project.title.toLowerCase().replace(/\s+/g, " ")}
        </h1>
      </section>

      <section className="bg-[#ece6d6] px-6 md:px-12 py-16 md:py-24 cp-fade">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {[
            { k: "Project", v: project.title },
            { k: "Location", v: project.location },
            { k: "Year", v: project.year },
            { k: "Discipline", v: project.category },
            {
              k: "Materials",
              v: project.materials.join(" · "),
            },
          ].map((row, idx) => (
            <div
              key={row.k}
              className={`col-span-12 md:col-span-${idx === 4 ? 12 : 6} ${
                idx === 4 ? "md:col-span-12" : "md:col-span-6 lg:col-span-4"
              } border-t border-foreground/15 pt-4`}
            >
              <p className={`${label} text-warm-gray mb-2`}>{row.k}</p>
              <p className="font-display text-xl md:text-2xl font-light">
                {row.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 grid grid-cols-12 gap-6 md:gap-10 cp-fade">
        <p className="col-span-12 md:col-span-2">
          <span className={`${label} text-warm-gray block`}>
            Editor&apos;s note
          </span>
          <span className="font-body text-[10px] text-foreground/30 tabular-nums">
            {String(i + 1).padStart(2, "0")} / 06
          </span>
        </p>
        <p className="col-span-12 md:col-span-7 md:col-start-4 font-display italic text-2xl md:text-3xl leading-[1.25] text-foreground/85">
          {project.description}
        </p>
      </section>

      <section className="px-6 md:px-12 pb-12">
        <div className="border-t border-foreground/15 pt-8">
          <p className={`${label} text-warm-gray mb-6`}>Plates</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {project.images.map((img, idx) => (
              <a
                key={idx}
                href={`#plate-${idx}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 33vw, 12vw"
                  />
                </div>
                <p className={`${label} text-foreground/50 mt-2 tabular-nums`}>
                  PL. {String(idx + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="plate-1" className="relative w-full cp-reveal">
        <div className="relative w-full h-[60vh] md:h-[80vh]">
          <Image
            src={fullbleed}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 grid grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="col-span-12 md:col-span-7 cp-reveal">
          <div className="relative aspect-[4/3]">
            <Image
              src={pairing}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 cp-fade">
          <p className={`${label} text-warm-gray mb-3`}>Plate notes</p>
          <p className="font-display italic text-lg md:text-xl leading-snug text-foreground/80">
            {project.subtitle}. The room is calibrated to the body and to
            the light that finds it.
          </p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed mt-4">
            {project.materials.slice(0, 3).join(", ").toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 md:py-20 cp-fade">
        <ArchitecturalSketch />
      </section>

      {rest.length > 0 && (
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {rest.map((img, idx) => {
              const span = idx % 4 === 0 ? "col-span-12 md:col-span-8" : "col-span-6 md:col-span-4";
              const aspect =
                idx % 4 === 0
                  ? "aspect-[16/10]"
                  : idx % 3 === 0
                  ? "aspect-[4/5]"
                  : "aspect-[3/2]";
              return (
                <div
                  key={idx}
                  className={`${span} cp-reveal`}
                >
                  <div className={`relative ${aspect}`}>
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                  <p className={`${label} text-foreground/40 mt-2`}>
                    PL. {String(idx + 3).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="border-t border-foreground/15 px-6 md:px-12 py-12">
        <div className="grid grid-cols-12 gap-6 items-baseline">
          <Link
            href={`/v4/work/${prev.id}`}
            className="col-span-6 md:col-span-4 group"
          >
            <p className={`${label} text-warm-gray mb-1`}>← Previous</p>
            <p className="font-display text-xl md:text-2xl font-light group-hover:text-aged-brass transition-colors">
              {prev.title}
            </p>
          </Link>
          <Link
            href="/v4/work"
            className="hidden md:flex col-span-4 justify-center"
          >
            <span className={`${label} text-foreground/60 hover:text-aged-brass transition-colors`}>
              Index
            </span>
          </Link>
          <Link
            href={`/v4/work/${next.id}`}
            className="col-span-6 md:col-span-4 group text-right"
          >
            <p className={`${label} text-warm-gray mb-1`}>Next →</p>
            <p className="font-display text-xl md:text-2xl font-light group-hover:text-aged-brass transition-colors">
              {next.title}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
