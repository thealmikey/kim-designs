"use client";

import Link from "next/link";
import { useSelection } from "./SelectionContext";

export default function SelectionBar() {
  const { selectedProjects, clear, whatsappLink, hydrated } = useSelection();

  if (!hydrated || selectedProjects.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 max-w-3xl"
      role="region"
      aria-label="Selected projects"
    >
      <div className="bg-charcoal text-cream shadow-2xl border border-aged-brass/30 px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 backdrop-blur">
        <div className="flex-1 min-w-0">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/60">
            Selection — {selectedProjects.length}{" "}
            {selectedProjects.length === 1 ? "item" : "items"}
          </p>
          <p className="font-display text-sm md:text-base text-cream truncate">
            {selectedProjects.map((p) => p.title).join(" · ")}
          </p>
        </div>
        <Link
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[10px] md:text-xs tracking-[0.25em] uppercase bg-aged-brass text-charcoal px-3 md:px-4 py-2 hover:bg-cream transition-colors whitespace-nowrap"
        >
          WhatsApp →
        </Link>
        <button
          type="button"
          onClick={clear}
          className="font-body text-[10px] md:text-xs tracking-[0.25em] uppercase text-cream/70 hover:text-cream border border-cream/30 px-3 py-2 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
