"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

type LenisContextValue = {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    setReady(true);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value: LenisContextValue = {
    lenis: lenisRef.current,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    scrollTo: (target, options) => lenisRef.current?.scrollTo(target, options),
  };

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenisContext() {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    return {
      lenis: null,
      stop: () => {},
      start: () => {},
      scrollTo: () => {},
    } as LenisContextValue;
  }
  return ctx;
}
