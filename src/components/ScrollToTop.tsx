"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLenisContext } from "@/lib/lenis-context";

function scrollToTop(lenis: ReturnType<typeof useLenisContext>["lenis"]) {
  if (typeof window === "undefined") return;
  if (window.location.hash) return;
  window.scrollTo(0, 0);
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }
}

export default function ScrollToTop() {
  const pathname = usePathname();
  const { lenis } = useLenisContext();

  useEffect(() => {
    scrollToTop(lenis);
  }, [pathname, lenis]);

  useEffect(() => {
    function onPageShow() {
      scrollToTop(lenis);
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [lenis]);

  return null;
}
