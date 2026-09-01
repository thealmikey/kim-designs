"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("enter");

  useEffect(() => {
    if (pathname) {
      setTransitionStage("exit");
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("enter");
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-600 ${
        transitionStage === "enter" ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayChildren}
    </div>
  );
}
