"use client";

import { useState } from "react";
import GalleryGrid from "@/components/variants/v5/GalleryGrid";
import ProjectSlider from "@/components/ProjectSlider";
import OffersSection from "@/components/OffersSection";
import Link from "next/link";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="pt-24 md:pt-28 px-4 md:px-12 pb-10 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center">
            <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
              Winterior Design
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.05]">
              Kitchen, Wardrobe
              <br />
              <span className="italic text-foreground/70">&amp; Bath Vanities.</span>
            </h1>
            <p className="font-body text-sm md:text-[15px] text-foreground/70 leading-relaxed max-w-md mt-5">
              &ldquo;For a house to be successful, the objects in it must
              communicate with one another, respond, and balance one
              another.&rdquo;
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-body">
              <Link
                href="/services"
                className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8">
            <ProjectSlider projectId="walk-in-closet" compact />
          </div>
        </div>
      </section>

      <OffersSection />

      <section className="px-4 md:px-12 pb-32">
        <GalleryGrid activeIndex={activeIndex} onIndexChange={setActiveIndex} />
      </section>
    </main>
  );
}
