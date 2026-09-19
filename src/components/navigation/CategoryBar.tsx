"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Kitchens", href: "/kitchens" },
  { label: "Wardrobes", href: "/wardrobes" },
  { label: "Bath Vanities", href: "/bath-vanities" },
  { label: "Shop Fit-Outs", href: "/shop-fit-outs" },
];

export default function CategoryBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href + "?");
  };

  return (
    <nav
      className="bg-[#F5F1E9] border-b border-[#171716]/10"
      aria-label="Work categories"
      style={{ height: "56px" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center h-full gap-2 lg:gap-3 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => {
            const active = isActive(cat.href);

            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`relative flex items-center px-4 py-2 rounded-full text-[13px] font-body font-semibold tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "bg-[#171716] text-[#F5F1E9] shadow-[0_2px_8px_rgba(23,23,22,0.25)]"
                    : "bg-[#F5F1E9] text-[#171716] border border-[#171716]/15 hover:bg-[#171716]/5 hover:border-[#A68A64]/50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}