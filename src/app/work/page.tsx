"use client";

import { useState } from "react";
import GalleryGrid from "@/components/variants/v5/GalleryGrid";

export default function WorkPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="pt-24 md:pt-32 px-4 md:px-12 pb-10">
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
          All work
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]">
          Selected
          <br />
          <span className="italic text-foreground/70">Work</span>
        </h1>
      </section>

      <section className="px-4 md:px-12 pb-32">
        <GalleryGrid activeIndex={activeIndex} onIndexChange={setActiveIndex} />
      </section>
    </main>
  );
}
