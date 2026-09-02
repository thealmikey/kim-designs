"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { projectById } from "@/lib/projects";

type Props = {
  projectId: string;
  compact?: boolean;
};

export default function ProjectSlider({ projectId, compact = false }: Props) {
  const project = projectById(projectId);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastIndexRef = useRef(0);
  const touchStartX = useRef<number | null>(null);

  const total = project?.images.length ?? 0;
  const multi = total > 1;

  const goTo = useCallback(
    (i: number) => {
      if (!multi) return;
      setIndex((prev) => {
        const next = Math.max(0, Math.min(total - 1, i));
        if (next === prev) return prev;
        lastIndexRef.current = prev;
        return next;
      });
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

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!project) return;
    if (slidesRef.current.length === 0) return;

    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    const imgs = imgsRef.current.filter(Boolean) as HTMLDivElement[];
    const slideDuration = compact ? 0.9 : 1.05;
    const revealEase = "power3.inOut";
    const kbFrom = compact ? 1.04 : 1.08;
    const kbTo = 1.0;

    if (reducedMotion) {
      slides.forEach((el, i) => {
        gsap.set(el, { clearProps: "all", autoAlpha: i === 0 ? 1 : 0 });
      });
      imgs.forEach((el) => {
        gsap.set(el, { clearProps: "transform" });
      });
      return;
    }

    gsap.set(slides, {
      autoAlpha: 0,
      clipPath: "inset(0% 0% 100% 0%)",
    });
    gsap.set(imgs, { scale: kbFrom, yPercent: 0 });

    const initialTimeline = gsap.timeline({
      defaults: { ease: revealEase },
    });
    initialTimeline.to(slides[0], {
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: slideDuration,
    });
    if (slides.length > 1) {
      initialTimeline.to(
        slides.slice(1),
        {
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: slideDuration,
          stagger: 0.18,
        },
        "-=0.55"
      );
    }
    initialTimeline.to(
      imgs[0],
      {
        scale: kbTo,
        duration: 2.4,
        ease: "power2.out",
      },
      0
    );
    if (imgs.length > 1) {
      initialTimeline.to(
        imgs.slice(1),
        {
          scale: kbTo,
          duration: 2.4,
          ease: "power2.out",
          stagger: 0.18,
        },
        0
      );
    }

    return () => {
      initialTimeline.kill();
    };
  }, [project, compact, reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (index === lastIndexRef.current) return;

    const from = lastIndexRef.current;
    const to = index;
    const forward = to > from;
    const outgoingEl = slidesRef.current[from];
    const incomingEl = slidesRef.current[to];
    const outgoingImg = imgsRef.current[from];
    const incomingImg = imgsRef.current[to];
    if (!outgoingEl || !incomingEl) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    tl.set(incomingEl, {
      autoAlpha: 1,
      clipPath: forward ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
    });
    if (incomingImg) {
      tl.set(
        incomingImg,
        { scale: compact ? 1.04 : 1.08, yPercent: forward ? 3 : -3 },
        0
      );
    }

    tl.to(
      incomingEl,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: compact ? 0.85 : 1.0,
      },
      0
    );
    if (incomingImg) {
      tl.to(
        incomingImg,
        {
          scale: 1,
          yPercent: 0,
          duration: 2.2,
          ease: "power2.out",
        },
        0
      );
    }
    tl.to(
      outgoingEl,
      {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.in",
      },
      0.15
    );

    return () => {
      tl.kill();
    };
  }, [index, reducedMotion, compact]);

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
      className={`relative w-full ${compact ? "bg-transparent" : "bg-cream"} text-foreground`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          compact
            ? "h-[60vh] min-h-[420px] md:h-[64vh]"
            : "h-[80vh] min-h-[560px]"
        }`}
      >
        {project.images.map((src, i) => {
          const isActive = i === index;
          return (
            <div
              key={`${src}-${i}`}
              ref={(el) => {
                slidesRef.current[i] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${project.title} — image ${i + 1} of ${total}`}
              aria-hidden={!isActive}
              className="absolute inset-0 will-change-[clip-path,opacity]"
            >
              <div
                className={`relative w-full overflow-hidden ${
                  compact ? "h-full" : "h-[55%] md:h-full md:w-[68%]"
                }`}
              >
                <div
                  ref={(el) => {
                    imgsRef.current[i] = el;
                  }}
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — ${i + 1}`}
                    fill
                    priority={i < 2}
                    fetchPriority={i < 2 ? "high" : "auto"}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    sizes="(max-width: 768px) 100vw, 68vw"
                    onLoad={() =>
                      setLoaded((m) => (m[i] ? m : { ...m, [i]: true }))
                    }
                    className={`object-cover transition-opacity duration-700 ${
                      loaded[i] ? "opacity-100" : "opacity-0"
                    }`}
                    quality={75}
                  />
                </div>
                {!loaded[i] && (
                  <div className="absolute inset-0 bg-stone/30 animate-pulse" />
                )}
              </div>

              {!compact && (
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
              )}
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
        <div
          className={`flex items-center justify-center gap-6 md:gap-10 ${
            compact ? "py-3 md:py-4" : "py-6 md:py-8"
          }`}
        >
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
