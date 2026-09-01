"use client";

import { type ReactNode } from "react";
import { LenisProvider } from "@/lib/lenis-context";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
