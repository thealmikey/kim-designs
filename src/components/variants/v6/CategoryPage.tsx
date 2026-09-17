"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects, type Project, type ProjectCategory, allCategories } from "@/lib/projects";
import { useSelection } from "@/components/variants/v5/SelectionContext";

const label = "font-body text-[10px] tracking-[0.3em] uppercase";
const meta = "font-body text-[11px] tracking-[0.22em] uppercase";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0DovLnd3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGMUU5Ii8+PC9zdmc+";

interface CategoryPageProps {
  category: ProjectCategory;
  title: string;
  subtitle: string;
  projects: Project[];
}

function GalleryTile({
  project,
  index,
  priority,
  onOpen,
  isSelected,
  onToggle,
}: {
  project: Project;
  index: number;
  priority: boolean;
  onOpen: (i: number) => void;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <article
      data-index={index}
      data-project-id={project.id}
      className="relative group"
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="relative block w-full aspect-[4/5] overflow-hidden bg-[#171716]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A68A64] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E9]"
        aria-label={`Open ${project.title}`}
      >
        <Image
          src={project.images[0]}
          alt={`${project.title} — ${project.subtitle}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/80 via-[#171716]/15 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="font-body text-[10px] text-[#F5F1E9]/80 tracking-[0.3em] uppercase mb-1.5 font-semibold">
            {project.category}
          </p>
          <h3
            className="font-display text-2xl md:text-[1.7rem] font-light text-[#F5F1E9] tracking-tight leading-[1.05]"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {project.title}
          </h3>
          <p
            className="font-display italic text-sm md:text-base text-[#F5F1E9]/80 mt-1"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {project.subtitle}
          </p>
        </div>
      </button>

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
        className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center transition-all shadow-sm ${
          isSelected
            ? "bg-[#A68A64] text-[#F5F1E9]"
            : "bg-[#F5F1E9]/95 text-[#171716] hover:bg-[#A68A64] hover:text-[#F5F1E9]"
        }`}
      >
        {isSelected ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8.5L6.5 12L13 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
            />
          </svg>
        ) : (
          <span className="font-body text-xl leading-none font-light">+</span>
        )}
      </button>
    </article>
  );
}

