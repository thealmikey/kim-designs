"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects, projectById } from "@/lib/projects";
import { useSelection } from "./SelectionContext";

type Props = {
  slug: string;
};

export default function SingleItemView({ slug }: Props) {
  const project = projectById(slug);
  const router = useRouter();
  const { toggle, isSelected } = useSelection();
  const [activeImage, setActiveImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [edgeHover, setEdgeHover] = useState<"prev" | "next" | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const mainRef = useRef<HTMLButtonElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const interactedRef = useRef(false);

  const currentIndex = projects.findIndex((p) => p.id === slug);
  const total = projects.length;
  const prev = projects[(currentIndex - 1 + total) % total];
  const next = projects[(currentIndex + 1) % total];
  const hasMultipleImages = project ? project.images.length > 1 : false;

  const navigate = useCallback(
    (target: (typeof projects)[number]) => {
      interactedRef.current = true;
      setShowSwipeHint(false);
      router.push(`/v5/gallery/${target.id}`);
    },
    [router]
  );

  useEffect(() => {
    setActiveImage(0);
    setShowDetails(false);
    setShowSwipeHint(!interactedRef.current);
    thumbStripRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const p = project;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") navigate(next);
      if (e.key === "ArrowLeft") navigate(prev);
      if (e.key === "ArrowDown" && hasMultipleImages) {
        e.preventDefault();
        setActiveImage((i) => Math.min(p.images.length - 1, i + 1));
      }
      if (e.key === "ArrowUp" && hasMultipleImages) {
        e.preventDefault();
        setActiveImage((i) => Math.max(0, i - 1));
      }
      if (e.key === "Escape") router.push("/v5/gallery");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, next, prev, router, hasMultipleImages, project]);

  if (!project) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-warm-gray mb-2">
            Not catalogued
          </p>
          <h1 className="font-display text-4xl italic mb-6">Missing entry</h1>
          <Link
            href="/v5/gallery"
            className="font-body text-xs tracking-[0.25em] uppercase border border-foreground/30 px-4 py-2 inline-block hover:bg-foreground hover:text-background transition-colors"
          >
            ← Return to gallery
          </Link>
        </div>
      </div>
    );
  }

  const selected = isSelected(project.id);
  const currentImageSrc = project.images[activeImage] ?? project.images[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal text-cream overflow-hidden flex flex-col"
      data-testid="single-item-view"
    >
      <div className="absolute top-0 left-0 right-0 z-30 px-4 md:px-8 py-4 md:py-6 flex items-center gap-3 md:gap-4 bg-gradient-to-b from-charcoal/80 to-transparent">
        <Link
          href="/v5/gallery"
          className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream flex items-center gap-2"
          aria-label="Back to gallery"
        >
          <span aria-hidden="true">←</span> Gallery
        </Link>
        <span className="text-cream/40">/</span>
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-cream truncate">
          {project.title}
        </span>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/60 hidden md:inline">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => toggle(project.id)}
            aria-pressed={selected}
            data-testid="single-select-toggle"
            className={`font-body text-[10px] tracking-[0.3em] uppercase px-3 py-2 border transition-colors ${
              selected
                ? "bg-aged-brass text-charcoal border-aged-brass"
                : "border-cream/30 text-cream/80 hover:border-cream hover:text-cream"
            }`}
          >
            {selected ? "✓ In selection" : "+ Select"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="relative flex-1 min-h-0 flex items-start justify-center px-4 md:px-6 pt-16 md:pt-20 pb-4 md:pb-0">
          <button
            ref={mainRef}
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            data-testid="image-toggle"
            aria-label={showDetails ? "Hide project details" : "Show project details"}
            aria-expanded={showDetails}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
              touchStartY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null || touchStartY.current == null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              const dy = e.changedTouches[0].clientY - touchStartY.current;
              touchStartX.current = null;
              touchStartY.current = null;
              if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
                if (hasMultipleImages) {
                  if (dy < 0) {
                    setActiveImage((i) => Math.min(project.images.length - 1, i + 1));
                  } else {
                    setActiveImage((i) => Math.max(0, i - 1));
                  }
                }
              }
            }}
            className="relative w-full h-full max-h-[calc(100vh-5rem)] focus:outline-none group"
          >
            <Image
              src={currentImageSrc}
              alt={`${project.title} — image ${activeImage + 1}`}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
            />

            <span className="absolute top-3 left-3 font-body text-[10px] tracking-[0.3em] uppercase text-cream bg-charcoal/60 backdrop-blur-sm px-2 py-1">
              {String(activeImage + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
            </span>

            <span className="absolute top-3 right-3 font-body text-[10px] tracking-[0.3em] uppercase text-cream bg-charcoal/60 backdrop-blur-sm px-2 py-1">
              {project.category}
            </span>

            {showSwipeHint && (
              <div
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-6 md:px-10"
                aria-hidden="true"
              >
                <div className="flex flex-col items-center gap-1 text-cream/70">
                  <span className="text-2xl md:text-3xl font-light">‹</span>
                  <span className="font-body text-[9px] tracking-[0.3em] uppercase">
                    Tap for previous
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-cream/70">
                  <span className="text-2xl md:text-3xl font-light">›</span>
                  <span className="font-body text-[9px] tracking-[0.3em] uppercase">
                    Tap for next
                  </span>
                </div>
              </div>
            )}

            <div
              className={`absolute inset-x-0 bottom-0 transition-all duration-500 ease-out ${
                showDetails
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0 pointer-events-none"
              }`}
            >
              <div className="bg-charcoal/95 backdrop-blur-sm max-h-[60vh] overflow-y-auto px-4 md:px-8 py-5 md:py-7 border-t border-cream/10">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/60 mb-2">
                  {project.category} — {project.year} — {project.location}
                </p>
                <h2 className="font-display text-2xl md:text-4xl font-light text-cream tracking-tight leading-[1.05] mb-2">
                  {project.title}
                </h2>
                <p className="font-display italic text-base md:text-lg text-cream/80 mb-3">
                  {project.subtitle}.
                </p>
                <p className="font-body text-sm md:text-base text-cream/80 leading-relaxed max-w-2xl mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((m) => (
                    <span
                      key={m}
                      className="font-body text-[10px] tracking-[0.2em] uppercase text-cream bg-cream/10 px-3 py-1.5"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>

        {hasMultipleImages && (
          <aside
            aria-label="Project thumbnails"
            className="md:w-28 lg:w-32 shrink-0 border-t md:border-t-0 md:border-l border-cream/10 bg-charcoal/40"
          >
            <div className="hidden md:block h-full p-3 pt-20">
              <div
                ref={thumbStripRef}
                className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide flex flex-col gap-2"
                role="tablist"
                aria-label="Image thumbnails"
              >
                {project.images.map((img, idx) => {
                  const isActive = idx === activeImage;
                  return (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Show image ${idx + 1}`}
                      data-testid={`thumb-${idx}`}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-full aspect-square overflow-hidden border-2 transition-all snap-start shrink-0 ${
                        isActive
                          ? "border-aged-brass opacity-100"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                      <span className="absolute bottom-1 left-1 font-body text-[9px] tabular-nums bg-charcoal/80 text-cream px-1 py-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden border-t border-cream/10">
              <div
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-2 p-3"
                role="tablist"
                aria-label="Image thumbnails"
              >
                {project.images.map((img, idx) => {
                  const isActive = idx === activeImage;
                  return (
                    <button
                      key={`m-${img}-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Show image ${idx + 1}`}
                      onClick={() => setActiveImage(idx)}
                      className={`relative shrink-0 w-20 h-20 overflow-hidden border-2 transition-all snap-start ${
                        isActive
                          ? "border-aged-brass opacity-100"
                          : "border-transparent opacity-50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <span className="absolute bottom-0.5 left-0.5 font-body text-[9px] tabular-nums bg-charcoal/80 text-cream px-1">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(prev)}
        onMouseEnter={() => setEdgeHover("prev")}
        onMouseLeave={() => setEdgeHover(null)}
        aria-label={`Previous project: ${prev.title}`}
        className="group absolute left-0 top-16 md:top-20 bottom-0 w-16 md:w-28 z-20 flex items-center justify-start pl-2 md:pl-4 cursor-w-resize focus:outline-none"
      >
        <div
          className={`flex flex-col items-center gap-1 md:gap-2 transition-all duration-300 ${
            edgeHover === "prev" ? "opacity-100 translate-x-1" : "opacity-60"
          }`}
        >
          <span
            className={`w-10 h-10 md:w-12 md:h-12 border border-cream/40 group-hover:border-cream group-hover:bg-cream/10 flex items-center justify-center text-2xl md:text-3xl font-light text-cream/90 group-hover:text-cream transition-colors`}
            aria-hidden="true"
          >
            ‹
          </span>
          <span className="hidden md:flex flex-col items-center max-w-[80px]">
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-cream/50 group-hover:text-cream/80">
              Previous
            </span>
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/80 group-hover:text-cream truncate w-full text-center">
              {prev.title}
            </span>
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate(next)}
        onMouseEnter={() => setEdgeHover("next")}
        onMouseLeave={() => setEdgeHover(null)}
        aria-label={`Next project: ${next.title}`}
        className="group absolute right-0 top-16 md:top-20 bottom-0 w-16 md:w-28 z-20 flex items-center justify-end pr-2 md:pr-4 cursor-e-resize focus:outline-none"
      >
        <div
          className={`flex flex-col items-center gap-1 md:gap-2 transition-all duration-300 ${
            edgeHover === "next" ? "opacity-100 -translate-x-1" : "opacity-60"
          }`}
        >
          <span
            className={`w-10 h-10 md:w-12 md:h-12 border border-cream/40 group-hover:border-cream group-hover:bg-cream/10 flex items-center justify-center text-2xl md:text-3xl font-light text-cream/90 group-hover:text-cream transition-colors`}
            aria-hidden="true"
          >
            ›
          </span>
          <span className="hidden md:flex flex-col items-center max-w-[80px]">
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-cream/50 group-hover:text-cream/80">
              Next
            </span>
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/80 group-hover:text-cream truncate w-full text-center">
              {next.title}
            </span>
          </span>
        </div>
      </button>

      <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50">
          Tap image for details · swipe up/down for image
        </span>
      </div>

      <p className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-center font-body text-[10px] tracking-[0.3em] uppercase text-cream/40 pointer-events-none">
        Tap image for details · swipe up/down to change image · use edges to switch project
      </p>

      <style jsx>{`
        @keyframes swipeHintLeft {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(-6px); opacity: 1; }
        }
        @keyframes swipeHintRight {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
