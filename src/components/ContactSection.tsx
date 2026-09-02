"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
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
        ".contact-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".contact-text",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".contact-link",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".contact-meta",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-charcoal text-cream py-24 md:py-32 lg:py-40"
    >
      <div className="px-6 md:px-12">
        <div className="max-w-5xl">
          <div className="contact-header">
            <p className="font-body text-[10px] text-cream/40 tracking-[0.4em] uppercase mb-6">
              Start a Conversation
            </p>
          </div>
          <h2 className="contact-text font-display text-4xl md:text-6xl lg:text-7xl xl:text-[6rem] font-light tracking-tight leading-[1.05]">
            Let&apos;s discuss
            <br />
            <span className="italic text-cream/70">your project</span>
          </h2>
          <p className="contact-text font-body text-base md:text-lg text-cream/50 mt-8 max-w-xl leading-relaxed">
            Begin with a free consultation. Tell us about your space, your
            routine, and the result you want to live with — and we&apos;ll
            shape a design that responds to all three.
          </p>

          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6">
            <Link
              href="mailto:info@winteriordesign.co.ke"
              className="contact-link inline-flex items-center gap-4 font-body text-sm text-cream border border-cream/20 px-8 py-5 hover:bg-cream hover:text-charcoal transition-all duration-500 group"
            >
              <span className="w-6 h-px bg-cream/40 group-hover:bg-charcoal transition-colors" />
              info@winteriordesign.co.ke
            </Link>
            <Link
              href="tel:+254728846560"
              className="contact-link inline-flex items-center gap-4 font-body text-sm text-cream border border-cream/20 px-8 py-5 hover:bg-cream hover:text-charcoal transition-all duration-500 group"
            >
              <span className="w-6 h-px bg-cream/40 group-hover:bg-charcoal transition-colors" />
              +254 728 846 560
            </Link>
          </div>

          <div className="contact-meta mt-16 md:mt-24 pt-12 border-t border-cream/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <p className="font-body text-[10px] text-cream/30 tracking-[0.3em] uppercase mb-3">
                  Showroom
                </p>
                <p className="font-body text-sm text-cream/60 leading-relaxed">
                  Enterprise Road, Opp Hillocks Hotel
                  <br />
                  Industrial Area, Nairobi
                </p>
              </div>
              <div>
                <p className="font-body text-[10px] text-cream/30 tracking-[0.3em] uppercase mb-3">
                  Phone
                </p>
                <p className="font-body text-sm text-cream/60">
                  <a
                    href="tel:+254728846560"
                    className="hover:text-cream transition-colors"
                  >
                    +254 728 846 560
                  </a>
                  <br />
                  <a
                    href="tel:+254755164654"
                    className="hover:text-cream transition-colors"
                  >
                    +254 755 164 654
                  </a>
                </p>
              </div>
              <div>
                <p className="font-body text-[10px] text-cream/30 tracking-[0.3em] uppercase mb-3">
                  Mail
                </p>
                <p className="font-body text-sm text-cream/60">
                  <a
                    href="mailto:info@winteriordesign.co.ke"
                    className="hover:text-cream transition-colors"
                  >
                    info@winteriordesign.co.ke
                  </a>
                  <br />
                  <span className="text-cream/40">
                    P.O. Box 39254-00623
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
