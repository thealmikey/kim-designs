"use client";

import Link from "next/link";
import { projects, allCategories } from "@/lib/projects";

const label = "font-body text-[10px] tracking-[0.2em] uppercase";
const itemLabel = "font-body text-[13px] text-[#171716]";
const countLabel = "font-body text-[11px] text-[#171716]/30 font-normal";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemHover?: () => void;
}

const CATEGORIES = [
  {
    id: "Kitchen",
    label: "KITCHENS",
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
    label: "WARDROBES",
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
    label: "BATH VANITIES",
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
    label: "SHOP FIT-OUTS",
    allHref: "/shop-fit-outs",
    items: [
      { href: "/shop-fit-outs", label: "All Shop Fit-Outs" },
      { href: "/shop-fit-outs?style=showroom", label: "Showrooms" },
      { href: "/shop-fit-outs?style=retail", label: "Retail" },
      { href: "/shop-fit-outs?style=hospitality", label: "Hospitality" },
    ],
  },
];

function getCount(categoryId: string) {
  return projects.filter((p) => p.category === categoryId).length;
}

function getItemCount(href: string) {
  if (href === "/kitchens" || href.startsWith("/kitchens?")) {
    return getCount("Kitchen");
  }
  if (href === "/wardrobes" || href.startsWith("/wardrobes?")) {
    return getCount("Wardrobe");
  }
  if (href === "/bath-vanities" || href.startsWith("/bath-vanities?")) {
    return getCount("Bath Vanity");
  }
  if (href === "/shop-fit-outs" || href.startsWith("/shop-fit-outs?")) {
    return getCount("Shop Fit-Out");
  }
  return 0;
}

export default function MegaMenu({ isOpen, onClose, onItemHover }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible bridge element to prevent hover gap */}
      <div
        className="absolute top-full left-0 right-0 h-4 z-40"
        onMouseEnter={onItemHover}
        onMouseLeave={onClose}
        aria-hidden="true"
      />

      <div
        className="absolute top-[calc(100%-4px)] left-0 right-0 bg-[#F5F1E9] border-b border-[#171716]/10 shadow-[0_20px_40px_-20px_rgba(23,23,22,0.3)] py-8 px-6 lg:px-16 z-50 animate-fadeIn"
        role="menu"
        aria-label="Work categories"
        onMouseEnter={onItemHover}
        onMouseLeave={onClose}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className={`${label} text-[#A68A64] font-semibold`}>
                  {cat.label}
                </h3>
                <span className={`${countLabel} hidden sm:inline`}>
                  {getCount(cat.id)} projects
                </span>
              </div>

              <ul className="space-y-2" role="menubar">
                {cat.items.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      className={`${itemLabel} hover:text-[#A68A64] transition-colors flex items-center gap-2 py-2 px-3 rounded-sm hover:bg-[#171716]/5`}
                      onMouseEnter={onItemHover}
                      onClick={onClose}
                    >
                      {item.label}
                      <span className={`${countLabel} hidden sm:inline`}>
                        ({getItemCount(item.href)})
                      </span>
                    </Link>
                  </li>
                ))}
                <li role="none">
                  <Link
                    href={cat.allHref}
                    role="menuitem"
                    className={`${label} text-[#A68A64] hover:text-[#171716] transition-colors inline-flex items-center gap-1 pt-2`}
                    onClick={onClose}
                  >
                    View all {cat.label} →
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

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
    </>
  );
}