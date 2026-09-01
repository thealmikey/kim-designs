"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

const label = "font-sans text-[10px] tracking-[0.4em] uppercase";

export default function GalleryIndex() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-[#e8d9b8]">
      <header className="px-8 md:px-16 lg:px-24 pt-12 md:pt-20 pb-8 md:pb-12 border-b border-[#c8a85a]/30">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-7">
            <p className={`${label} text-[#c8a85a] mb-6`}>
              Exhibit № III — Selected Works
            </p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight">
              A private
              <span className="block italic text-[#c8a85a]">viewing.</span>
            </h1>
          </div>
          <div className="col-span-12 md:col-span-5 md:pl-12">
            <p className="font-serif text-lg md:text-xl italic text-[#e8d9b8]/80 leading-relaxed max-w-md">
              Six interiors, each exhibited as a study in material, proportion,
              and the quiet authority of considered design.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <span className={`${label} text-[#e8d9b8]/50`}>
                {String(projects.length).padStart(2, "0")} works
              </span>
              <span className="w-8 h-px bg-[#c8a85a]/50" />
              <span className={`${label} text-[#e8d9b8]/50`}>
                {projects.reduce((s, p) => s + p.images.length, 0)} plates
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className={`${label} text-[#c8a85a]`}>
            § The Collection
          </p>
          <p className={`${label} text-[#e8d9b8]/40 hidden md:block`}>
            Hover to preview
          </p>
        </div>

        <ul className="space-y-0">
          {projects.map((project, i) => (
            <li
              key={project.id}
              onMouseEnter={() => setActiveId(project.id)}
              onMouseLeave={() => setActiveId(null)}
              className="border-t border-[#c8a85a]/20 last:border-b last:border-[#c8a85a]/20"
            >
              <Link
                href={`/v3/work/${project.id}`}
                className="group grid grid-cols-12 gap-6 items-baseline py-10 md:py-14 transition-colors duration-500"
              >
                <span className={`col-span-2 md:col-span-1 font-serif text-2xl md:text-3xl italic text-[#c8a85a]/70 tabular-nums`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-10 md:col-span-7">
                  <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none group-hover:text-[#c8a85a] transition-colors duration-500">
                    {project.title}
                  </h2>
                  <p className="font-serif text-lg md:text-xl italic text-[#e8d9b8]/60 mt-3">
                    {project.subtitle}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 md:text-right">
                  <p className={`${label} text-[#e8d9b8]/50 mb-1`}>Category</p>
                  <p className="font-serif text-base italic">
                    {project.category}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 md:text-right">
                  <p className={`${label} text-[#e8d9b8]/50 mb-1`}>Year</p>
                  <p className="font-serif text-base tabular-nums">
                    {project.year}
                  </p>
                </div>
              </Link>

              {activeId === project.id && (
                <div className="hidden md:block relative h-[40vh] mb-12 -mt-4 overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <span className={`${label} text-[#e8d9b8]/80 bg-[#0d1b2a]/60 backdrop-blur-sm px-2 py-1`}>
                      Plate I / {project.images.length}
                    </span>
                    <span className={`${label} text-[#c8a85a] bg-[#0d1b2a]/60 backdrop-blur-sm px-2 py-1`}>
                      {project.location}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-16 md:py-24 border-t border-[#c8a85a]/30 bg-[#0a1622]">
        <p className={`${label} text-[#c8a85a] mb-12`}>§ Provenance</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          {Array.from(new Set(projects.flatMap((p) => p.materials)))
            .slice(0, 8)
            .map((material) => (
              <div key={material}>
                <p className={`${label} text-[#e8d9b8]/50 mb-2`}>Material</p>
                <p className="font-serif text-2xl md:text-3xl font-light leading-tight">
                  {material}
                </p>
              </div>
            ))}
        </div>
      </section>

      <footer className="px-8 md:px-16 lg:px-24 py-12 border-t border-[#c8a85a]/30 flex flex-col md:flex-row justify-between gap-6">
        <p className="font-serif italic text-[#e8d9b8]/60">
          Kim Interior Designs — A private viewing.
        </p>
        <div className="flex gap-6">
          <Link
            href="/v2/work"
            className={`${label} text-[#c8a85a] hover:text-[#e8d9b8] transition-colors`}
          >
            View archive →
          </Link>
          <Link
            href="/work"
            className={`${label} text-[#c8a85a] hover:text-[#e8d9b8] transition-colors`}
          >
            View editorial →
          </Link>
        </div>
      </footer>
    </div>
  );
}
