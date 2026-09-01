"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Bespoke Cabinetry",
    description:
      "Custom wardrobes, kitchen units, and storage systems designed with precision joinery and refined materiality.",
  },
  {
    number: "02",
    title: "Interior Finishes",
    description:
      "Melanin finishes, spray paint, foilwrap, and high-gloss surfaces that define the character of a space.",
  },
  {
    number: "03",
    title: "Material Consultation",
    description:
      "Expert guidance on material selection, from solid hardwoods to modern composites, ensuring longevity and beauty.",
  },
  {
    number: "04",
    title: "Spatial Design",
    description:
      "Complete interior compositions that balance proportion, light, and flow for residential and commercial spaces.",
  },
];

export default function ServicesSection() {
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
        ".services-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".service-item",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32">
      <div className="px-6 md:px-12">
        <div className="services-header mb-16 md:mb-24">
          <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
            Expertise
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]">
            What we<br />
            <span className="italic text-foreground/70">do</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-sand/20">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="service-item bg-background p-8 md:p-12 lg:p-16 group hover:bg-limestone/10 transition-colors duration-700"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-body text-[10px] text-stone tracking-[0.3em]">
                  {service.number}
                </span>
                <Link
                  href="/contact"
                  className="font-body text-[10px] text-warm-gray group-hover:text-foreground tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0"
                >
                  Inquire
                </Link>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-4 group-hover:text-aged-brass transition-colors duration-500">
                {service.title}
              </h3>
              <p className="font-body text-sm md:text-base text-warm-gray leading-relaxed max-w-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
