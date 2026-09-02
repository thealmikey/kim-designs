"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

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
          ".studio-text",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".studio-image",
          { scale: 1.15, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.4, stagger: 0.1, ease: "power2.out" },
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
    <section ref={sectionRef} className="bg-limestone/20 py-24 md:py-32">
      <div className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="studio-header">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-6">
                Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.1]">
                For a house to be successful,
                <br />
                <span className="italic text-foreground/70">
                  the objects in it must communicate.
                </span>
              </h2>
            </div>

            <div className="mt-10 md:mt-14 space-y-6">
              <p className="studio-text font-body text-base md:text-lg text-warm-gray leading-relaxed">
                Winterior Design is a Nairobi-based kitchen, wardrobe, and
                bath vanities centre. We craft interiors where every surface,
                fitting, and finish responds to the next — balancing
                craftsmanship with the way you actually live.
              </p>
              <p className="studio-text font-body text-base md:text-lg text-warm-gray leading-relaxed">
                We listen first. We study how light moves, how a room is used,
                what the space is asking for. From that conversation we design
                kitchens that feel inevitable, wardrobes that feel tailored,
                and bathrooms that feel quietly luxurious.
              </p>
            </div>

            <div className="mt-12 md:mt-16">
              <p className="studio-materials font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-5">
                What we work with
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "PVC Foilwrap",
                  "High Gloss",
                  "Melanin",
                  "Mahogany",
                  "Spray Paint",
                  "Quartz",
                  "Brass",
                  "Stone",
                ].map((material) => (
                  <span
                    key={material}
                    className="studio-materials font-body text-xs text-charcoal bg-cream/80 px-4 py-2 rounded-full"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 font-body text-xs text-warm-gray hover:text-foreground transition-colors tracking-[0.25em] uppercase"
              >
                <span className="w-8 h-px bg-warm-gray group-hover:bg-foreground transition-colors" />
                Our Process
              </Link>
            </div>
          </div>

          <div className="relative">
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
