"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSelection } from "./SelectionContext";
import { projects } from "@/lib/projects";

type Props = {
  activeIndex: number;
  onIndexChange: (i: number) => void;
};

export default function GalleryGrid({ activeIndex, onIndexChange }: Props) {
  const { toggle, isSelected, selected, hydrated } = useSelection();
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const el = refs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      role="grid"
      aria-label="Project gallery"
    >
      {projects.map((project, i) => {
        const selected = isSelected(project.id);
        return (
          <article
            key={project.id}
            role="gridcell"
            data-index={i}
            className="relative group"
          >
            <Link
              ref={(el) => {
                refs.current[i] = el;
              }}
              href={`/v5/gallery/${project.id}`}
              onClick={() => onIndexChange(i)}
              className="relative block aspect-[4/5] overflow-hidden bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-aged-brass"
              aria-label={`Open ${project.title}`}
            >
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />

              <span className="absolute top-3 left-3 font-body text-[10px] tabular-nums bg-background/90 text-foreground px-1.5 py-0.5">
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <p className="font-body text-[10px] text-cream/60 tracking-[0.3em] uppercase mb-1.5">
                  {project.category}
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-light text-cream tracking-tight leading-[1.05]">
                  {project.title}
                </h2>
                <p className="font-display italic text-sm md:text-base text-cream/70 mt-1">
                  {project.subtitle}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(project.id);
              }}
              aria-pressed={selected}
              aria-label={selected ? `Remove ${project.title} from selection` : `Add ${project.title} to selection`}
              data-testid={`select-${project.id}`}
              className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all ${
                selected
                  ? "bg-aged-brass text-charcoal"
                  : "bg-background/80 text-foreground hover:bg-aged-brass hover:text-charcoal"
              }`}
            >
              {selected ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7.5L5.5 11L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              ) : (
                <span className="font-body text-lg leading-none">+</span>
              )}
            </button>
          </article>
        );
      })}

      {hydrated && selected.length > 0 && (
        <p className="col-span-full text-center font-body text-xs text-foreground/50 mt-2">
          {selected.length} of {projects.length} selected
        </p>
      )}
    </div>
  );
}
