"use client";

import { useState, useEffect, useCallback } from "react";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener("mouseenter", handleHoverStart);
    document.addEventListener("mouseleave", handleHoverEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleHoverStart);
      document.removeEventListener("mouseleave", handleHoverEnd);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-3 h-3 bg-foreground rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out ${
          isVisible ? "scale-100" : "scale-0"
        }`}
        style={{
          transform: `translate(${mousePos.x - 6}px, ${mousePos.y - 6}px)`,
        }}
      />
      <div
        className={`fixed top-0 left-0 w-12 h-12 border border-foreground rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out ${
          isHovering ? "scale-150 border-aged-brass" : "scale-100"
        }`}
        style={{
          transform: `translate(${mousePos.x - 24}px, ${mousePos.y - 24}px)`,
        }}
      />
      {isHovering && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9999] font-body text-xs text-foreground mix-blend-difference uppercase tracking-widest"
          style={{
            transform: `translate(${mousePos.x + 20}px, ${mousePos.y - 8}px)`,
          }}
        >
          View
        </div>
      )}
    </>
  );
}
