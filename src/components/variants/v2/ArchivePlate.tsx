"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, projectById } from "@/lib/projects";

const mono = "font-mono";

interface Props {
  slug: string;
}

export default function ArchivePlate({ slug }: Props) {
  const project = projectById(slug);
  const [activePlate, setActivePlate] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] text-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <p className={`${mono} text-xs tracking-[0.2em] uppercase opacity-60 mb-2`}>
            404 / Not catalogued
          </p>
          <h1 className="font-sans text-4xl font-black uppercase">Missing entry</h1>
          <Link
            href="/v2/work"
            className={`${mono} text-xs tracking-[0.2em] uppercase border border-[#0a0a0a] px-4 py-2 inline-block mt-6 hover:bg-[#0a0a0a] hover:text-[#f4f1ea]`}
          >
            ← Return to index
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject =
    projects[(currentIndex - 1 + projects.length) % projects.length];

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#0a0a0a]">
      <header className="border-b border-[#0a0a0a] grid grid-cols-12 sticky top-0 bg-[#f4f1ea] z-10">
        <Link
          href="/v2/work"
          className="col-span-6 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6 hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors"
        >
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase`}>
            ← Index
          </p>
        </Link>
        <div className="col-span-6 md:col-span-6 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            Entry № {String(currentIndex + 1).padStart(3, "0")}
          </p>
          <p className="font-sans text-base md:text-lg font-black uppercase tracking-tight mt-1 truncate">
            {project.title}
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 p-4 md:p-6 flex md:justify-end">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            Plate {String(activePlate + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2`}>
            Category
          </p>
          <p className="font-sans text-sm font-bold uppercase">
            {project.category}
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-6 md:p-10">
          <h1 className="font-sans text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase">
            {project.title}
          </h1>
          <p className={`${mono} text-sm md:text-base mt-4 max-w-2xl`}>
            {project.subtitle}.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2`}>
            § Plate {String(activePlate + 1).padStart(2, "0")}
          </p>
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mt-4`}>
            Specimen
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-4 md:p-6">
          <div className="relative aspect-[4/3] border border-[#0a0a0a] overflow-hidden bg-[#e8e3d6]">
            <Image
              key={project.images[activePlate]}
              src={project.images[activePlate]}
              alt={`${project.title} — plate ${activePlate + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
              <span className={`${mono} text-[10px] tracking-[0.2em] uppercase bg-[#f4f1ea] text-[#0a0a0a] px-2 py-1`}>
                PL. {String(activePlate + 1).padStart(2, "0")}
              </span>
              <span className={`${mono} text-[10px] tracking-[0.2em] uppercase bg-[#f4f1ea] text-[#0a0a0a] px-2 py-1`}>
                {project.category} / {project.year}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between pointer-events-none">
              <span className={`${mono} text-[10px] tracking-[0.2em] uppercase bg-[#0a0a0a] text-[#f4f1ea] px-2 py-1`}>
                KIM-INT / {project.id.toUpperCase()}
              </span>
              <span className={`${mono} text-[10px] tracking-[0.2em] uppercase bg-[#0a0a0a] text-[#f4f1ea] px-2 py-1`}>
                Nairobi
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {project.images.map((image, i) => (
              <button
                key={i}
                onClick={() => setActivePlate(i)}
                className={`relative shrink-0 w-20 h-20 border ${
                  i === activePlate ? "border-[#0a0a0a]" : "border-[#0a0a0a]/30"
                } overflow-hidden`}
                aria-label={`View plate ${i + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <span className={`${mono} text-[8px] tracking-[0.2em] uppercase absolute top-0.5 left-0.5 bg-[#f4f1ea] text-[#0a0a0a] px-1`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § Dossier
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4">
          <div className="p-4 md:p-6 border-r border-[#0a0a0a] last:border-r-0">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Year
            </p>
            <p className="font-sans text-lg font-bold tabular-nums">
              {project.year}
            </p>
          </div>
          <div className="p-4 md:p-6 border-r border-[#0a0a0a] last:border-r-0">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Location
            </p>
            <p className="font-sans text-lg font-bold uppercase">
              {project.location}
            </p>
          </div>
          <div className="p-4 md:p-6 border-r border-[#0a0a0a] last:border-r-0">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Discipline
            </p>
            <p className="font-sans text-lg font-bold uppercase">
              {project.category}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
              Status
            </p>
            <p className="font-sans text-lg font-bold uppercase">
              Completed
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § Description
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-6 md:p-10">
          <p className="font-sans text-xl md:text-3xl font-bold leading-tight max-w-4xl">
            {project.description}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § Materials
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0a0a0a]">
            {project.materials.map((material, i) => (
              <div key={material} className="bg-[#f4f1ea] p-4">
                <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1`}>
                  Mat. {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-sans text-sm md:text-base font-bold uppercase">
                  {material}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 border-b border-[#0a0a0a]">
        <div className="col-span-12 md:col-span-3 border-r border-[#0a0a0a] p-4 md:p-6">
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            § Plate index
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[#0a0a0a]">
          {project.images.map((image, i) => (
            <button
              key={i}
              onClick={() => setActivePlate(i)}
              className="relative aspect-square bg-[#e8e3d6] overflow-hidden group"
              aria-label={`View plate ${i + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="200px"
              />
              <div className="absolute top-1 left-1 right-1 flex justify-between">
                <span className={`${mono} text-[8px] tracking-[0.2em] uppercase bg-[#f4f1ea] text-[#0a0a0a] px-1`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="grid grid-cols-12">
        <Link
          href={`/v2/work/${prevProject.id}`}
          className="col-span-6 md:col-span-4 p-4 md:p-6 border-r border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors"
        >
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            ← Prev
          </p>
          <p className="font-sans text-sm md:text-base font-bold uppercase mt-1">
            {prevProject.title}
          </p>
        </Link>
        <Link
          href="/v2/work"
          className="hidden md:flex col-span-4 p-4 md:p-6 border-r border-[#0a0a0a] items-center justify-center hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors"
        >
          <p className={`${mono} text-xs tracking-[0.2em] uppercase`}>
            Index
          </p>
        </Link>
        <Link
          href={`/v2/work/${nextProject.id}`}
          className="col-span-6 md:col-span-4 p-4 md:p-6 text-right hover:bg-[#0a0a0a] hover:text-[#f4f1ea] transition-colors"
        >
          <p className={`${mono} text-[10px] tracking-[0.2em] uppercase opacity-60`}>
            Next →
          </p>
          <p className="font-sans text-sm md:text-base font-bold uppercase mt-1">
            {nextProject.title}
          </p>
        </Link>
      </footer>
    </div>
  );
}
