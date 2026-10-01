"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { type Project } from "@/lib/projects";
import { imageSize } from "@/lib/image-dims";
import { useSelection } from "@/components/variants/v5/SelectionContext";

const label = "font-body text-[11px] tracking-[0.3em] uppercase";

/**
 * Zoom 1 means "fill the viewport as much as this photo's ratio allows",
 * so the default view is always fitted and 100% is never a crop.
 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;
const CLICK_ZOOM = 2.5;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface PhotoViewerProps {
  slug: string;
  onClose: () => void;
  /** The list prev/next steps through. Category pages pass the filtered
   *  category; the homepage passes every project. */
  projects: Project[];
  initialIndex?: number;
  /** Parent-owned project change, so URL sync stays the host's decision. */
  onNavigate?: (slug: string) => void;
}

export default function PhotoViewer({
  slug,
  onClose,
  projects,
  initialIndex = 0,
  onNavigate,
}: PhotoViewerProps) {
  const project = projects.find((p) => p.id === slug);
  const { toggle, isSelected } = useSelection();
  const [activeImage, setActiveImage] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
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

  const currentIndex = projects.findIndex((p) => p.id === slug);
  const total = projects.length;
  const prev = total > 1 && currentIndex >= 0 ? projects[(currentIndex - 1 + total) % total] : null;
  const next = total > 1 && currentIndex >= 0 ? projects[(currentIndex + 1) % total] : null;
  const hasMultipleImages = project ? project.images.length > 1 : false;

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

  const navigate = useCallback(
    (target: Project) => {
      onNavigate?.(target.id);
    },
    [onNavigate]
  );

  const activeSrc = project?.images[activeImage];

  // Measure before paint. An earlier version measured in a plain effect, which
  // let one frame render the photo at its intrinsic pixel size.
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

  const fit = useMemo(() => {
    if (!activeSrc || !viewport.w || !viewport.h) return 1;
    const [nw, nh] = imageSize(activeSrc);
    return Math.min(viewport.w / nw, viewport.h / nh);
  }, [activeSrc, viewport.w, viewport.h]);

  const display = useMemo(() => {
    if (!activeSrc) return { w: 0, h: 0 };
    const [nw, nh] = imageSize(activeSrc);
    const s = fit * zoom;
    // Floor, not round: a rounded-up dimension can exceed the viewport by a
    // pixel and raise a stray scrollbar on an otherwise fitted photo.
    return { w: Math.floor(nw * s), h: Math.floor(nh * s) };
  }, [activeSrc, fit, zoom]);

  const isZoomed = zoom > MIN_ZOOM + 0.001;

  // Keep the current centre point fixed so the detail being inspected stays
  // put instead of jumping to the corner.
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
          if (el?.hasPointerCapture(e.pointerId))
            el.releasePointerCapture(e.pointerId);
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className={`relative flex-1 min-h-0 flex overflow-auto overscroll-contain ${
          isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        }`}
        style={{
          scrollbarWidth: isZoomed ? "thin" : "none",
          // Drag-to-pan would otherwise fight the browser's own touch scroll.
          touchAction: isZoomed ? "none" : "pan-y",
        }}
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
          {/* Nothing is painted until the canvas is measured, so the photo
              never appears at its intrinsic pixel size for a frame. */}
          {measured && activeSrc ? (
            <Image
              src={activeSrc}
              alt={`${project.title} — photo ${activeImage + 1}`}
              width={display.w}
              height={display.h}
              priority
              unoptimized
              // Tailwind preflight sets `img { max-width:100%; height:auto }`,
              // which overrides the width/height attributes and renders the
              // bitmap at native size - the photo then overflows and clips.
              // An inline style outranks preflight, so the fitted size wins.
              style={{ width: display.w, height: display.h }}
              className="block max-w-none select-none"
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
              <li key={m} className={`${label} text-[#FFFFFF]/70`}>
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
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}