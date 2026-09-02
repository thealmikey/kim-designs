"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { projectById } from "@/lib/projects";

type Props = {
  projectId: string;
};

export default function ProjectSlider({ projectId }: Props) {
  const project = projectById(projectId);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = project?.images.length ?? 0;
  const multi = total > 1;

  const goTo = useCallback(
    (i: number) => {
      if (!multi) return;
      setIndex(Math.max(0, Math.min(total - 1, i)));
    },
    [multi, total]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!multi) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, multi]);

  if (!project || total === 0) return null;

  const padded = (n: number) => String(n + 1).padStart(2, "0");
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={project.title}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 60) {
          if (dx < 0) next();
          else prev();
        }
      }}
      className="relative w-full bg-cream text-foreground"
    >
      <div className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
        {project.images.map((src, i) => {
          const isActive = i === index;
          return (
            <div
              key={`${src}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${project.title} — image ${i + 1} of ${total}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative h-[55%] md:h-full w-full md:w-[68%]">
                <Image
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 68vw"
                  onLoad={() =>
                    setLoaded((m) => (m[i] ? m : { ...m, [i]: true }))
                  }
                  className={`object-cover transition-opacity duration-700 ${
                    loaded[i] ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!loaded[i] && (
                  <div className="absolute inset-0 bg-stone/30 animate-pulse" />
                )}
              </div>

              <div className="absolute inset-0 md:left-[68%] flex items-center">
                <div className="w-full md:w-[32vw] md:max-w-[480px] px-6 md:px-10 lg:px-14 py-8 md:py-0">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-3">
                    {project.category} — {project.year}
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-3">
                    {project.title}
                  </h2>
                  <p className="font-display italic text-base md:text-lg text-foreground/70 mb-4">
                    {project.subtitle}.
                  </p>
                  <p className="font-body text-sm md:text-[15px] text-foreground/75 leading-relaxed mb-5 line-clamp-4 md:line-clamp-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((m) => (
                      <span
                        key={m}
                        className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/80 border border-foreground/20 px-2.5 py-1"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="hidden md:block font-body text-[10px] tracking-[0.3em] uppercase text-warm-gray mt-6">
                    {project.location}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {multi && (
          <div className="absolute top-4 right-4 md:top-6 md:right-8 z-10 font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70">
            <span aria-live="polite">
              {padded(index)} / {padded(total - 1)}
            </span>
          </div>
        )}
      </div>

      {multi && (
        <div className="flex items-center justify-center gap-6 md:gap-10 py-6 md:py-8">
          <button
            type="button"
            onClick={prev}
            disabled={atStart}
            aria-label="Previous slide"
            className="w-10 h-10 border border-foreground/30 text-foreground/80 hover:border-foreground hover:text-foreground flex items-center justify-center disabled:opacity-30 disabled:hover:border-foreground/30 disabled:hover:text-foreground/80 transition-colors"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Slides"
          >
            {project.images.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-8 bg-aged-brass"
                      : "w-1.5 bg-foreground/25 hover:bg-foreground/50"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            aria-label="Next slide"
            className="w-10 h-10 border border-foreground/30 text-foreground/80 hover:border-foreground hover:text-foreground flex items-center justify-center disabled:opacity-30 disabled:hover:border-foreground/30 disabled:hover:text-foreground/80 transition-colors"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </section>
  );
}
