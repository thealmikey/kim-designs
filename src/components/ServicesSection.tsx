"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Elegant Kitchen Designs",
    description:
      "Bespoke kitchens in PVC foilwrap, high-gloss, melanin, mahogany, and spray-painted finishes — precision joinery, handleless compositions, and surfaces that age beautifully.",
  },
  {
    number: "02",
    title: "Modern Bathroom Designs",
    description:
      "Bath vanities designed for daily ritual and quiet luxury. Refined cabinetry, integrated storage, and material palettes that bring calm to the room.",
  },
  {
    number: "03",
    title: "Vibrant Shop Fit-Outs",
    description:
      "Designing interiors for businesses — retail, hospitality, and commercial spaces that translate brand identity into spatial experience.",
  },
  {
    number: "04",
    title: "Amazing Wardrobe Designs",
    description:
      "Custom wardrobes tailored to the rhythm of the room and the way you dress. From handleless built-ins to walk-in dressing suites.",
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
