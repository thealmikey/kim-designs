"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "@/lib/projects";

const CATEGORIES = [
  { id: "Kitchen", label: "Kitchens", href: "/kitchens" },
  { id: "Wardrobe", label: "Wardrobes", href: "/wardrobes" },
  { id: "Bath Vanity", label: "Bath Vanities", href: "/bath-vanities" },
  { id: "Shop Fit-Out", label: "Shop Fit-Outs", href: "/shop-fit-outs" },
];

function getCount(categoryId: string) {
  return projects.filter((p) => p.category === categoryId).length;
}

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
            const count = getCount(cat.id);
            const showCount = count >= 3;

            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-body font-semibold tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "bg-[#171716] text-[#F5F1E9] shadow-[0_2px_8px_rgba(23,23,22,0.25)]"
                    : "bg-[#F5F1E9] text-[#171716] border border-[#171716]/15 hover:bg-[#171716]/5 hover:border-[#A68A64]/50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {cat.label}
                {showCount && (
                  <span
                    className={`text-[11px] font-medium rounded-full px-1.5 py-0.5 ${
                      active
                        ? "bg-[#A68A64] text-[#F5F1E9]"
                        : "bg-[#171716]/10 text-[#171716]/60"
                    }`}
                    aria-label={`${count} projects`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}