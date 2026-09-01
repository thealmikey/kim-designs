"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".project-panel");

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${(trackRef.current?.scrollWidth || 0) - window.innerWidth}`,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-charcoal text-cream overflow-hidden">
      <div className="px-6 md:px-12 py-16 md:py-24">
        <p className="font-body text-[10px] text-cream/40 tracking-[0.4em] uppercase">
          The Collection — scroll horizontally
        </p>
      </div>

      <div ref={trackRef} className="flex whitespace-nowrap">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="project-panel flex-shrink-0 w-[85vw] md:w-[70vw] h-[70vh] md:h-[80vh] relative px-4 md:px-8"
          >
            <Link href={`/projects/${project.id}`} className="block h-full relative group">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <span className="font-body text-[10px] text-cream/50 tracking-[0.3em] uppercase mb-3">
                  {String(i + 1).padStart(2, "0")} — {project.category}
                </span>
                <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-cream tracking-tight">
                  {project.title}
                </h3>
                <p className="font-display text-xl md:text-2xl text-cream/60 mt-2 italic">
                  {project.subtitle}
                </p>
                <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="w-8 h-px bg-cream/60" />
                  <span className="font-body text-xs text-cream/80 tracking-[0.2em] uppercase">
                    View Project
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
