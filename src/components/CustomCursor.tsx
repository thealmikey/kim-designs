"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringInnerRef = useRef<HTMLDivElement | null>(null);
  const [isCoarse, setIsCoarse] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isCoarse) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    let raf = 0;
    let lastWrite = 0;

    const writeDot = (x: number, y: number) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      }
    };
    const writeRing = (x: number, y: number) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`;
      }
    };

    writeDot(pos.x, pos.y);
    writeRing(pos.x, pos.y);

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      writeDot(pos.x, pos.y);
      if (!isVisible) setIsVisible(true);
      lastWrite = performance.now();
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']"
      );
      setIsHovering(Boolean(interactive));
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.22;
      ringPos.y += (pos.y - ringPos.y) * 0.22;
      writeRing(ringPos.x, ringPos.y);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [isCoarse, isVisible]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isCoarse) {
      document.documentElement.classList.remove("custom-cursor-active");
    } else {
      document.documentElement.classList.add("custom-cursor-active");
    }
  }, [isCoarse]);

  if (isCoarse) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-foreground pointer-events-none z-[9999] transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 pointer-events-none z-[9998] transition-opacity duration-200"
        style={{ willChange: "transform" }}
      >
        <div
          ref={ringInnerRef}
          className={`w-full h-full rounded-full border transition-[opacity,transform,border-color,background-color] duration-200 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          } ${
            isHovering
              ? "scale-50 border-aged-brass bg-aged-brass/10"
              : "scale-100 border-foreground/40"
          }`}
          style={{ transformOrigin: "center" }}
        />
      </div>
    </>
  );
}
