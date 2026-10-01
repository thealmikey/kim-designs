"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { videos } from "@/lib/videos";

const label = "font-body text-[11px] tracking-[0.3em] uppercase";

export default function VideoRail() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const hasVideos = videos.length > 0;
  const isOpen = openIndex !== null;
  const current = isOpen ? videos[openIndex] : null;

  const close = useCallback(() => {
    setOpenIndex(null);
    // Return focus to the card that opened the viewer.
    lastTriggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) =>
        i === null ? i : (i + delta + videos.length) % videos.length
      );
    },
    []
  );

  // Dialog behaviour: escape to close, arrows to navigate, scroll locked.
  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, step]);

  // Move focus into the dialog once it mounts.
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen, openIndex]);

  if (!hasVideos) return null;

  return (
    <section
      className="px-6 lg:px-16 py-16 md:py-24 bg-[#F4F4F4]"
      aria-labelledby="video-rail-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
        <div>
          <p className={`${label} text-[#FF6600] mb-3 font-bold`}>In motion</p>
          <h2
            id="video-rail-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[#333333]"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              fontFamily: "var(--font-roboto), sans-serif",
            }}
          >
            A closer look
          </h2>
        </div>
        <p className="font-body text-sm text-[#333333]/70 max-w-sm leading-relaxed">
          Short glimpses of materials, fittings, and finished spaces. Tap any
          clip to play it full screen.
        </p>
      </div>

      {/* Native horizontal scrolling — no carousel library, no JS scrolling. */}
      <div
        className="flex gap-3 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-6 px-6 lg:-mx-16 lg:px-16"
      >
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={(e) => {
              lastTriggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            className="group relative shrink-0 snap-start h-[300px] md:h-[380px] overflow-hidden bg-[#EAEAEA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F4F4]"
            aria-label={`Play video: ${v.title} (${v.category})`}
          >
            <span
              className="block h-full"
              style={{ aspectRatio: `${v.width} / ${v.height}` }}
            >
              <Image
                src={v.poster}
                alt=""
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 170px, 260px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </span>

            {/* Legibility scrim — matches the existing photo-card treatment. */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/65 via-transparent to-transparent" />

            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FFFFFF]/92 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110">
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
              <span
                className={`${label} block text-[#FF6600] text-[10px] mb-1`}
              >
                {v.category}
              </span>
              <span className="block font-body text-[13px] md:text-sm text-[#FFFFFF] leading-snug">
                {v.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      {isOpen && current && (
        <div
          className="fixed inset-0 z-[70] bg-[#1A1916] text-[#FFFFFF] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-[#FFFFFF]/10">
            <div className="min-w-0">
              <p className={`${label} text-[#FF6600] mb-1`}>{current.category}</p>
              <p className="font-body text-sm md:text-base truncate">
                {current.title}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {videos.length > 1 && (
                <p className={`${label} text-[#FFFFFF]/60 tabular-nums hidden md:block`}>
                  {String(openIndex + 1).padStart(2, "0")} /{" "}
                  {String(videos.length).padStart(2, "0")}
                </p>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className={`${label} text-[#FFFFFF]/85 hover:text-[#FF6600] inline-flex items-center gap-2`}
              >
                <X className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-3 md:p-6">
            {videos.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-1 md:left-3 z-10 w-11 h-11 rounded-full border border-[#FFFFFF]/25 flex items-center justify-center hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}

            {/* The video element is mounted only here — never in the rail — so
                no clip is downloaded until a visitor actually asks for one. */}
            <video
              key={current.id}
              src={current.src}
              poster={current.poster}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="max-h-full max-w-full bg-black"
              style={{
                // Fit inside the viewport without distorting the clip.
                width: "auto",
                height: "auto",
                maxHeight: "100%",
                aspectRatio: `${current.width} / ${current.height}`,
              }}
            >
              <track kind="captions" />
            </video>

            {videos.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
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