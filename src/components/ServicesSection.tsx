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
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="px-6 md:px-12">
{/* Balances the heading across the full width. Previously this was a lone
            left-aligned block, so the right half of the row sat empty. */}
        <div className="services-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <p className="font-body text-[10px] text-[#FF6600] tracking-[0.4em] uppercase mb-4 font-bold">
              Expertise
            </p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-[#333333] tracking-[-0.01em] leading-[1.05]">
              What we<br />
              <span className="italic text-[#333333]/80">do</span>
            </h2>
          </div>
          <p className="font-body text-sm md:text-[15px] text-[#333333]/85 leading-relaxed md:max-w-md md:text-right shrink-0">
            Four disciplines, one studio. We design, build and install every
            piece ourselves, so the drawing you approve is the joinery that
            reaches your site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#C6C5CA]">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="service-item bg-white p-8 md:p-12 lg:p-16 group hover:bg-[#F4F4F4] transition-colors duration-700"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-body text-[10px] text-[#333333]/55 tracking-[0.3em]">
                  {service.number}
                </span>
                <Link
                  href="/contact"
                  className="font-body text-[10px] text-[#333333]/75 group-hover:text-[#FF6600] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0"
                >
                  Inquire
                </Link>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-light text-[#333333] mb-4 group-hover:text-[#FF6600] transition-colors duration-500">
                {service.title}
              </h3>
              <p className="font-body text-sm md:text-base text-[#333333]/65 leading-relaxed max-w-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
