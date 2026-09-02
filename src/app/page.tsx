"use client";

import { useState } from "react";
import GalleryGrid from "@/components/variants/v5/GalleryGrid";
import ProjectSlider from "@/components/ProjectSlider";
import Link from "next/link";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="pt-24 md:pt-32 px-4 md:px-12 pb-10">
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
          Kim Interior Designs
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05] max-w-4xl">
          Visual
          <br />
          <span className="italic text-foreground/70">Selection.</span>
        </h1>
        <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-xl mt-6">
          Bespoke interior design from Nairobi — quiet rooms, honest
          materials, documented as a working register. Tap any image to view
          in full screen, build a selection, then send it to WhatsApp for an
          inquiry.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] tracking-[0.3em] uppercase font-body">
          <Link
            href="/studio"
            className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Studio
          </Link>
          <Link
            href="/services"
            className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Contact
          </Link>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <ProjectSlider projectId="pvc-foilwrap-and-high-gloss-handless-kitchen" />
      </section>

      <section className="px-4 md:px-12 pb-32">
        <GalleryGrid activeIndex={activeIndex} onIndexChange={setActiveIndex} />
      </section>
    </main>
  );
}
