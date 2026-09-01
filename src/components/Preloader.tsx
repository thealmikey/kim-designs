"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      setIsLoaded(true);
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        finish();
      } else {
        window.addEventListener("load", finish, { once: true });
      }
    }

    const safety = setTimeout(finish, 2500);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(safety);
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-px bg-foreground/20 overflow-hidden">
          <div className="h-full bg-foreground animate-[load_1s_ease-in-out_infinite]" />
        </div>
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase">
          Loading
        </p>
      </div>
      <style jsx>{`
        @keyframes load {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