function SingleItemOverlay({
  slug,
  onClose,
  filtered,
}: {
  slug: string;
  onClose: () => void;
  filtered: Project[];
}) {
  const project = projects.find((p) => p.id === slug);
  const { toggle, isSelected } = useSelection();
  const [activeImage, setActiveImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const mainRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const interactedRef = useRef(false);

  const currentIndex = filtered.findIndex((p) => p.id === slug);
  const total = filtered.length;
  const prev = total > 1 ? filtered[(currentIndex - 1 + total) % total] : null;
  const next = total > 1 ? filtered[(currentIndex + 1) % total] : null;
  const hasMultipleImages = project ? project.images.length > 1 : false;

  const navigate = useCallback(
    (target: Project) => {
      interactedRef.current = true;
      setActiveImage(0);
      setShowDetails(false);
      window.history.pushState({}, "", `/v6/work?p=${target.id}`);
      window.dispatchEvent(new CustomEvent("v6-gallery-open", { detail: target.id }));
    },
    []
  );

  useEffect(() => {
    setActiveImage(0);
    setShowDetails(false);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const p = project;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" && hasMultipleImages) {
        e.preventDefault();
        setActiveImage((i) => Math.min(p.images.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft" && hasMultipleImages) {
        e.preventDefault();
        setActiveImage((i) => Math.max(0, i - 1));
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, hasMultipleImages, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#1A1916] text-[#F5F1E9] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-[#F5F1E9]/10">
        <button
          type="button"
          onClick={onClose}
          className={`${label} text-[#F5F1E9]/85 hover:text-[#F5F1E9] inline-flex items-center gap-2`}
        >
          <span aria-hidden>←</span>
          <span>Back to gallery</span>
        </button>
        <div className="flex items-center gap-4">
          <p className={`${label} text-[#F5F1E9]/60 tabular-nums hidden md:block`}>
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => toggle(project.id)}
            aria-pressed={isSelected(project.id)}
            className={`${label} px-3 py-2 transition-colors ${
              isSelected(project.id)
                ? "bg-[#A68A64] text-[#F5F1E9]"
                : "border border-[#F5F1E9]/30 text-[#F5F1E9] hover:border-[#A68A64] hover:text-[#A68A64]"
            }`}
          >
            {isSelected(project.id) ? "Selected ✓" : "Add to selection"}
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {prev && (
          <button
            type="button"
            onClick={() => navigate(prev)}
            className="absolute left-0 top-0 bottom-0 w-[18%] z-10 group flex items-center justify-start pl-3 md:pl-6"
            aria-label={`Previous: ${prev.title}`}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#171716]/70 text-[#F5F1E9] px-3 py-2 text-xs font-body tracking-widest uppercase">
              ← {prev.title}
            </span>
          </button>
        )}
        {next && (
          <button
            type="button"
            onClick={() => navigate(next)}
            className="absolute right-0 top-0 bottom-0 w-[18%] z-10 group flex items-center justify-end pr-3 md:pr-6"
            aria-label={`Next: ${next.title}`}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#171716]/70 text-[#F5F1E9] px-3 py-2 text-xs font-body tracking-widest uppercase">
              {next.title} →
            </span>
          </button>
        )}

        <button
          ref={mainRef}
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50 && hasMultipleImages) {
              if (dx < 0)
                setActiveImage((i) =>
                  Math.min(project.images.length - 1, i + 1)
                );
              else setActiveImage((i) => Math.max(0, i - 1));
            }
            touchStartX.current = null;
          }}
          className="relative w-full h-full"
          aria-label={showDetails ? "Hide project details" : "Show project details"}
          aria-expanded={showDetails}
        >
          <Image
            src={project.images[activeImage]}
            alt={`${project.title} — image ${activeImage + 1}`}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </button>

        {showDetails && (
          <div
            className="absolute inset-x-0 bottom-0 max-h-[60vh] overflow-y-auto bg-[#1A1916]/95 backdrop-blur-md border-t border-[#F5F1E9]/15 p-5 md:p-8"
            style={{
              transform: showDetails ? "translateY(0)" : "translateY(100%)",
              transition: "transform 400ms ease-out",
            }}
          >
            <p className={`${label} text-[#A68A64] mb-3`}>
              {project.category} · {project.location} · {project.year}
            </p>
            <h2
              className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#F5F1E9] mb-3"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              {project.title}
            </h2>
            <p
              className="font-display italic text-[#F5F1E9]/85 text-base md:text-lg mb-4"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {project.subtitle}.
            </p>
            <p className="font-body text-sm md:text-base text-[#F5F1E9]/85 leading-relaxed max-w-2xl mb-5">
              {project.description}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.materials.map((m) => (
                <li
                  key={m}
                  className={`${label} text-[#F5F1E9]/70`}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasMultipleImages && (
        <div className="border-t border-[#F5F1E9]/10 bg-[#1A1916]">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 py-3">
            {project.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-colors ${
                  i === activeImage
                    ? "border-[#A68A64]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ category, title, subtitle, projects: allProjects }: CategoryPageProps) {
  const { toggle, isSelected, selected, hydrated, whatsappLink, clear } = useSelection();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const filtered = useMemo(
    () => allProjects.filter((p) => p.category === category),
    [category, allProjects]
  );

  const closeOverlay = useCallback(() => {
    setOpenSlug(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("p");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <section
      id="v6-gallery"
      className="px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-[#F5F1E9] min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 border-b border-[#171716]/15 pb-5">
        <div>
          <p className={`${label} text-[#A68A64] mb-3`}>§ {title}</p>
          <h2
            className="font-display font-light tracking-[-0.02em] leading-[1.02] text-[#171716]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            {subtitle}
          </h2>
        </div>
        <p className={`${meta} text-[#171716]/60 mt-6 md:mt-0 tabular-nums`}>
          {String(filtered.length).padStart(2, "0")} project{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter chips (show all categories for cross-navigation) */}
      <div
        className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 md:mb-12"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {allCategories.map((c) => {
          const count =
            c.id === "all"
              ? allProjects.length
              : allProjects.filter((p) => p.category === c.id).length;
          return (
            <Link
              key={c.id}
              href={c.id === "all" ? "/v6/work" : `/${c.id.toLowerCase().replace(" ", "-")}`}
              className={`${label} px-4 py-2.5 border-2 transition-colors font-semibold ${
                c.id === category
                  ? "bg-[#171716] text-[#F5F1E9] border-[#171716]"
                  : "bg-[#F5F1E9] text-[#171716] border-[#171716]/25 hover:border-[#A68A64] hover:text-[#A68A64]"
              }`}
            >
              {c.label}
              <span
                className={`ml-2 text-[9px] tabular-nums ${
                  c.id === category ? "text-[#F5F1E9]/70" : "text-[#171716]/45"
                }`}
              >
                {String(count).padStart(2, "0")}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Grid */}
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
            onOpen={(idx) => {
              const target = filtered[idx];
              if (!target) return;
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("p", target.id);
                window.history.pushState({}, "", url.toString());
              }
              setOpenSlug(target.id);
            }}
            isSelected={isSelected(project.id)}
            onToggle={toggle}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-[#171716]/60 py-12">
          No projects in this category yet.
        </p>
      )}

      {/* Floating selection bar */}
      {hydrated && selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[55] bg-[#171716] text-[#F5F1E9] border-t-2 border-[#A68A64] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-[#A68A64] text-[#F5F1E9] font-body text-xs font-bold px-2.5 py-1 tabular-nums">
                {selected.length}
              </span>
              <p className="font-body text-xs md:text-sm text-[#F5F1E9]/90 truncate">
                {selected.length === 1
                  ? "1 project selected"
                  : `${selected.length} projects selected`}
                <span className="hidden md:inline text-[#F5F1E9]/50 ml-2">
                  — Send to our studio
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="font-body text-[10px] tracking-[0.22em] uppercase font-semibold text-[#F5F1E9]/70 hover:text-[#F5F1E9] px-3 py-2 border border-[#F5F1E9]/25 hover:border-[#F5F1E9]"
              >
                Clear
              </button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] tracking-[0.22em] uppercase font-bold bg-[#A68A64] hover:bg-[#F5F1E9] hover:text-[#171716] text-[#F5F1E9] px-4 py-2.5 inline-flex items-center gap-2 transition-colors"
              >
                <span>WhatsApp</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen single-item overlay */}
      {openSlug && (
        <SingleItemOverlay
          slug={openSlug}
          onClose={closeOverlay}
          filtered={filtered}
        />
      )}
    </section>
  );
}