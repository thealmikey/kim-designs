"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { projects } from "@/lib/projects";

const CATEGORIES = [
  {
    id: "Kitchen",
    label: "Kitchens",
    allHref: "/kitchens",
    items: [
      { href: "/kitchens", label: "All Kitchens" },
      { href: "/kitchens?style=handleless", label: "Handleless" },
      { href: "/kitchens?style=high-gloss", label: "High Gloss" },
      { href: "/kitchens?style=spray-paint", label: "Spray Paint" },
      { href: "/kitchens?style=classic", label: "Classic" },
      { href: "/kitchens?style=solid-wood", label: "Solid Wood" },
    ],
  },
  {
    id: "Wardrobe",
    label: "Wardrobes",
    allHref: "/wardrobes",
    items: [
      { href: "/wardrobes", label: "All Wardrobes" },
      { href: "/wardrobes?style=walk-in", label: "Walk-In Closets" },
      { href: "/wardrobes?style=classic", label: "Classic Suites" },
      { href: "/wardrobes?style=mirror", label: "Mirror Fronted" },
      { href: "/wardrobes?style=handleless", label: "Handleless" },
      { href: "/wardrobes?style=under-stairs", label: "Under-Stairs" },
    ],
  },
  {
    id: "Bath Vanity",
    label: "Bath Vanities",
    allHref: "/bath-vanities",
    items: [
      { href: "/bath-vanities", label: "All Bath Vanities" },
      { href: "/bath-vanities?style=stone", label: "Stone Tops" },
      { href: "/bath-vanities?style=brass", label: "Brass Hardware" },
      { href: "/bath-vanities?style=fit-out", label: "Full Fit-Outs" },
    ],
  },
  {
    id: "Shop Fit-Out",
    label: "Shop Fit-Outs",
    allHref: "/shop-fit-outs",
    items: [
      { href: "/shop-fit-outs", label: "All Shop Fit-Outs" },
      { href: "/shop-fit-outs?style=showroom", label: "Showrooms" },
      { href: "/shop-fit-outs?style=retail", label: "Retail" },
      { href: "/shop-fit-outs?style=hospitality", label: "Hospitality" },
    ],
  },
];

const NAV_ITEMS = [
  { href: "/studio", label: "About" },
  { href: "/contact", label: "Contact" },
];

function getCount(categoryId: string) {
  return projects.filter((p) => p.category === categoryId).length;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategoryClick = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? null : label));
  };

  const handleLinkClick = () => {
    setExpandedCategory(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F1E9] flex flex-col" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#171716]/10">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label="Winterior Design home"
        >
          <span className="relative block" style={{ height: "40px", width: "40px", flexShrink: 0 }}>
            <Image
              src="/winterior-mark.png"
              alt="Winterior Design"
              fill
              priority
              sizes="40px"
              className="object-contain"
            />
          </span>
          <span className="flex flex-col items-start justify-center gap-0.5 leading-none">
            <span
              className="font-bold tracking-[0.04em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                lineHeight: 1,
                color: "#171716",
              }}
            >
              WINTERIOR
            </span>
            <span
              className="font-semibold tracking-[0.32em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(0.5rem, 1vw, 0.625rem)",
                lineHeight: 1,
                letterSpacing: "0.42em",
                color: "#171716",
              }}
            >
              DESIGN
            </span>
          </span>
        </Link>

        <button
          onClick={onClose}
          className="md:hidden relative w-11 h-11 flex items-center justify-center text-[#171716]"
          aria-label="Close menu"
        >
          <span className="block absolute w-6 h-[2px] bg-[#171716] rotate-45" />
          <span className="block absolute w-6 h-[2px] bg-[#171716] -rotate-45" />
        </button>
      </header>

      {/* WhatsApp quick action in header */}
      <div className="px-6 py-3 border-b border-[#171716]/10">
        <a
          href="https://wa.me/254728846560"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-[#171716] rounded-sm font-body text-[12px] tracking-[0.2em] uppercase font-bold hover:bg-[#25D366]/90 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          WhatsApp
        </a>
      </div>

      {/* Navigation content */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* WORK section with expandable categories */}
        <section className="space-y-4">
          <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-[#A68A64] font-semibold">
            Work
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedCategory === cat.label;
              const count = getCount(cat.id);
              const isActive = pathname.startsWith(cat.allHref);

              return (
                <div key={cat.label} className="border-t border-[#171716]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.label)}
                    className="flex items-center justify-between w-full text-left py-2"
                    aria-expanded={isExpanded}
                  >
                    <span className={`font-display font-light text-xl tracking-tight transition-colors ${isActive ? "text-[#A68A64]" : "text-[#171716]"}`} style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      {cat.label}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-body text-[11px] text-[#171716]/40">
                        {count}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`text-[#A68A64] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="ml-4 mt-2 space-y-1.5 border-l border-[#171716]/10 pl-4 animate-fadeIn">
                      {cat.items.map((item) => {
                        const isItemActive = pathname === item.href || pathname.startsWith(item.href + "?");
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={handleLinkClick}
                              className={`font-body text-sm py-1.5 transition-colors ${isItemActive ? "text-[#A68A64] font-semibold" : "text-[#171716]/80 hover:text-[#A68A64]"} `}
                            >
                              {item.label}
                              <span className="font-body text-[10px] text-[#171716]/30 font-normal ml-2">
                                ({getCount(cat.id)})
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                      <li>
                        <Link
                          href={cat.allHref}
                          onClick={handleLinkClick}
                          className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A68A64] hover:text-[#171716] transition-colors inline-flex items-center gap-1 py-2"
                        >
                          View all {cat.label} →
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT & CONTACT */}
        <section className="space-y-4 border-t border-[#171716]/10 pt-8">
          <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-[#A68A64] font-semibold">
            Studio
          </h3>
          <ul className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`font-display font-light text-3xl tracking-tight transition-colors ${isActive ? "text-[#A68A64]" : "text-[#171716] hover:text-[#A68A64]"} `}
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="border-t border-[#171716]/10 pt-8 space-y-3">
          <Link
            href="/contact"
            onClick={onClose}
            className="block w-full text-center font-body text-[12px] tracking-[0.22em] uppercase font-bold bg-[#171716] text-[#F5F1E9] px-6 py-4 hover:bg-[#A68A64] transition-colors"
          >
            Get a Quote →
          </Link>
        </section>
      </nav>

      {/* Footer */}
      <footer className="border-t border-[#171716]/10 px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs font-body text-[#171716]/70">
          <div className="flex flex-col gap-1">
            <span>info@winteriordesign.co.ke</span>
            <span>+254 755 164 654</span>
            <span>Enterprise Rd, Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/254728846560" target="_blank" rel="noopener noreferrer" className="hover:text-[#A68A64] transition-colors" onClick={onClose}>
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 200ms ease-out;
        }
      `}</style>
    </div>
  );
}