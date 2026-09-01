"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % projects.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        overlayRef.current,
        { scaleY: 1, transformOrigin: "top" },
        { scaleY: 0, duration: 1.4, delay: 0.3 }
      )
        .fromTo(
          imageRef.current,
          { scale: 1.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2 },
          "-=1"
        )
        .fromTo(
          textRef.current?.children || [],
          { y: 120, opacity: 0, rotateX: -15 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.12 },
          "-=1.4"
        );

      gsap.to(imageRef.current, {
        scale: 1.2,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(textRef.current, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(overlayRef.current, {
        scaleY: 1,
        transformOrigin: "bottom",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-charcoal"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 opacity-0"
      >
        <Image
          key={projects[currentImage].id}
          src={projects[currentImage].images[0]}
          alt={projects[currentImage].title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-charcoal z-20 scale-y-100"
      />

      <div
        ref={textRef}
        className="relative z-30 h-full flex flex-col justify-end px-6 md:px-12 pt-24 md:pt-28 pb-16 md:pb-24"
      >
        <div className="max-w-5xl">
          <p className="font-body text-[10px] md:text-xs text-cream/50 tracking-[0.4em] uppercase mb-6 md:mb-8">
            Interior Design Studio — Nairobi, Kenya
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[8.5rem] xl:text-[10rem] font-light text-cream leading-[0.85] tracking-tight">
            Spaces<br />
            <span className="italic font-light text-cream/90">crafted</span><br />
            with intent
          </h1>
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <p className="font-body text-sm md:text-base text-cream/50 max-w-sm leading-relaxed">
              We design interiors that speak through material, proportion, and light.
              Each project is a study in restraint and refinement.
            </p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 font-body text-xs text-cream/60 hover:text-cream transition-colors tracking-[0.25em] uppercase"
            >
              <span className="w-12 h-px bg-cream/30 group-hover:bg-cream transition-colors" />
              View Work
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 z-30 flex flex-col gap-3">
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => setCurrentImage(i)}
            className={`w-px h-8 md:h-12 transition-all duration-700 ${
              i === currentImage ? "bg-cream" : "bg-cream/20 hover:bg-cream/50"
            }`}
            aria-label={`View project: ${project.title}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 z-30">
        <p className="font-body text-[10px] text-cream/30 tracking-[0.3em] uppercase">
          Scroll to explore
        </p>
      </div>

      <div className="hidden md:block absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30">
        <p className="font-body text-[10px] text-cream/20 tracking-[0.4em] uppercase" style={{ writingMode: "vertical-rl" }}>
          Kim Interior Designs — Nairobi
        </p>
      </div>
    </section>
  );
}
