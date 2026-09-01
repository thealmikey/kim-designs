"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOpen
            ? "bg-background/90 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav
          className={`flex items-center justify-between px-6 md:px-12 lg:px-16 transition-all duration-500 ${
            scrolled || isOpen ? "py-2.5 md:py-3" : "py-4 md:py-5"
          }`}
        >
          <Link
            href="/"
            className={`font-display font-semibold tracking-tight transition-all duration-500 ${
              scrolled || isOpen
                ? "text-xl md:text-2xl text-foreground"
                : "text-2xl md:text-3xl text-cream"
            }`}
          >
            KIM
          </Link>

          <div className="hidden md:flex items-center gap-14">
            <Link
              href="/v2/work"
              className={`font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all duration-300 ${
                scrolled || isOpen
                  ? "border-aged-brass/40 text-aged-brass hover:bg-aged-brass hover:text-background"
                  : "border-cream/30 text-cream/70 hover:border-cream hover:text-cream"
              }`}
            >
              Archive
            </Link>
            <Link
              href="/v3/work"
              className={`font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all duration-300 ${
                scrolled || isOpen
                  ? "border-aged-brass/40 text-aged-brass hover:bg-aged-brass hover:text-background"
                  : "border-cream/30 text-cream/70 hover:border-cream hover:text-cream"
              }`}
            >
              Viewing
            </Link>
            <Link
              href="/v4/work"
              className={`font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all duration-300 ${
                scrolled || isOpen
                  ? "border-aged-brass/40 text-aged-brass hover:bg-aged-brass hover:text-background"
                  : "border-cream/30 text-cream/70 hover:border-cream hover:text-cream"
              }`}
            >
              Collision
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs tracking-[0.25em] uppercase transition-all duration-300 relative py-2 ${
                  scrolled || isOpen
                    ? "text-warm-gray hover:text-foreground"
                    : "text-cream/70 hover:text-cream"
                } ${
                  pathname === link.href ? "font-medium" : ""
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-px transition-colors duration-300 ${
                      scrolled || isOpen ? "bg-aged-brass" : "bg-cream"
                    }`}
                  />
                )}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden relative w-11 h-11 flex items-center justify-center transition-colors duration-500 ${
              scrolled || isOpen ? "text-foreground" : "text-cream"
            }`}
            aria-label="Toggle menu"
          >
            <span
              className={`block absolute w-6 h-px transition-all duration-500 origin-center ${
                isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`block absolute w-6 h-px transition-all duration-500 origin-center ${
                isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
              }`}
            />
          </button>
        </nav>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background flex items-center justify-center">
          <nav className="flex flex-col items-center gap-10 md:gap-14">
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
                  className={`font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-aged-brass"
                      : "text-foreground hover:text-aged-brass"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="absolute bottom-16 left-0 right-0 text-center">
            <p className="font-body text-sm text-warm-gray tracking-[0.3em] uppercase">
              Kim Interior Designs
            </p>
            <p className="font-body text-xs text-stone mt-3 tracking-widest">
              Nairobi, Kenya
            </p>
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
