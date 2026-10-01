"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { videos } from "@/lib/videos";

const label = "font-body text-[11px] tracking-[0.3em] uppercase";

/** Gap between cards, used both for layout and for arrow scroll steps. */
const CARD_GAP = 20;

export default function VideoShowcase() {
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(videos.length < 2);

  const railRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const total = videos.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const current = videos[index];

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    triggerRef.current?.focus();
  }, []);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(total - 1, i + 1)),
    [total]
  );

  // Arrow visibility follows the rail's real scroll position, so they only
  // disappear when there is genuinely nothing further to scroll to.
  const syncBounds = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncBounds();
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncBounds);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncBounds]);

  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + CARD_GAP : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Modal: escape closes, arrows step, scroll locked.
  useEffect(() => {
    if (!viewerOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight" && !isLast) {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        prev();
      }
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewerOpen, closeViewer, next, prev, isFirst, isLast]);

  useEffect(() => {
    if (viewerOpen) closeButtonRef.current?.focus();
  }, [viewerOpen]);

  if (total === 0) return null;

  return (
    <section
      className="px-6 lg:px-16 py-14 md:py-20 bg-[#F4F4F4]"
      aria-labelledby="video-showcase-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-8 mb-8 md:mb-12">
        <div>
          <p className={`${label} text-[#FF6600] mb-3 font-bold`}>In motion</p>
          <h2
            id="video-showcase-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#333333]"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              fontFamily: "var(--font-roboto), sans-serif",
            }}
          >
            A closer look
          </h2>
        </div>
        <p className="font-body text-sm text-[#333333]/70 md:text-right max-w-sm leading-relaxed">
          Short glimpses of the spaces we build. Tap any clip to play it full
          screen.
        </p>
      </div>

      <div className="relative">
        {/* Previous — hidden once the rail is scrolled to the start. */}
        {!atStart && (
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#C6C5CA] text-[#333333] shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-colors hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
            aria-label="Scroll videos left"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}

        {/* Native horizontal scrolling — several clips visible on desktop,
            one plus a peek on mobile. No carousel library. */}
        <div
          ref={railRef}
          onScroll={syncBounds}
          className="flex justify-between overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-6 px-6 lg:-mx-16 lg:px-16"
          style={{ gap: CARD_GAP }}
        >
          {videos.map((v, i) => (
            <button
              key={v.id}
              data-card
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setIndex(i);
                setViewerOpen(true);
              }}
              className="group relative shrink-0 snap-start h-[300px] md:h-[380px] overflow-hidden bg-[#EAEAEA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F4F4]"
              style={{ aspectRatio: `${v.width} / ${v.height}` }}
              aria-label={`Play video: ${v.title} (${v.category})`}
            >
              <Image
                src={v.poster}
                alt=""
                fill
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                sizes="(max-width: 768px) 70vw, 260px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />

              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/70 via-[#000000]/10 to-transparent" />

              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FFFFFF]/92 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:scale-110">
                <Play
                  className="w-5 h-5 md:w-6 md:h-6 text-[#333333] translate-x-[1px]"
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden="true"
                />
              </span>

              {v.duration && (
                <span
                  className={`${label} pointer-events-none absolute right-2 top-2 bg-[#000000]/55 text-[#FFFFFF] px-2 py-1 tabular-nums text-[10px]`}
                >
                  {v.duration}
                </span>
              )}

              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 md:p-4">
                <span className={`${label} block text-[#FF6600] text-[10px] mb-1`}>
                  {v.category}
                </span>
                <span className="block font-body text-[13px] md:text-sm text-[#FFFFFF] leading-snug">
                  {v.title}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Next — hidden once the rail is scrolled to the end. */}
        {!atEnd && (
          <button
            type="button"
            onClick={() => scrollRail(1)}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#C6C5CA] text-[#333333] shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-colors hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]"
            aria-label="Scroll videos right"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      {viewerOpen && (
        <div
          className="fixed inset-x-0 top-0 z-[70] h-[100dvh] bg-[#1A1916] text-[#FFFFFF] flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <div className="shrink-0 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[#FFFFFF]/10">
            <div className="min-w-0">
              <p className={`${label} text-[#FF6600] mb-1`}>{current.category}</p>
              <p className="font-body text-sm md:text-base truncate">{current.title}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <p className={`${label} text-[#FFFFFF]/60 tabular-nums hidden md:block`}>
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeViewer}
                className={`${label} text-[#FFFFFF]/85 hover:text-[#FF6600] inline-flex items-center gap-2`}
              >
                <X className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* min-h-0 is load-bearing: a flex item defaults to min-height:auto and
              would otherwise refuse to shrink below the video's intrinsic height,
              so max-h-full would resolve against the wrong box and the clip would
              overflow (and appear cropped). */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center p-3 md:p-6 overflow-hidden">
            {!isFirst && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-1 md:left-3 z-10 w-11 h-11 rounded-full border border-[#FFFFFF]/25 flex items-center justify-center hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}

            {/* Mounted only here, so no clip is fetched until a visitor asks.
                object-contain letterboxes the frame: the whole clip is always
                visible, never cropped or squashed, whatever the device ratio. */}
            <video
              key={current.id}
              src={current.src}
              poster={current.poster}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="block max-h-full max-w-full h-auto w-auto object-contain bg-black"
            >
              <track kind="captions" />
            </video>

            {!isLast && (
              <button
                type="button"
                onClick={next}
                className="absolute right-1 md:right-3 z-10 w-11 h-11 rounded-full border border-[#FFFFFF]/25 flex items-center justify-center hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}