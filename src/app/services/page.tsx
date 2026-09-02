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
      <section className="relative w-full h-[88vh] min-h-[640px] overflow-hidden">
        <Image
          src="/images/pvc-foilwrap-and-high-gloss-handless-kitchen/01.jpg"
          alt="Winterior Design — handleless high-gloss kitchen"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,20,20,0.55) 0%, rgba(20,20,20,0.30) 35%, rgba(20,20,20,0.65) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(110deg, rgba(250,248,245,0.10) 0%, rgba(250,248,245,0) 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-4 md:px-12 py-24 md:py-32 text-cream">
          <div>
            <p className="font-body text-[10px] text-cream/70 tracking-[0.4em] uppercase">
              Capabilities
            </p>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-light text-cream tracking-[-0.04em] leading-[0.95]">
              What we
              <br />
              <span className="italic text-cream/80">do.</span>
            </h1>
            <ul className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 max-w-2xl">
              {offerings.map((o) => (
                <li
                  key={o}
                  className="font-body text-sm md:text-[15px] text-cream/85 flex items-baseline gap-2"
                >
                  <span className="text-aged-brass">·</span> {o}
                </li>
              ))}
            </ul>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-body">
              <Link
                href="/contact"
                className="border border-cream/40 text-cream px-4 py-2 hover:bg-cream hover:text-charcoal transition-colors"
              >
                Start a Project
              </Link>
              <Link
                href="/work"
                className="border border-cream/40 text-cream px-4 py-2 hover:bg-cream hover:text-charcoal transition-colors"
              >
                See Work
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-between text-cream/60">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase">
              Winterior Design · Nairobi
            </p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase hidden md:block">
              Scroll
            </p>
          </div>
        </div>
      </section>

      <ServicesSection />
    </main>
  );
}
