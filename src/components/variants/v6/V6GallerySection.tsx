"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelection } from "@/components/variants/v5/SelectionContext";
import { projects as projectsBase } from "@/lib/projects";
import {
  allCategories,
  projects,
  type ProjectCategory,
} from "@/lib/projects";

const label = "font-body text-[10px] tracking-[0.3em] uppercase";
const meta = "font-body text-[11px] tracking-[0.22em] uppercase";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0DovLnd3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGMUU5Ii8+PC9zdmc+";

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

function MobileSnapCarousel({
  projects,
  onOpen,
  isSelected,
  onToggle,
}: {
  projects: (typeof projectsBase)[number][];
  onOpen: (i: number) => void;
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which card is in focus via IntersectionObserver
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-snap-card]")
    );
    if (cards.length === 0) return;

    // Honor prefers-reduced-motion: still track focus, but skip the
    // visual scale/blur in a follow-up effect (handled below).
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose intersection ratio is highest (i.e. centered)
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          const idxAttr = (e.target as HTMLElement).dataset.idx;
          if (idxAttr == null) continue;
          const idx = parseInt(idxAttr, 10);
          if (isNaN(idx)) continue;
          if (e.isIntersecting) {
            if (!best || e.intersectionRatio > best.ratio) {
              best = { idx, ratio: e.intersectionRatio };
            }
          }
        }
        if (best) setActiveIdx(best.idx);
      },
      {
        root,
        threshold: [0.4, 0.6, 0.8],
        rootMargin: "0px -20% 0px -20%",
      }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [projects]);

  if (projects.length === 0) return null;

  const total = projects.length;
  const safeIdx = Math.min(activeIdx, total - 1);
  const active = projects[safeIdx];

  return (
    <div className="lg:hidden">
      {/* Index badge */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#A68A64] font-bold">
          ← Swipe →
        </p>
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#171716]/60 font-semibold tabular-nums">
          {String(safeIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      {/* Scroll-snap track */}
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {projects.map((project, i) => {
          const focused = i === safeIdx;
          return (
            <article
              key={project.id}
              data-snap-card
              data-idx={i}
              className="snap-center shrink-0 relative transition-all duration-500 ease-out"
              style={{
                width: "78vw",
                maxWidth: "360px",
                transform: focused ? "scale(1)" : "scale(0.92)",
                opacity: focused ? 1 : 0.55,
                filter: focused ? "blur(0px)" : "blur(0.5px)",
                transitionProperty: "transform, opacity, filter",
              }}
            >
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="relative block w-full aspect-[4/5] overflow-hidden bg-[#171716]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A68A64]"
                aria-label={`Open ${project.title}`}
                aria-current={focused ? "true" : undefined}
              >
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 78vw, 360px"
                  className="object-cover"
                  loading={i < 3 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/85 via-[#171716]/15 to-transparent" />
                {/* Category pill */}
                <span className="absolute top-3 left-3 font-body text-[10px] tracking-[0.3em] uppercase bg-[#F5F1E9] text-[#171716] px-2 py-1 font-semibold">
                  {project.category}
                </span>
                {/* Title block */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3
                    className="font-display text-3xl font-light text-[#F5F1E9] tracking-tight leading-[1.05]"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="font-display italic text-base text-[#F5F1E9]/85 mt-1"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {project.subtitle}
                  </p>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#F5F1E9]/65 mt-3 font-semibold">
                    {project.location} · {project.year}
                  </p>
                </div>
              </button>

              {/* Select toggle — outside the open button to avoid conflict */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle(project.id);
                }}
                aria-pressed={isSelected(project.id)}
                aria-label={
                  isSelected(project.id)
                    ? `Remove ${project.title}`
                    : `Add ${project.title}`
                }
                className={`absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center transition-all shadow-md ${
                  isSelected(project.id)
                    ? "bg-[#A68A64] text-[#F5F1E9]"
                    : "bg-[#F5F1E9]/95 text-[#171716] hover:bg-[#A68A64] hover:text-[#F5F1E9]"
                }`}
              >
                {isSelected(project.id) ? (
                  <svg
                    width="18"
                    height="18"
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
                  <span className="font-body text-2xl leading-none font-light">+</span>
                )}
              </button>

              {/* Accent ring + glow on focused card */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-all duration-500"
                style={{
                  boxShadow: focused
                    ? "0 20px 50px -10px rgba(23,23,22,0.35), 0 0 0 3px #A68A64"
                    : "0 0 0 0px transparent",
                }}
              />
            </article>
          );
        })}
      </div>

      {/* Animated progress dots */}
      <div className="mt-2 flex items-center justify-center gap-1.5 px-1">
        {projects.map((p, i) => {
          const focused = i === safeIdx;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                const root = scrollerRef.current;
                if (!root) return;
                const card = root.querySelector<HTMLElement>(
                  `[data-idx="${i}"]`
                );
                if (card) {
                  card.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }
              }}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={focused ? "true" : undefined}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: focused ? "32px" : "6px",
                background: focused ? "#A68A64" : "rgba(23,23,22,0.25)",
              }}
            />
          );
        })}
      </div>

      {/* Active project title strip */}
      {active && (
        <p
          className="mt-3 font-display italic text-center text-sm text-[#171716]/60"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Currently viewing: <span className="not-italic font-semibold text-[#171716]">{active.title}</span>
        </p>
      )}

      <style jsx>{`
        .snap-x::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
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
      data-index={index}
      data-project-id={project.id}
      className="relative group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: `${Math.min(index, 6) * 60}ms`,
        willChange: "opacity, transform",
        contentVisibility: "auto",
        containIntrinsicSize: "0 480px",
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="relative block w-full aspect-[4/5] overflow-hidden bg-[#171716]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A68A64] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E9]"
        aria-label={`Open ${project.title}`}
      >
        {inView && (
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
            quality={100}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/80 via-[#171716]/15 to-transparent" />

        <span className="absolute top-3 left-3 font-body text-[10px] tabular-nums bg-[#F5F1E9] text-[#171716] px-1.5 py-0.5 font-semibold">
          {String(globalIndex + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>

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
  filtered: (typeof projects)[number][];
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
    (target: (typeof projects)[number]) => {
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
      {/* Top bar */}
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

      {/* Main image */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Edge-tap zones */}
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
            quality={100}
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

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="border-t border-[#F5F1E9]/10 bg-[#1A1916]">
          <div
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 py-3"
            ref={(el) => {
              /* no-op, will attach via ref below */
            }}
          >
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
                  quality={100}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function V6GallerySection() {
  const { toggle, isSelected, selected, hydrated, whatsappLink, clear } = useSelection();
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Read initial open slug from ?p= query
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p && projects.some((x) => x.id === p)) {
      setOpenSlug(p);
    }
    function onOpen(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      setOpenSlug(id);
    }
    window.addEventListener("v6-gallery-open", onOpen as EventListener);
    return () =>
      window.removeEventListener("v6-gallery-open", onOpen as EventListener);
  }, []);

  const filtered = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category),
    [category]
  );

  const openIndex = openSlug
    ? filtered.findIndex((p) => p.id === openSlug)
    : -1;

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
      className="px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-[#F5F1E9]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 border-b border-[#171716]/15 pb-5">
        <div>
          <p className={`${label} text-[#A68A64] mb-3`}>§ The Gallery</p>
          <h2
            className="font-display font-light tracking-[-0.02em] leading-[1.02] text-[#171716]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            Browse our
            <br />
            completed work.
          </h2>
          <p className="font-body text-sm md:text-base text-[#171716]/75 mt-5 max-w-xl leading-relaxed">
            Tap any project for a closer look. Select the ones you love and
            send them straight to our studio via WhatsApp.
          </p>
        </div>
        <p className={`${meta} text-[#171716]/60 mt-6 md:mt-0 tabular-nums`}>
          {String(filtered.length).padStart(2, "0")} of{" "}
          {String(projects.length).padStart(2, "0")} shown
        </p>
      </div>

      {/* Filter chips */}
      <div
        className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 md:mb-12"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {allCategories.map((c) => {
          const active = category === c.id;
          const count =
            c.id === "all"
              ? projects.length
              : projects.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={`${label} px-4 py-2.5 border-2 transition-colors font-semibold ${
                active
                  ? "bg-[#171716] text-[#F5F1E9] border-[#171716]"
                  : "bg-[#F5F1E9] text-[#171716] border-[#171716]/25 hover:border-[#A68A64] hover:text-[#A68A64]"
              }`}
            >
              {c.label}
              <span
                className={`ml-2 text-[9px] tabular-nums ${
                  active ? "text-[#F5F1E9]/70" : "text-[#171716]/45"
                }`}
              >
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile scroll-snap carousel (only on < lg) */}
      <MobileSnapCarousel
        projects={filtered}
        onOpen={(i) => {
          const target = filtered[i];
          if (!target) return;
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("p", target.id);
            window.history.pushState({}, "", url.toString());
          }
          setOpenSlug(target.id);
        }}
        isSelected={isSelected}
        onToggle={toggle}
      />

      {/* Grid (only on lg+) */}
      <div
        className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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
            globalIndex={i}
            total={filtered.length}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-[#171716]/60 py-12">
          No projects in this category yet.
        </p>
      )}

      {/* Floating selection bar (local copy styled for v6, also appears site-wide via root layout) */}
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