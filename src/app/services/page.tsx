import Image from "next/image";
import Link from "next/link";
import ServicesSection from "@/components/ServicesSection";

const offerings = [
  "Elegant Kitchen Designs",
  "Modern Bathroom Designs",
  "Vibrant Shop Fit-Outs",
  "Bespoke Wardrobe Designs",
];

export default function ServicesPage() {
  return (
    <main>
      <section className="pt-24 md:pt-28 px-4 md:px-12 pb-10 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center">
            <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-4">
              Capabilities
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.05]">
              What we
              <br />
              <span className="italic text-foreground/70">do.</span>
            </h1>
            <ul className="font-body text-sm md:text-[15px] text-foreground/80 leading-relaxed mt-5 space-y-1 list-none">
              {offerings.map((o) => (
                <li key={o} className="flex items-baseline gap-2">
                  <span className="text-aged-brass">·</span> {o}
                </li>
              ))}
            </ul>
            <p className="font-body text-sm md:text-[15px] text-foreground/70 leading-relaxed max-w-md mt-5">
              We listen first. We study how light moves, how a room is used,
              what the space is asking for. From that conversation we design
              interiors that feel inevitable.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-body">
              <Link
                href="/contact"
                className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                Start a Project
              </Link>
              <Link
                href="/work"
                className="border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                See Work
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8">
            <div className="relative w-full h-[60vh] min-h-[420px] md:h-[64vh] overflow-hidden bg-foreground/5">
              <Image
                src="/images/pvc-foilwrap-and-high-gloss-handless-kitchen/01.jpg"
                alt="Winterior Design — a handleless high-gloss kitchen"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 68vw"
                className="object-cover"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <p className="font-body text-[10px] text-cream/70 tracking-[0.3em] uppercase">
                  Featured
                </p>
                <p className="font-display text-xl md:text-2xl text-cream tracking-tight leading-tight mt-1">
                  Foilwrap &amp; High Gloss Kitchen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
    </main>
  );
}
