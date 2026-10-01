"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileDrawer from "@/components/navigation/MobileDrawer";

const NAV_ITEMS = [
  { href: "/studio", label: "About Us" },
  { href: "/kitchens", label: "Kitchens" },
  { href: "/wardrobes", label: "Wardrobes" },
  { href: "/services", label: "How we do it" },
  { href: "/contact", label: "Contact Us" },
];

const TOP_CONTACT = [
  { href: "mailto:info@winteriordesign.co.ke", label: "info@winteriordesign.co.ke", icon: "mail" },
  { href: "tel:+254728846560", label: "+254 728 846 560", icon: "phone" },
];

export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href + "?");
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-lg border-b border-[#C6C5CA] shadow-[0_2px_16px_rgba(51,51,51,0.06)]"
            : "bg-white border-b border-transparent"
        }`}
        style={{ height: "var(--nav-two-row-height)" }}
      >
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between px-6 h-[var(--topbar-height)] bg-white border-b border-[#C6C5CA]">
          <div className="flex items-center gap-6 text-[12px] font-body text-[#6F7072]">
            {TOP_CONTACT.map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-2 hover:text-[#FF6600] transition-colors">
                <span>{item.icon === "mail" ? "✉" : "📞"}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/254728846560"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FF6600] text-[#FFFFFF] font-body text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-[#D95500] transition-colors"
            >
              <span>💬</span>
              <span>WhatsApp Us</span>
            </a>
            <a
              href="https://www.instagram.com/woodkivuinteriors/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border border-[#C6C5CA] text-[#333333] hover:border-[#FF6600] hover:bg-[#FFF1E8] transition-colors"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex h-[calc(var(--nav-two-row-height)-var(--topbar-height))] px-6 lg:px-16 items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Winterior Design home"
          >
            <span className="relative block" style={{ height: "50px", width: "50px", flexShrink: 0 }}>
              <Image
                src="/winterior-mark.png"
                alt="Winterior Design"
                fill
                priority
                sizes="50px"
                className="object-contain"
              />
            </span>
            <span className="flex flex-col items-start justify-center gap-0.5 leading-none">
              <span
                className="font-bold tracking-[0.04em] uppercase whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-roboto), sans-serif",
                  fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                  lineHeight: 1,
                  color: "#333333",
                }}
              >
                WINTERIOR
              </span>
              <span
                className="font-semibold tracking-[0.32em] uppercase whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-roboto), sans-serif",
                  fontSize: "clamp(0.5rem, 0.8vw, 0.625rem)",
                  lineHeight: 1,
                  letterSpacing: "0.42em",
                  color: "#FF6600",
                }}
              >
                DESIGN
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative font-body text-[13px] tracking-[0.15em] uppercase font-bold transition-colors duration-200 py-2 ${
                    active ? "text-[#FF6600]" : "text-[#333333]/90 hover:text-[#FF6600]"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6600] origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger - far right */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[#333333] z-50"
            aria-label="Open menu"
          >
            <span className="block absolute w-6 h-[2px] bg-[#333333]" />
            <span className="block absolute w-6 h-[2px] bg-[#333333] translate-y-[-6px]" />
            <span className="block absolute w-6 h-[2px] bg-[#333333] translate-y-[6px]" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 200ms ease-out; }
      `}</style>
    </>
  );
}