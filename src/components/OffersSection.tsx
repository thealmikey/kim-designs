"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const offers = [
  {
    number: "01",
    title: "Interior Expertise",
    body: "We are dedicated to creating interiors that reflect our client\u2019s personality and lifestyle by capturing their design dreams and making them a reality. We listen to our clients until the desired product is achieved.",
  },
  {
    number: "02",
    title: "Award Winning",
    body: "We are passionate about interior design and see it as an expression of creativity and potential, which transcends language barriers and speaks to everyone. Winning interior designer awards is an amazing experience.",
  },
  {
    number: "03",
    title: "Free Consultation",
    body: "We start with consultation to discover your desires. Regardless of the profession that our clients have, being open to consultation and modification of their services to the liking of our customers is important.",
  },
];

export default function OffersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
      tl.fromTo(
        ".offers-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      )
        .fromTo(
          ".offer-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.5"
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-limestone/20 border-y border-sand/30 md:min-h-[80vh] md:flex md:items-center"
      aria-labelledby="offers-heading"
    >
      <div className="px-4 md:px-12 py-20 md:py-28 w-full">
        <div className="offers-header mb-12 md:mb-16 max-w-3xl">
          <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
            The Best Offers
          </p>
          <h2
            id="offers-heading"
            className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.1]"
          >
            What sets us
            <br />
            <span className="italic text-foreground/70">apart.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand/30">
          {offers.map((o) => (
            <article
              key={o.title}
              className="offer-card bg-background p-7 md:p-10 group hover:bg-cream/40 transition-colors duration-700"
            >
              <p className="font-body text-[10px] text-stone tracking-[0.3em] mb-5">
                {o.number}
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-4 group-hover:text-aged-brass transition-colors duration-500">
                {o.title}
              </h3>
              <p className="font-body text-sm md:text-[15px] text-warm-gray leading-relaxed">
                {o.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
