"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<Element>(".project-card");

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
            delay: i % 3 === 0 ? 0 : 0.08,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-background py-16 md:py-24">
      <div ref={gridRef} className="px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="project-card group relative block aspect-[4/5] overflow-hidden"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

              <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
                <div className="transform transition-transform duration-700 ease-out group-hover:-translate-y-2">
                  <p className="font-body text-[10px] text-cream/60 tracking-[0.3em] uppercase mb-2 md:mb-3">
                    {String(i + 1).padStart(2, "0")} — {project.category}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-cream tracking-tight leading-[1.05]">
                    {project.title}
                  </h3>
                  <p className="font-display text-base md:text-lg text-cream/70 mt-1.5 italic">
                    {project.subtitle}
                  </p>
                </div>

                <div className="mt-5 md:mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="w-8 h-px bg-cream/70" />
                  <span className="font-body text-[10px] text-cream/90 tracking-[0.25em] uppercase">
                    View Project
                  </span>
                </div>
              </div>

              {hoveredId === project.id && (
                <div className="absolute top-5 right-5 md:top-7 md:right-7">
                  <span className="font-body text-[10px] text-cream/80 tracking-[0.3em] uppercase border border-cream/30 px-2.5 py-1 backdrop-blur-sm">
                    {project.year}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
