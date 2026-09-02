"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const process = [
  {
    n: "01",
    title: "Listen",
    body: "We start with a free consultation — on site, on the phone, or at our Enterprise Road studio. We listen to how you use the space, what you keep, and what frustrates you. We measure, photograph, and document.",
    output: "Site visit · brief · initial measurements",
  },
  {
    n: "02",
    title: "Design",
    body: "We translate that brief into a working drawing and a material palette — finishes, hardware, lighting, joinery details. You see the kitchen, wardrobe, or shop fit-out before a single sheet of MDF is cut.",
    output: "Drawings · 3D · material samples",
  },
  {
    n: "03",
    title: "Craft",
    body: "Our workshop builds every piece to drawing, with dust-aware off-site assembly where possible. Brass hinges, soft-close runners, and integrated lighting are installed with the precision you can feel every time you open a door.",
    output: "Workshop build · quality checks",
  },
  {
    n: "04",
    title: "Install",
    body: "Our installation team works to a clean, dust-aware process. We protect floors, walls, and existing finishes. Final door adjustments, snagging, and a walk-through handover before we leave the site.",
    output: "On-site install · handover · aftercare",
  },
];

const materials = [
  "PVC Foilwrap",
  "High Gloss",
  "Melanin",
  "Mahogany",
  "Spray Paint",
  "Quartz",
  "Brass",
  "Stone",
];

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.fromTo(
        ".studio-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".studio-step",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .fromTo(
          ".studio-image",
          { scale: 1.12, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=1"
        )
        .fromTo(
          ".studio-materials",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <section ref={sectionRef} className="bg-limestone/20">
      <div className="px-4 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="studio-header">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-5">
                Philosophy
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-[-0.03em] leading-[1.1] max-w-2xl">
                For a house to be successful, the objects in it must
                <span className="italic text-foreground/70"> communicate.</span>
              </h2>
            </div>

            <ol className="mt-12 md:mt-16 border-t border-foreground/15">
              {process.map((step) => (
                <li
                  key={step.n}
                  className="studio-step grid grid-cols-12 gap-4 md:gap-6 py-7 md:py-9 border-b border-foreground/15"
                >
                  <span className="col-span-2 md:col-span-1 font-body text-xs md:text-sm text-aged-brass tracking-[0.2em] tabular-nums pt-1">
                    {step.n}
                  </span>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="font-display text-2xl md:text-3xl font-light text-foreground tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm md:text-[15px] text-warm-gray leading-relaxed mt-3 max-w-2xl">
                      {step.body}
                    </p>
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/55 mt-4">
                      {step.output}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {featuredProjects.map((project, i) => (
                <div
                  key={project.id}
                  className={`studio-image relative overflow-hidden ${
                    i === 0
                      ? "col-span-12 aspect-[16/10]"
                      : i === 1
                      ? "col-span-7 aspect-[4/5]"
                      : "col-span-5 aspect-square"
                  }`}
                >
                  <Image
                    src={project.images[i + 1] || project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>

            <div>
              <p className="studio-materials font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-5">
                What we work with
              </p>
              <ul className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <li
                    key={material}
                    className="studio-materials font-body text-xs text-charcoal bg-cream/80 px-4 py-2 rounded-full"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/contact"
              className="studio-materials group inline-flex items-center gap-3 font-body text-[10px] text-warm-gray hover:text-foreground transition-colors tracking-[0.3em] uppercase"
            >
              <span className="w-8 h-px bg-warm-gray group-hover:bg-foreground group-hover:w-12 transition-all" />
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
