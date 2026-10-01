"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  type Project,
  type ProjectCategory,
  allCategories,
  categoryHref,
} from "@/lib/projects";
import { imageSize } from "@/lib/image-dims";
import { useSelection } from "@/components/variants/v5/SelectionContext";
import PhotoViewer from "@/components/variants/v6/PhotoViewer";

const label = "font-body text-[11px] tracking-[0.3em] uppercase";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0DovLnd3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGMUU5Ii8+PC9zdmc+";

interface CategoryPageProps {
  category: ProjectCategory;
  title: string;
  subtitle: string;
  projects: Project[];
}

/**
 * Justified rows, with no JavaScript.
 *
 * Every tile sets flex-grow to its own aspect ratio and a flex-basis of
 * `ratio * row-height`. The browser hands the leftover width to the tiles in
 * proportion to those ratios, so a tile settles at width = ratio * H and,
 * with aspect-ratio still applied, every tile on the row ends up exactly the
 * same height. Each row therefore fills the full width edge to edge while
 * every photo keeps its true proportions - nothing is cropped, stretched,
 * or left in an empty cell.
 *
 * Replaces two earlier attempts that could not satisfy that combination:
 * finalRowSpans stretched a single trailing tile to double width, which made
 * it display at a different scale from its neighbours, and multi-column
 * masonry left ragged column bottoms in arbitrary fill order.
 */
