"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, projectById } from "@/lib/projects";

const label = "font-sans text-[10px] tracking-[0.4em] uppercase";

interface Props {
  slug: string;
}

export default function GalleryPlate({ slug }: Props) {
  const project = projectById(slug);
  const [active, setActive] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] text-[#e8d9b8] flex items-center justify-center p-8">
        <div className="text-center">
          <p className={`${label} text-[#c8a85a] mb-4`}>Not in collection</p>
          <h1 className="font-serif text-5xl italic">Missing work</h1>
          <Link
            href="/v3/work"
            className={`${label} text-[#c8a85a] border border-[#c8a85a] px-4 py-2 inline-block mt-8 hover:bg-[#c8a85a] hover:text-[#0d1b2a] transition-colors`}
          >
            ← Return to viewing
          </Link>
        </div>
      </div>
    );
  }

  const i = projects.findIndex((p) => p.id === slug);
  const next = projects[(i + 1) % projects.length];
  const prev = projects[(i - 1 + projects.length) % projects.length];

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-[#e8d9b8]">
      <header className="sticky top-0 z-10 bg-[#0d1b2a]/90 backdrop-blur-sm border-b border-[#c8a85a]/30">
        <div className="px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between">
          <Link
            href="/v3/work"
            className={`${label} text-[#c8a85a] hover:text-[#e8d9b8] transition-colors`}
          >
            ← The Collection
          </Link>
          <p className={`${label} text-[#e8d9b8]/50`}>
            Work № {String(i + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
          </p>
        </div>
      </header>

      <section className="px-8 md:px-16 lg:px-24 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className={`${label} text-[#c8a85a] mb-6`}>
              {project.category} — {project.year}
            </p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight">
              {project.title}
            </h1>
            <p className="font-serif text-2xl md:text-3xl italic text-[#c8a85a] mt-6">
              {project.subtitle}.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:pl-12">
            <p className="font-serif text-lg italic text-[#e8d9b8]/80 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden border-y border-[#c8a85a]/30">
          <Image
            key={project.images[active]}
            src={project.images[active]}
            alt={`${project.title} — plate ${active + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <span className={`${label} text-[#e8d9b8] bg-[#0d1b2a]/70 backdrop-blur-sm px-3 py-1.5`}>
              Plate {String(active + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
            </span>
            <span className={`${label} text-[#c8a85a] bg-[#0d1b2a]/70 backdrop-blur-sm px-3 py-1.5`}>
              {project.location}
            </span>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-8 border-t border-[#c8a85a]/30">
        <p className={`${label} text-[#c8a85a] mb-6`}>All Plates</p>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {project.images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`relative aspect-square overflow-hidden border-2 transition-all ${
                idx === active
                  ? "border-[#c8a85a]"
                  : "border-transparent hover:border-[#c8a85a]/50"
              }`}
              aria-label={`View plate ${idx + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              <span className={`absolute top-1 left-1 ${label} text-[8px] text-[#0d1b2a] bg-[#e8d9b8] px-1`}>
                {String(idx + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-16 md:py-24 bg-[#0a1622] border-t border-[#c8a85a]/30">
        <p className={`${label} text-[#c8a85a] mb-12`}>§ Catalogue Notes</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <div>
            <p className={`${label} text-[#e8d9b8]/50 mb-3`}>Year</p>
            <p className="font-serif text-3xl md:text-4xl font-light tabular-nums">
              {project.year}
            </p>
          </div>
          <div>
            <p className={`${label} text-[#e8d9b8]/50 mb-3`}>Location</p>
            <p className="font-serif text-3xl md:text-4xl font-light italic">
              {project.location}
            </p>
          </div>
          <div>
            <p className={`${label} text-[#e8d9b8]/50 mb-3`}>Discipline</p>
            <p className="font-serif text-3xl md:text-4xl font-light">
              {project.category}
            </p>
          </div>
          <div>
            <p className={`${label} text-[#e8d9b8]/50 mb-3`}>Status</p>
            <p className="font-serif text-3xl md:text-4xl font-light italic">
              Completed
            </p>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <p className={`${label} text-[#c8a85a] mb-6`}>§ Materials</p>
          <div className="flex flex-wrap gap-3">
            {project.materials.map((m) => (
              <span
                key={m}
                className="font-serif italic text-base text-[#e8d9b8] border border-[#c8a85a]/40 px-4 py-2"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 md:px-16 lg:px-24 py-16 border-t border-[#c8a85a]/30">
        <div className="grid grid-cols-12 gap-6 items-center">
          <Link
            href={`/v3/work/${prev.id}`}
            className="col-span-6 md:col-span-5 group"
          >
            <p className={`${label} text-[#c8a85a] mb-2`}>← Previous</p>
            <p className="font-serif text-2xl md:text-3xl italic group-hover:text-[#c8a85a] transition-colors">
              {prev.title}
            </p>
          </Link>
          <Link
            href="/v3/work"
            className="hidden md:flex col-span-2 justify-center"
          >
            <span className={`${label} text-[#e8d9b8]/60 hover:text-[#c8a85a] transition-colors`}>
              Index
            </span>
          </Link>
          <Link
            href={`/v3/work/${next.id}`}
            className="col-span-6 md:col-span-5 group text-right"
          >
            <p className={`${label} text-[#c8a85a] mb-2`}>Next →</p>
            <p className="font-serif text-2xl md:text-3xl italic group-hover:text-[#c8a85a] transition-colors">
              {next.title}
            </p>
          </Link>
        </div>
      </footer>
    </div>
  );
}
