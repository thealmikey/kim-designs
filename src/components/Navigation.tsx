"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Projects" },
  { href: "/studio", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const pathname = usePathname();
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [ctaT, setCtaT] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setScrollPct(Math.min(100, (y / max) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Magnetic CTA — gentle pull toward cursor
  const onCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.18;
    setCtaT({ x, y });
  };
  const onCtaLeave = () => setCtaT({ x: 0, y: 0 });

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOpen
            ? "bg-[#F5F1E9]/95 backdrop-blur-lg border-b border-[#171716]/10 shadow-[0_6px_28px_-18px_rgba(23,23,22,0.45)]"
            : "bg-[#F5F1E9] border-b border-transparent"
        }`}
      >
        {/* Top utility strip (Wood Kivu-style) */}
        <div className="hidden lg:block bg-[#171716] text-[#F5F1E9] text-[10px] tracking-[0.25em] uppercase font-body font-semibold">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-7">
            <p className="flex items-center gap-6 text-[#F5F1E9]/85">
              <a
                href="tel:+254755164654"
                className="hover:text-[#A68A64] transition-colors"
              >
                +254 755 164 654
              </a>
              <span className="text-[#F5F1E9]/30">·</span>
              <a
                href="mailto:info@winteriordesign.co.ke"
                className="hover:text-[#A68A64] transition-colors"
              >
                info@winteriordesign.co.ke
              </a>
              <span className="text-[#F5F1E9]/30">·</span>
              <span>Enterprise Rd, Nairobi</span>
            </p>
            <a
              href="https://wa.me/254728846560"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#25D366] text-[#171716] hover:bg-[#F5F1E9] transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Scroll progress hairline */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#A68A64] via-[#A68A64] to-[#E89A6A] transition-[width] duration-150"
          style={{ width: `${scrollPct}%` }}
        />

        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-3 md:py-4">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Winterior Design home"
          >
            <span
              className="relative block transition-transform duration-300 group-hover:scale-[1.04]"
              style={{
                height: "60px",
                width: "60px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/winterior-mark.png"
                alt="Winterior Design"
                fill
                priority
                sizes="60px"
                className="object-contain"
              />
            </span>
            <span className="relative flex flex-col items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform duration-300">
              <span
                className="relative block"
                style={{ width: "200px", height: "38px" }}
              >
                <Image
                  src="/winterior-wordmark.png"
                  alt="WINTERIOR"
                  fill
                  priority
                  sizes="200px"
                  className="object-contain"
                />
              </span>
              <span
                className="relative block"
                style={{ width: "88px", height: "25px" }}
              >
                <Image
                  src="/winterior-design.png"
                  alt="DESIGN"
                  fill
                  priority
                  sizes="88px"
                  className="object-contain"
                />
              </span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              const isHover = hoverIdx === i;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  className="relative px-3 lg:px-4 py-2 group"
                >
                  <span
                    className={`font-body text-[12px] lg:text-[13px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 ${
                      isActive
                        ? "text-[#A68A64]"
                        : isHover
                        ? "text-[#A68A64]"
                        : "text-[#171716]"
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* Animated underline */}
                  <span
                    aria-hidden
                    className={`absolute left-3 right-3 lg:left-4 lg:right-4 bottom-1 h-[2px] bg-[#A68A64] origin-left transition-transform duration-300 ${
                      isActive || isHover ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  {/* Hover dot */}
                  <span
                    aria-hidden
                    className={`absolute -top-0.5 right-2 w-1 h-1 rounded-full bg-[#A68A64] transition-opacity duration-200 ${
                      isHover ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right: WhatsApp + magnetic CTA */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <a
              href="https://wa.me/254728846560"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-10 h-10 flex items-center justify-center border-2 border-[#171716]/15 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white text-[#171716] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
            <a
              ref={ctaRef}
              href="/contact"
              onMouseMove={onCtaMove}
              onMouseLeave={onCtaLeave}
              className="relative inline-flex items-center gap-2 bg-[#171716] text-[#F5F1E9] px-5 lg:px-6 py-3 font-body text-[11px] lg:text-[12px] font-bold tracking-[0.22em] uppercase overflow-hidden group"
              style={{
                transform: `translate(${ctaT.x}px, ${ctaT.y}px)`,
                transition: "transform 250ms ease-out",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-[#A68A64] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
              />
              <span className="relative">Get a Quote</span>
              <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center text-[#171716]"
            aria-label="Toggle menu"
          >
            <span
              className={`block absolute w-6 h-[2px] bg-[#171716] transition-all duration-500 origin-center ${
                isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`block absolute w-6 h-[2px] bg-[#171716] transition-all duration-500 origin-center ${
                isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#F5F1E9] flex flex-col pt-24">
          <div className="bg-[#171716] text-[#F5F1E9] px-6 py-3 text-[10px] tracking-[0.25em] uppercase font-body font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#A68A64] rounded-full animate-pulse" />
              Now booking Q4 2026
            </span>
            <a href="tel:+254728846560" className="hover:text-[#A68A64]">
              Call us
            </a>
          </div>
          <nav className="flex-1 flex flex-col items-start justify-center px-8 gap-6">
            {navLinks.map((link, i) => (
              <div
                key={link.href}
                className="overflow-hidden"
                style={{
                  animation: `fadeUp 0.7s ease-out ${i * 0.1}s both`,
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-display text-5xl sm:text-6xl font-light tracking-tight transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-[#A68A64]"
                      : "text-[#171716] hover:text-[#A68A64]"
                  }`}
                >
                  <span className="text-[#A68A64] text-sm font-body tracking-[0.3em] uppercase font-semibold mr-3 align-middle">
                    0{i + 1}
                  </span>
                  {link.label}
                </Link>
              </div>
            ))}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="font-body text-[12px] tracking-[0.22em] uppercase font-bold bg-[#171716] text-[#F5F1E9] px-6 py-4 text-center hover:bg-[#A68A64] transition-colors"
              >
                Get a Quote →
              </Link>
              <a
                href="https://wa.me/254728846560"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] tracking-[0.22em] uppercase font-bold border-2 border-[#25D366] text-[#25D366] px-6 py-4 text-center hover:bg-[#25D366] hover:text-white transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </nav>

          <div className="border-t border-[#171716]/15 px-8 py-6 flex justify-between text-xs font-body text-[#171716]/70">
            <span>info@winteriordesign.co.ke</span>
            <span>+254 728 846 560</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}