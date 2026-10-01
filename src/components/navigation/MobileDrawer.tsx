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
  { href: "/studio", label: "About Us" },
  { href: "/services", label: "How we do it" },
  { href: "/contact", label: "Contact Us" },
];

const TOP_CONTACT = [
  { href: "mailto:info@winteriordesign.co.ke", label: "info@winteriordesign.co.ke", icon: "mail" },
  { href: "tel:0728846560", label: "0728 846 560", icon: "phone" },
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
    <div className="fixed inset-0 z-50 bg-white flex flex-col" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#C6C5CA]">
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
                fontFamily: "var(--font-roboto), sans-serif",
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
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
                fontSize: "clamp(0.5rem, 1vw, 0.625rem)",
                lineHeight: 1,
                letterSpacing: "0.42em",
                color: "#FF6600",
              }}
            >
              DESIGN
            </span>
          </span>
        </Link>

        <button
          onClick={onClose}
          className="md:hidden relative w-11 h-11 flex items-center justify-center text-[#333333]"
          aria-label="Close menu"
        >
          <span className="block absolute w-6 h-[2px] bg-[#333333] rotate-45" />
          <span className="block absolute w-6 h-[2px] bg-[#333333] -rotate-45" />
        </button>
      </header>

      {/* Navigation content */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* WORK section with expandable categories */}
        <section className="space-y-4">
          <h3 className="font-body text-[11px] tracking-[0.25em] uppercase text-[#FF6600] font-semibold">
            Work
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedCategory === cat.label;
              const count = getCount(cat.id);
              const isActive = pathname.startsWith(cat.allHref);

              return (
                <div key={cat.label} className="border-t border-[#C6C5CA] pt-4">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.label)}
                    className="flex items-center justify-between w-full text-left py-2"
                    aria-expanded={isExpanded}
                  >
                    <span className={`font-display font-light text-xl tracking-tight transition-colors ${isActive ? "text-[#FF6600]" : "text-[#333333]"}`} style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
                      {cat.label}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-body text-[11px] text-[#6F7072]">
                        {count}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`text-[#FF6600] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="ml-4 mt-2 space-y-1.5 border-l border-[#C6C5CA] pl-4 animate-fadeIn">
                      {cat.items.map((item) => {
                        const isItemActive = pathname === item.href || pathname.startsWith(item.href + "?");
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={handleLinkClick}
                              className={`font-body text-sm py-1.5 transition-colors ${isItemActive ? "text-[#FF6600] font-semibold" : "text-[#6F7072] hover:text-[#FF6600]"} `}
                            >
                              {item.label}
                              <span className="font-body text-[10px] text-[#333333]/30 font-normal ml-2">
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
                          className="font-body text-[11px] tracking-[0.15em] uppercase text-[#FF6600] hover:text-[#333333] transition-colors inline-flex items-center gap-1 py-2"
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
        <section className="space-y-4 border-t border-[#C6C5CA] pt-8">
          <h3 className="font-body text-[11px] tracking-[0.25em] uppercase text-[#FF6600] font-semibold">
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
                    className={`font-display font-light text-3xl tracking-tight transition-colors ${isActive ? "text-[#FF6600]" : "text-[#333333] hover:text-[#FF6600]"} `}
                    style={{ fontFamily: "var(--font-roboto), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="border-t border-[#C6C5CA] pt-8 space-y-3">
          <Link
            href="/contact"
            onClick={onClose}
            className="block w-full text-center font-body text-[12px] tracking-[0.22em] uppercase font-bold bg-[#FF6600] text-[#FFFFFF] px-6 py-4 hover:bg-[#D95500] transition-colors"
          >
            Get a Quote →
          </Link>
        </section>

        {/* WhatsApp */}
        <section className="border-t border-[#C6C5CA] pt-8">
          <a
            href="https://wa.me/254728846560"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block w-full text-center font-body text-[12px] tracking-[0.22em] uppercase font-semibold bg-transparent border border-[#FF6600] text-[#FF6600] px-6 py-4 hover:bg-[#FF6600] hover:text-[#FFFFFF] transition-colors"
          >
            WhatsApp Us
          </a>
        </section>

        {/* Top contact info */}
        <section className="border-t border-[#C6C5CA] pt-8">
          <div className="flex flex-col gap-3 text-[13px] font-body text-[#6F7072]">
            {TOP_CONTACT.map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-3 hover:text-[#FF6600] transition-colors" onClick={onClose}>
                <span>{item.icon === "mail" ? "✉" : "📞"}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </section>
      </nav>

      {/* Footer */}
      <footer className="border-t border-[#C6C5CA] px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs font-body text-[#333333]/50">
          <div className="flex flex-col gap-1">
            <span>info@winteriordesign.co.ke</span>
            <span>0728 846 560</span>
            <span>Enterprise Rd, Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/254728846560" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6600] transition-colors" onClick={onClose}>
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