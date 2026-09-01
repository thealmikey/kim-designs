"use client";

import { useState } from "react";
import GalleryGrid from "@/components/variants/v5/GalleryGrid";

export default function V5GalleryIndex() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="pt-24 md:pt-32 px-4 md:px-12 pb-12">
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
          Gallery
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]">
          Visual
          <br />
          <span className="italic text-foreground/70">Selection.</span>
        </h1>
        <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-xl mt-6">
          Tap any image to view in full screen. Use the + button on each
          card to add it to your selection, then send the selection to
          WhatsApp for an inquiry.
        </p>
      </div>

      <div className="px-4 md:px-12 pb-32">
        <GalleryGrid activeIndex={activeIndex} onIndexChange={setActiveIndex} />
      </div>
    </main>
  );
}
