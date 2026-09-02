"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  X,
  Instagram,
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
    <section ref={sectionRef} className="bg-background">
      <div className="px-4 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="contact-block">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
                Contact
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-[-0.03em] leading-[1.02]">
                Let&apos;s start
                <br />
                <span className="italic text-foreground/70">a project.</span>
              </h1>
              <p className="font-body text-sm md:text-[15px] text-warm-gray leading-relaxed mt-5 max-w-md">
                Tell us about the space and the result you want to live with.
                We respond within 48 hours.
              </p>
            </div>

            <div className="contact-block mt-10 space-y-5">
              <a
                href="mailto:info@winteriordesign.co.ke"
                className="group flex items-start gap-4 -m-3 p-3 hover:bg-limestone/30 transition-colors"
              >
                <span className="w-10 h-10 border border-foreground/25 flex items-center justify-center shrink-0 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Mail size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Email
                  </span>
                  <span className="block font-display text-lg md:text-xl text-foreground">
                    info@winteriordesign.co.ke
                  </span>
                </span>
              </a>
              <a
                href="tel:+254728846560"
                className="group flex items-start gap-4 -m-3 p-3 hover:bg-limestone/30 transition-colors"
              >
                <span className="w-10 h-10 border border-foreground/25 flex items-center justify-center shrink-0 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Phone size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Phone
                  </span>
                  <span className="block font-display text-lg md:text-xl text-foreground">
                    +254 728 846 560
                  </span>
                  <span className="block font-display text-base md:text-lg text-foreground/70">
                    +254 755 164 654
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-4 -m-3 p-3">
                <span className="w-10 h-10 border border-foreground/25 flex items-center justify-center shrink-0">
                  <MapPin size={16} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-1">
                    Showroom
                  </span>
                  <span className="block font-body text-sm text-foreground/80 leading-relaxed">
                    Enterprise Road, Opp Hillocks Hotel
                    <br />
                    Industrial Area, Nairobi
                    <br />
                    <span className="text-foreground/55">P.O. Box 39254-00623</span>
                  </span>
                </span>
              </div>
            </div>

            <div className="contact-block mt-10 pt-6 border-t border-foreground/15">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
                Follow
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on Facebook"
                  className="w-10 h-10 border border-foreground/25 flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <Facebook size={16} strokeWidth={1.5} />
                </a>
                <a
                  href="https://x.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on X"
                  className="w-10 h-10 border border-foreground/25 flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </a>
                <a
                  href="https://instagram.com/winteriordesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Winterior Design on Instagram"
                  className="w-10 h-10 border border-foreground/25 flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 contact-block">
            <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden bg-foreground/5 mb-8">
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
                <p className="font-body text-[10px] text-cream/70 tracking-[0.3em] uppercase">
                  Visit
                </p>
                <p className="font-display text-lg md:text-xl text-cream tracking-tight">
                  Our Showroom · Mon–Sat
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="border border-aged-brass/40 bg-cream/40 p-8 md:p-10 flex items-start gap-4">
                <span className="w-10 h-10 bg-aged-brass text-charcoal flex items-center justify-center shrink-0">
                  <Check size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-2xl text-foreground mb-2">
                    Thank you.
                  </p>
                  <p className="font-body text-sm text-warm-gray leading-relaxed">
                    We&apos;ve received your message and will respond within
                    48 hours. In the meantime, reach us directly on{" "}
                    <a
                      href="tel:+254728846560"
                      className="underline decoration-aged-brass underline-offset-4 hover:text-foreground"
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
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    Name
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-transparent border-b border-foreground/25 focus:border-foreground py-2 font-body text-base text-foreground placeholder:text-warm-gray/60 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-transparent border-b border-foreground/25 focus:border-foreground py-2 font-body text-base text-foreground placeholder:text-warm-gray/60 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    Phone
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254 …"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-transparent border-b border-foreground/25 focus:border-foreground py-2 font-body text-base text-foreground placeholder:text-warm-gray/60 outline-none transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-1">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    Service
                  </span>
                  <select
                    name="service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="bg-transparent border-b border-foreground/25 focus:border-foreground py-2 font-body text-base text-foreground outline-none transition-colors"
                  >
                    <option value="" disabled className="bg-background text-warm-gray">
                      Choose a service
                    </option>
                    <option value="kitchen" className="bg-background">Kitchen</option>
                    <option value="wardrobe" className="bg-background">Wardrobe</option>
                    <option value="bath" className="bg-background">Bath Vanity</option>
                    <option value="shop" className="bg-background">Shop Fit-Out</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us about the space, the result you want, and when you'd like to start."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-transparent border-b border-foreground/25 focus:border-foreground py-2 font-body text-base text-foreground placeholder:text-warm-gray/60 outline-none resize-none transition-colors"
                  />
                </label>
                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                    We respond within 48 hours
                  </p>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-3 font-body text-[10px] tracking-[0.3em] uppercase bg-foreground text-background px-5 py-3 hover:bg-aged-brass transition-colors"
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
