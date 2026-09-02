"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const wipImages = [
  { src: "/images/wardrobe-installation-process/01.jpg", alt: "Wardrobe installation — framing" },
  { src: "/images/wardrobe-installation-process/02.jpg", alt: "Wardrobe installation — door fitting" },
  { src: "/images/classic-wardrobe/01.jpg", alt: "Classic wardrobe — site mockup" },
  { src: "/images/classic-wardrobe/04.jpg", alt: "Classic wardrobe — mid build" },
  { src: "/images/classic-wardrobe/08.jpg", alt: "Classic wardrobe — door adjustment" },
  { src: "/images/under-stairs-wardrobe/01.jpg", alt: "Under-stairs wardrobe — fitting" },
];

export default function WorkInProgress() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
      tl.fromTo(
        ".wip-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      ).fromTo(
        ".wip-tile",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-background border-t border-sand/30"
      aria-labelledby="wip-heading"
    >
      <div className="px-4 md:px-12 py-20 md:py-28">
        <div className="wip-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
              Currently On Site
            </p>
            <h2
              id="wip-heading"
              className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-foreground tracking-[-0.03em] leading-[1.05]"
            >
              Work in <span className="italic text-foreground/70">progress.</span>
            </h2>
          </div>
          <p className="font-body text-sm md:text-[15px] text-warm-gray max-w-md leading-relaxed">
            Active commissions across Nairobi — from first site visit to
            final handover. We share these for transparency and to show the
            work that isn&apos;t yet on the gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {wipImages.map((img, i) => (
            <figure
              key={img.src + i}
              className={`wip-tile relative overflow-hidden bg-foreground/5 ${
                i === 0
                  ? "col-span-2 md:col-span-2 aspect-[16/9]"
                  : "col-span-1 aspect-square"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              <figcaption className="absolute bottom-2 left-2 md:bottom-3 md:left-3 font-body text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-cream/85">
                In progress
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
