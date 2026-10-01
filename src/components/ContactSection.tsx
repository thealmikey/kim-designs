"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Check,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
      tl.fromTo(
        ".contact-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      ).fromTo(
        ".contact-block",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="px-4 md:px-12 pt-[calc(var(--nav-two-row-height)+3rem)] pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="contact-block">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
                Contact
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-[#333333] tracking-[-0.03em] leading-[1.02]">
                Let&apos;s start
                <br />
                <span className="italic text-[#333333]/80">a project.</span>
              </h1>
              <p className="font-body text-sm md:text-[15px] text-warm-gray leading-relaxed mt-5 max-w-md">
                Tell us about the space and the result you want to live with.
                We respond within 48 hours.
              </p>
            </div>

            <div className="contact-block mt-10 space-y-5">
              <a
                href="mailto:info@winteriordesign.co.ke"
                className="group flex items-start gap-4 -m-3 p-3 hover:bg-[#F4F4F4] transition-colors"
              >
                <span className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center shrink-0 group-hover:border-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-[#FFFFFF] transition-colors">
                  <Mail size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Email
                  </span>
                  <span className="block font-display text-lg md:text-xl text-[#333333]">
                    info@winteriordesign.co.ke
                  </span>
                </span>
              </a>
              <a
                href="tel:+254728846560"
                className="group flex items-start gap-4 -m-3 p-3 hover:bg-[#F4F4F4] transition-colors"
              >
                <span className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center shrink-0 group-hover:border-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-[#FFFFFF] transition-colors">
                  <Phone size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Phone
                  </span>
                  <span className="block font-display text-lg md:text-xl text-[#333333]">
                    +254 728 846 560
                  </span>
                  <span className="block font-display text-base md:text-lg text-[#333333]/80">
                    +254 755 164 654
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-4 -m-3 p-3">
                <span className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center shrink-0">
                  <MapPin size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Showroom
                  </span>
                  <span className="block font-body text-sm text-[#333333]/85 leading-relaxed">
                    Enterprise Road, Opp Hillocks Hotel
                    <br />
                    Industrial Area, Nairobi
                    <br />
                    <span className="text-[#333333]/70">P.O. Box 39254-00623</span>
                  </span>
                </span>
              </div>
            </div>

            <div className="contact-block mt-10 pt-6 border-t border-[#C6C5CA]">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
                Follow
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on Facebook"
                  className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-[#FFFFFF] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on X"
                  className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-[#FFFFFF] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on Instagram"
                  className="w-10 h-10 border border-[#C6C5CA] flex items-center justify-center hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-[#FFFFFF] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 contact-block">
            <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden bg-[#F4F4F4] mb-8">
              <Image
                src="/images/pvc-foilwrap-and-high-gloss-handless-kitchen/02.jpg"
                alt="Winterior Design showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 md:bottom-5 md:left-6">
                <p className="font-body text-[10px] text-[#333333]/70 tracking-[0.3em] uppercase">
                  Visit
                </p>
                <p className="font-display text-lg md:text-xl text-[#333333] tracking-tight">
                  Our Showroom · Mon–Sat
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="border border-aged-brass/40 bg-[#F4F4F4] p-8 md:p-10 flex items-start gap-4">
                <span className="w-10 h-10 bg-[#FF6600] text-[#FFFFFF] flex items-center justify-center shrink-0">
                  <Check size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-2xl text-[#333333] mb-2">
                    Thank you.
                  </p>
                  <p className="font-body text-sm text-warm-gray leading-relaxed">
                    We&apos;ve received your message and will respond within
                    48 hours. In the meantime, reach us directly on{" "}
                    <a
                      href="tel:+254728846560"
                      className="underline decoration-[#FF6600] underline-offset-4 hover:text-[#333333]"
                    >
                      +254 728 846 560
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                noValidate
              >
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    Name
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-transparent border-b border-[#C6C5CA] focus:border-[#FF6600] py-2 font-body text-base text-[#333333] placeholder:text-[#333333]/40 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-transparent border-b border-[#C6C5CA] focus:border-[#FF6600] py-2 font-body text-base text-[#333333] placeholder:text-[#333333]/40 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    Phone
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254 …"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-transparent border-b border-[#C6C5CA] focus:border-[#FF6600] py-2 font-body text-base text-[#333333] placeholder:text-[#333333]/40 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    Service
                  </span>
                  <select
                    name="service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="bg-transparent border-b border-[#C6C5CA] focus:border-[#FF6600] py-2 font-body text-base text-[#333333] outline-none transition-colors"
                  >
                    <option value="" disabled className="bg-white text-warm-gray">
                      Choose a service
                    </option>
                    <option value="kitchen" className="bg-white">Kitchen</option>
                    <option value="wardrobe" className="bg-white">Wardrobe</option>
                    <option value="bath" className="bg-white">Bath Vanity</option>
                    <option value="shop" className="bg-white">Shop Fit-Out</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us about the space, the result you want, and when you'd like to start."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-transparent border-b border-[#C6C5CA] focus:border-[#FF6600] py-2 font-body text-base text-[#333333] placeholder:text-[#333333]/40 outline-none resize-none transition-colors"
                  />
                </label>
                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
                  <p className="font-body text-[11px] tracking-[0.3em] uppercase text-warm-gray">
                    We respond within 48 hours
                  </p>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-3 font-body text-[11px] tracking-[0.3em] uppercase bg-[#FF6600] text-[#FFFFFF] px-5 py-3 hover:bg-[#D95500] transition-colors"
                  >
                    Send message
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
