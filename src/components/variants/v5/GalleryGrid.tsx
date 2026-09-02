"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelection } from "./SelectionContext";
import {
  allCategories,
  projects,
  type ProjectCategory,
} from "@/lib/projects";

type Props = {
  activeIndex: number;
  onIndexChange: (i: number) => void;
  initialCategory?: "all" | ProjectCategory;
};

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjhGN0Y1Ii8+PC9zdmc+";

function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, inView]);

  return { ref, inView };
}

function GalleryTile({
  project,
  index,
  priority,
  onOpen,
  isSelected,
  onToggle,
  globalIndex,
  total,
}: {
  project: (typeof projects)[number];
  index: number;
  priority: boolean;
  onOpen: (i: number) => void;
  isSelected: boolean;
  onToggle: (id: string) => void;
  globalIndex: number;
  total: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>("200px");

  return (
    <article
      ref={ref}
      role="gridcell"
      data-index={index}
      data-project-id={project.id}
      className="relative group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: `${Math.min(index, 6) * 60}ms`,
        willChange: "opacity, transform",
        contentVisibility: "auto",
        containIntrinsicSize: "0 480px",
      }}
    >
      <Link
        href={`/v5/gallery/${project.id}`}
        onClick={() => onOpen(index)}
        className="relative block aspect-[4/5] overflow-hidden bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-aged-brass"
        aria-label={`Open ${project.title}`}
      >
        {inView && (
          <Image
            src={project.images[0]}
            alt={`${project.title} — ${project.subtitle}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            quality={70}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />

        <span className="absolute top-3 left-3 font-body text-[10px] tabular-nums bg-background/90 text-foreground px-1.5 py-0.5">
          {String(globalIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
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
          onToggle(project.id);
        }}
        aria-pressed={isSelected}
        aria-label={
          isSelected
            ? `Remove ${project.title} from selection`
            : `Add ${project.title} to selection`
        }
        data-testid={`select-${project.id}`}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all ${
          isSelected
            ? "bg-aged-brass text-charcoal"
            : "bg-background/80 text-foreground hover:bg-aged-brass hover:text-charcoal"
        }`}
      >
        {isSelected ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 7.5L5.5 11L12 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        ) : (
          <span className="font-body text-lg leading-none">+</span>
        )}
      </button>
    </article>
  );
}

export default function GalleryGrid({
  activeIndex,
  onIndexChange,
  initialCategory = "all",
}: Props) {
  const { toggle, isSelected, selected, hydrated } = useSelection();
  const [category, setCategory] = useState<"all" | ProjectCategory>(
    initialCategory
  );

  const filtered = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category),
    [category]
  );

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2 mb-8 md:mb-10"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {allCategories.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={`font-body text-[10px] tracking-[0.3em] uppercase px-3 py-2 border transition-colors ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/25 text-foreground/70 hover:border-foreground hover:text-foreground"
              }`}
            >
              {c.label}
              <span className="ml-2 text-[9px] tracking-normal text-foreground/40">
                {c.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === c.id).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        role="grid"
        aria-label="Project gallery"
      >
        {filtered.map((project, i) => (
          <GalleryTile
            key={project.id}
            project={project}
            index={i}
            priority={i < 3}
            onOpen={onIndexChange}
            isSelected={isSelected(project.id)}
            onToggle={toggle}
            globalIndex={i}
            total={filtered.length}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-foreground/50 py-12">
          No projects in this category yet.
        </p>
      )}

      {hydrated && selected.length > 0 && (
        <p className="text-center font-body text-xs text-foreground/50 mt-6">
          {selected.length} of {projects.length} selected across the site
        </p>
      )}
    </div>
  );
}
