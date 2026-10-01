"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  projects,
  type Project,
  type ProjectCategory,
  allCategories,
  categoryHref,
} from "@/lib/projects";
import { imageSize } from "@/lib/image-dims";
import { useSelection } from "@/components/variants/v5/SelectionContext";

const label = "font-body text-[11px] tracking-[0.3em] uppercase";
const meta = "font-body text-[11px] tracking-[0.22em] uppercase";

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
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;
const CLICK_ZOOM = 2.5;

// Layout effect on the client, plain effect on the server. The canvas must be
// measured before the browser paints, otherwise the first frame shows the
// photo at its intrinsic pixel size.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

function SingleItemOverlay({
  slug,
  onClose,
  filtered,
  initialIndex = 0,
  onNavigate,
}: {
  slug: string;
  onClose: () => void;
  filtered: Project[];
  initialIndex?: number;
  onNavigate?: (slug: string) => void;
}) {
  const project = projects.find((p) => p.id === slug);
  const { toggle, isSelected } = useSelection();
  const [activeImage, setActiveImage] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  // Zoom 1 means "fill the viewport as much as this photo's ratio allows".
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
  } | null>(null);

  const currentIndex = filtered.findIndex((p) => p.id === slug);
  const total = filtered.length;
  const prev = total > 1 ? filtered[(currentIndex - 1 + total) % total] : null;
  const next = total > 1 ? filtered[(currentIndex + 1) % total] : null;
  const hasMultipleImages = project ? project.images.length > 1 : false;
  // View reset lives with the handlers that change the photo rather than in an
// effect, which would only fire after the change had already rendered.
const resetView = useCallback(() => {
  setZoom(MIN_ZOOM);
  const el = viewportRef.current;
  if (el) {
    el.scrollLeft = 0;
    el.scrollTop = 0;
  }
}, []);

const goToImage = useCallback(
  (next: number) => {
    const len = project?.images.length ?? 1;
    setActiveImage(Math.min(Math.max(next, 0), len - 1));
    resetView();
  },
  [project, resetView]
);


  // The host owns project changes so the URL stays on the current category page.