function JustifiedGallery({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (imageIndex: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4 [--row-h:200px] md:[--row-h:260px] lg:[--row-h:320px]">
      {project.images.map((src, i) => {
        const [w, h] = imageSize(src);
        const ratio = w / h;
        return (
          <figure
            key={src + i}
            className="relative"
            style={{
              flexGrow: ratio,
              flexBasis: `calc(${(ratio * 100).toFixed(2)} * var(--row-h) / 100)`,
              aspectRatio: `${w} / ${h}`,
              // Caps how far a short final row can be stretched, so the last
              // band cannot balloon out of scale with the rows above it.
              maxWidth: `calc(${(ratio * 130).toFixed(2)} * var(--row-h) / 100)`,
            }}
          >
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="group relative block h-full w-full overflow-hidden bg-[#F4F4F4] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={`Zoom ${project.title}, photo ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${project.title} — photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={i < 4 ? "eager" : "lazy"}
                fetchPriority={i < 2 ? "high" : "auto"}
                decoding="async"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <span className="absolute inset-0 bg-[#333333]/0 group-hover:bg-[#333333]/20 transition-colors duration-300" />
              {/* Magnifier badge: states that the tile zooms rather than
                  following a link, so the click is not a surprise. */}
              <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#FFFFFF]/92 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#333333] fill-none stroke-current stroke-[2]"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                  <path d="M11 8v6M8 11h6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </figure>
        );
      })}
    </div>
  );
}

export default function CategoryPage({ category, title, subtitle, projects: allProjects }: CategoryPageProps) {
  const { toggle, isSelected, selected, hydrated, whatsappLink, clear } = useSelection();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  const filtered = useMemo(
    () => allProjects.filter((p) => p.category === category),
    [category, allProjects]
  );

  const totalImages = useMemo(
    () => filtered.reduce((sum, p) => sum + p.images.length, 0),
    [filtered]
  );

  const closeOverlay = useCallback(() => {
    setOpenSlug(null);
    setOpenIndex(0);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("p");
      url.searchParams.delete("i");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Stepping between projects from inside the overlay keeps the visitor on
  // this category page and deep-links to the photo they land on.
  const handleNavigate = useCallback((slug: string) => {
    setOpenSlug(slug);
    setOpenIndex(0);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("p", slug);
      url.searchParams.delete("i");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <section
      id="v6-gallery"
      className="px-6 md:px-12 lg:px-16 pt-[calc(var(--nav-two-row-height)+3rem)] pb-20 md:pb-28 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
        <div>
          <p className={`${label} text-[#FF6600] mb-3`}>{title}</p>
          <h2
            className="font-display font-light tracking-[-0.02em] leading-[1.02] text-[#333333]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontFamily: "var(--font-roboto), sans-serif",
            }}
          >
            {subtitle}
          </h2>
        </div>
        <p className={`${label} text-[#333333]/55 tabular-nums shrink-0`}>
          {filtered.length} project{filtered.length === 1 ? "" : "s"} ·{" "}
          {totalImages} photo{totalImages === 1 ? "" : "s"}
        </p>
      </div>

      {/* Winterior-style tab filter */}
      <div
        className="flex flex-wrap items-center gap-x-1 mb-10 md:mb-14 border-b border-[#C6C5CA]"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {allCategories.map((c) => {
          const isTabActive = c.id === category;
          return (
            <Link
              key={c.id}
              href={categoryHref(c.id)}
              role="tab"
              aria-selected={isTabActive}
              className={`${label} px-5 py-4 -mb-px border-b-2 font-semibold transition-colors ${
                isTabActive
                  ? "border-[#FF6600] text-[#FF6600]"
                  : "border-transparent text-[#333333]/55 hover:text-[#333333]"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Every image in the category, laid out inline.
          Previously each project was a single 4:5 tile, so Bath Vanity showed
          one image for a seven-photo collection and the rest were only
          reachable by opening the project view. Each project still keeps its
          own heading so the collections stay distinguishable, but all of its
          photographs now sit on the page itself. */}
      <div className="space-y-14 md:space-y-20">
        {filtered.map((project) => (
          <section key={project.id} aria-labelledby={`grp-${project.id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-[#C6C5CA] pb-3 mb-5 md:mb-6">
              <h3
                id={`grp-${project.id}`}
                className="font-display text-xl md:text-2xl font-medium text-[#333333] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-roboto), sans-serif" }}
              >
                {project.title}
              </h3>
              <div className="flex items-center gap-4">
                <span className={`${label} text-[#333333]/55 tabular-nums`}>
                  {project.images.length} photo
                  {project.images.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(project.id)}
                  aria-pressed={isSelected(project.id)}
                  className={`${label} px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase transition-colors ${
                    isSelected(project.id)
                      ? "bg-[#FF6600] text-[#FFFFFF]"
                      : "border border-[#C6C5CA] text-[#333333]/70 hover:border-[#FF6600] hover:text-[#FF6600]"
                  }`}
                >
                  {isSelected(project.id) ? "Selected ✓" : "Select"}
                </button>
              </div>
            </div>

            <JustifiedGallery
              project={project}
              onOpen={(i) => {
                setOpenSlug(project.id);
                setOpenIndex(i);
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.set("p", project.id);
                  url.searchParams.set("i", String(i));
                  window.history.replaceState({}, "", url.toString());
                }
              }}
            />
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-[#FFFFFF]/60 py-12">
          No projects in this category yet.
        </p>
      )}

      {/* Floating selection bar */}
      {hydrated && selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[55] bg-[#FF6600] text-[#FFFFFF] border-t-2 border-[#FF6600] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-[#FF6600] text-[#FFFFFF] font-body text-xs font-bold px-2.5 py-1 tabular-nums">
                {selected.length}
              </span>
              <p className="font-body text-xs md:text-sm text-[#FFFFFF]/90 truncate">
                {selected.length === 1
                  ? "1 project selected"
                  : `${selected.length} projects selected`}
                <span className="hidden md:inline text-[#FFFFFF]/50 ml-2">
                  — Send to our studio
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="font-body text-[10px] tracking-[0.22em] uppercase font-semibold text-[#FFFFFF]/70 hover:text-[#FFFFFF] px-3 py-2 border border-[#FFFFFF]/25 hover:border-[#FFFFFF]"
              >
                Clear
              </button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] tracking-[0.22em] uppercase font-bold bg-[#FF6600] hover:bg-[#D95500] hover:text-[#FFFFFF] text-[#FFFFFF] px-4 py-2.5 inline-flex items-center gap-2 transition-colors"
              >
                <span>WhatsApp</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen photo viewer */}
      {openSlug && (
        <PhotoViewer
          // Remounting on change re-seeds activeImage from initialIndex, so
          // there is no effect needed to reset it.
          key={`${openSlug}:${openIndex}`}
          slug={openSlug}
          onClose={closeOverlay}
          projects={filtered}
          initialIndex={openIndex}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}
