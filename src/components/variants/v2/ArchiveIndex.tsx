"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

const mono = "font-mono";

export default function ArchiveIndex() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const totalPlates = projects.reduce((sum, p) => sum + p.images.length, 0);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#0a0a0a]">
      <header className="border-b border-[#0a0a0a]">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase`}>
              Doc / 2024 — 2026
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 border-r border-[#0a0a0a] p-4 md:p-6 flex items-baseline gap-4">
            <h1 className="font-sans text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
              Index
            </h1>
            <span className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
              Selected Works
            </span>
          </div>
          <div className="col-span-6 md:col-span-2 border-r border-[#0a0a0a] p-4 md:p-6">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Entries
            </p>
            <p className="font-sans text-xl md:text-2xl font-black tabular-nums">
              {String(projects.length).padStart(3, "0")}
            </p>
          </div>
          <div className="col-span-6 md:col-span-1 p-4 md:p-6">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Plates
            </p>
            <p className="font-sans text-xl md:text-2xl font-black tabular-nums">
              {String(totalPlates).padStart(3, "0")}
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § 01 / Catalogue
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-6 md:p-10">
          <h2 className="font-sans text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase">
            Archive
            <span className="block text-[#0a0a0a]/30">of work.</span>
          </h2>
          <p className={`${mono} text-xs md:text-sm max-w-2xl mt-6 leading-relaxed`}>
            A working register of completed commissions. Each entry is filed
            under category, material, and date. Plates are arranged in order
            of execution, not preference.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § 02 / Entries
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          <div className="hidden md:grid grid-cols-12 border-b border-[#0a0a0a]">
            <div className={`col-span-1 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 border-r border-[#0a0a0a]`}>
              №
            </div>
            <div className={`col-span-4 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 border-r border-[#0a0a0a]`}>
              Title
            </div>
            <div className={`col-span-2 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 border-r border-[#0a0a0a]`}>
              Category
            </div>
            <div className={`col-span-2 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 border-r border-[#0a0a0a]`}>
              Year
            </div>
            <div className={`col-span-2 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 border-r border-[#0a0a0a]`}>
              Location
            </div>
            <div className={`col-span-1 p-4 ${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 text-right`}>
              Plates
            </div>
          </div>

          {projects.map((project, i) => {
            const isHovered = hoveredId === project.id;
            return (
              <Link
                key={project.id}
                href={`/v2/work/${project.id}`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative block border-b border-[#0a0a0a] last:border-b-0 hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors duration-200"
              >
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-2 md:col-span-1 p-4 border-r border-[#0a0a0a] group-hover:border-[#f4f1ea]/30">
                    <span className={`${mono} text-xs md:text-sm tabular-nums`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-4 p-4 border-r border-[#0a0a0a] group-hover:border-[#f4f1ea]/30">
                    <h3 className="font-sans text-lg md:text-2xl font-black uppercase tracking-tight leading-none">
                      {project.title}
                    </h3>
                    <p className={`${mono} text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-60 mt-2`}>
                      {project.subtitle}
                    </p>
                  </div>
                  <div className="hidden md:block col-span-2 p-4 border-r border-[#0a0a0a] group-hover:border-[#f4f1ea]/30">
                    <span className={`${mono} text-xs uppercase`}>
                      {project.category}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2 p-4 border-r border-[#0a0a0a] group-hover:border-[#f4f1ea]/30">
                    <span className={`${mono} text-xs tabular-nums`}>
                      {project.year}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2 p-4 border-r border-[#0a0a0a] group-hover:border-[#f4f1ea]/30">
                    <span className={`${mono} text-xs uppercase`}>
                      {project.location}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-1 p-4 text-right">
                    <span className={`${mono} text-xs tabular-nums`}>
                      {String(project.images.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {isHovered && (
                  <div className="hidden md:block pointer-events-none absolute top-1/2 -translate-y-1/2 right-4 z-10 w-48 h-32 border border-[#0a0a0a] group-hover:border-[#f4f1ea] bg-[#f4f1ea] group-hover:bg-[#0a0a0a] overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute top-1 left-1 right-1 flex justify-between">
                      <span className={`${mono} text-[8px] tracking-[0.2em] uppercase bg-[#f4f1ea] text-[#0a0a0a] px-1`}>
                        PL. 01
                      </span>
                      <span className={`${mono} text-[8px] tracking-[0.2em] uppercase bg-[#f4f1ea] text-[#0a0a0a] px-1`}>
                        {project.year}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <section className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § 03 / Materials
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0a0a0a]">
            {Array.from(
              new Set(projects.flatMap((p) => p.materials))
            ).map((material) => (
              <div key={material} className="bg-[#f4f1ea] p-4">
                <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
                  Mat.
                </p>
                <p className="font-sans text-sm md:text-base font-bold uppercase">
                  {material}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a] grid grid-cols-12">
        <div className="col-span-12 md:col-span-6 p-4 md:p-6 border-r border-[#0a0a0a]">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            End of document
          </p>
          <p className="font-sans text-xl md:text-3xl font-black uppercase tracking-tight mt-1">
            Kim Interior Designs
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 p-4 md:p-6 flex md:justify-end items-end">
          <Link
            href="/work"
            className={`${mono} text-xs tracking-[0.2em] uppercase border border-[#0a0a0a] px-4 py-2 hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors`}
          >
            ← View editorial variant
          </Link>
        </div>
      </footer>
    </div>
  );
}