// Previously this pushed /v6/work and dispatched an event that only the
// homepage gallery listens for, so prev/next did nothing on a category page.
const navigate = useCallback(
    (target: Project) => {
      onNavigate?.(target.id);
      if (!onNavigate) {
        setActiveImage(0);
        setShowDetails(false);
        resetView();
        window.history.pushState({}, "", `/v6/work?p=${target.id}`);
        window.dispatchEvent(new CustomEvent("v6-gallery-open", { detail: target.id }));
      }
    },
    [onNavigate]
  );

  const activeSrc = project?.images[activeImage];

  // Measure the canvas so the photo can be scaled to the largest size that
  // still fits. This runs as a layout effect so the fitted size is applied
  // before paint; a plain effect let one frame render at intrinsic size,
  // which looked like the photo opened already zoomed in.
  useIsomorphicLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () =>
      setViewport({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measured = viewport.w > 0 && viewport.h > 0;

  // Fit scale: the factor that makes the photo exactly fill the canvas at
  // zoom 1, so it uses all available space without being cropped.
  const fit = useMemo(() => {
    if (!activeSrc || !viewport.w || !viewport.h) return 1;
    const [nw, nh] = imageSize(activeSrc);
    return Math.min(viewport.w / nw, viewport.h / nh);
  }, [activeSrc, viewport.w, viewport.h]);

  const display = useMemo(() => {
    if (!activeSrc) return { w: 0, h: 0 };
    const [nw, nh] = imageSize(activeSrc);
    const s = fit * zoom;
    return { w: Math.round(nw * s), h: Math.round(nh * s) };
  }, [activeSrc, fit, zoom]);

  const isZoomed = zoom > MIN_ZOOM + 0.001;

  // Zoom keeping the current centre point fixed, so the detail being
  // inspected stays put instead of jumping to the corner.
  const applyZoom = useCallback((next: number) => {
    const el = viewportRef.current;
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    if (el && clamped > MIN_ZOOM) {
      const cx = (el.scrollLeft + el.clientWidth / 2) / (el.scrollWidth || 1);
      const cy = (el.scrollTop + el.clientHeight / 2) / (el.scrollHeight || 1);
      setZoom(clamped);
      requestAnimationFrame(() => {
        el.scrollLeft = cx * el.scrollWidth - el.clientWidth / 2;
        el.scrollTop = cy * el.scrollHeight - el.clientHeight / 2;
      });
    } else {
      setZoom(clamped);
      // Back to fit: drop the scroll offsets so flex centring applies again.
      if (el) {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    }
  }, []);

  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Zoom keys take priority over navigation while inspecting detail.
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        applyZoom(zoom + ZOOM_STEP);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        applyZoom(zoom - ZOOM_STEP);
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        applyZoom(MIN_ZOOM);
        return;
      }
      if (e.key === "ArrowRight" && hasMultipleImages) {
        e.preventDefault();
        goToImage(activeImage + 1);
      }
      if (e.key === "ArrowLeft" && hasMultipleImages) {
        e.preventDefault();
        goToImage(activeImage - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, hasMultipleImages, onClose, applyZoom, zoom, goToImage, activeImage]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#0A0A0A] text-[#FFFFFF] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-[#FFFFFF]/10">
        <button
          type="button"
          onClick={onClose}
          className={`${label} text-[#FFFFFF]/85 hover:text-[#FFFFFF] inline-flex items-center gap-2`}
        >
          <span aria-hidden>←</span>
          <span>Back to gallery</span>
        </button>
        <div className="flex items-center gap-3 md:gap-4">
          <p className={`${label} text-[#FFFFFF]/60 tabular-nums hidden md:block`}>
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          {/* Zoom controls. Always visible rather than hover-only, so the
              affordance is discoverable without hunting for it. */}
          <div
            className="flex items-center border border-[#FFFFFF]/30"
            role="group"
            aria-label="Zoom controls"
          >
            <button
              type="button"
              onClick={() => applyZoom(zoom - ZOOM_STEP)}
              disabled={!isZoomed}
              className={`${label} w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[#FF6600] enabled:hover:text-[#FFFFFF]`}
              aria-label="Zoom out"
            >
              <span aria-hidden>−</span>
            </button>
            <button
              type="button"
              onClick={() => applyZoom(MIN_ZOOM)}
              disabled={!isZoomed}
              className={`${label} w-14 md:w-16 h-9 md:h-10 flex items-center justify-center text-[11px] tabular-nums border-x border-[#FFFFFF]/30 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-[#FFFFFF]/10`}
              aria-label="Reset zoom to fit"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => applyZoom(zoom + ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              className={`${label} w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[#FF6600] enabled:hover:text-[#FFFFFF]`}
              aria-label="Zoom in"
            >
              <span aria-hidden>+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-pressed={showDetails}
            className={`${label} px-3 py-2 border transition-colors ${
              showDetails
                ? "bg-[#FFFFFF] text-[#0A0A0A] border-[#FFFFFF]"
                : "border-[#FFFFFF]/30 text-[#FFFFFF] hover:border-[#FF6600] hover:text-[#FF6600]"
            }`}
          >
            Details
          </button>

          <button
            type="button"
            onClick={() => toggle(project.id)}
            aria-pressed={isSelected(project.id)}
            className={`${label} px-3 py-2 transition-colors ${
              isSelected(project.id)
                ? "bg-[#FF6600] text-[#FFFFFF]"
                : "border border-[#FFFFFF]/30 text-[#FFFFFF] hover:border-[#FF6600] hover:text-[#FF6600]"
            }`}
          >
            {isSelected(project.id) ? "Selected ✓" : "Add to selection"}
          </button>
        </div>
      </div>

      <div
          ref={viewportRef}
          onWheel={(e) => {
            // Ctrl/Cmd + wheel zooms, matching browser and map conventions.
            if (!(e.ctrlKey || e.metaKey)) return;
            e.preventDefault();
            applyZoom(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
          }}
          onPointerDown={(e) => {
            if (!isZoomed || e.button !== 0) return;
            const el = viewportRef.current;
            if (!el) return;
            drag.current = {
              x: e.clientX,
              y: e.clientY,
              left: el.scrollLeft,
              top: el.scrollTop,
              moved: false,
            };
            el.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            const el = viewportRef.current;
            if (!d || !el) return;
            el.scrollLeft = d.left - (e.clientX - d.x);
            el.scrollTop = d.top - (e.clientY - d.y);
            d.moved = true;
          }}
          onPointerUp={(e) => {
            const el = viewportRef.current;
            if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          className={`relative flex-1 min-h-0 flex overflow-auto overscroll-contain ${
            isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          }`}
          style={{ scrollbarWidth: isZoomed ? "thin" : "none" }}
        >
          {prev && (
            <button
              type="button"
              onClick={() => navigate(prev)}
              className="sticky left-3 top-1/2 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-[#0A0A0A]/70 hover:bg-[#FF6600] text-[#FFFFFF] flex items-center justify-center self-start backdrop-blur-sm transition-colors"
              aria-label={`Previous project: ${prev.title}`}
            >
              <span aria-hidden>←</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (drag.current?.moved) return;
              applyZoom(isZoomed ? MIN_ZOOM : CLICK_ZOOM);
            }}
            onDoubleClick={() => applyZoom(CLICK_ZOOM)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 50 && hasMultipleImages) {
                if (dx < 0) goToImage(activeImage + 1);
                else goToImage(activeImage - 1);
              }
              touchStartX.current = null;
            }}
            className="shrink-0 m-auto"
            aria-label={
              isZoomed
                ? `Zoom out, currently ${Math.round(zoom * 100)}%`
                : "Zoom in"
            }
          >
            {/* Nothing is painted until the canvas is measured. Rendering
                early would draw the photo at its intrinsic pixel size, which
                overflows the canvas and reads as already zoomed in. */}
            {measured && activeSrc ? (
              <Image
                src={activeSrc}
                alt={`${project.title} — photo ${activeImage + 1}`}
                width={display.w}
                height={display.h}
                priority
                unoptimized
                className="block h-auto w-auto select-none"
                draggable={false}
              />
            ) : (
              <span
                className="block bg-[#1A1A1A]"
                style={{ width: display.w || 1, height: display.h || 1 }}
              />
            )}
          </button>

          {next && (
            <button
              type="button"
              onClick={() => navigate(next)}
              className="sticky right-3 top-1/2 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-[#0A0A0A]/70 hover:bg-[#FF6600] text-[#FFFFFF] flex items-center justify-center self-start backdrop-blur-sm transition-colors"
              aria-label={`Next project: ${next.title}`}
            >
              <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {showDetails && (
          <div
            className="absolute inset-x-0 bottom-0 max-h-[60vh] overflow-y-auto bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#FFFFFF]/15 p-5 md:p-8"
            style={{
              transform: showDetails ? "translateY(0)" : "translateY(100%)",
              transition: "transform 400ms ease-out",
            }}
          >
            <p className={`${label} text-[#FF6600] mb-3`}>
              {project.category} · {project.location} · {project.year}
            </p>
            <h2
              className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#FFFFFF] mb-3"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                fontFamily: "var(--font-roboto), sans-serif",
              }}
            >
              {project.title}
            </h2>
            <p
              className="font-display italic text-[#FFFFFF]/85 text-base md:text-lg mb-4"
              style={{ fontFamily: "var(--font-roboto), sans-serif" }}
            >
              {project.subtitle}.
            </p>
            <p className="font-body text-sm md:text-base text-[#FFFFFF]/85 leading-relaxed max-w-2xl mb-5">
              {project.description}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.materials.map((m) => (
                <li
                  key={m}
                  className={`${label} text-[#FFFFFF]/70`}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      {hasMultipleImages && (
        <div className="border-t border-[#FFFFFF]/10 bg-[#0A0A0A]">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 py-3">
            {project.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => goToImage(i)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-colors ${
                  i === activeImage
                    ? "border-[#FF6600]"
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

      {/* Full-screen single-item overlay */}
      {openSlug && (
        <SingleItemOverlay
          // Remounting on change re-seeds activeImage from initialIndex, so
          // there is no effect needed to reset it.
          key={`${openSlug}:${openIndex}`}
          slug={openSlug}
          onClose={closeOverlay}
          filtered={filtered}
          initialIndex={openIndex}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}
