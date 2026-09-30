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
    <main className="bg-[#0A0A0A]">
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
              "linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.70) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-16 py-28 md:py-32 text-[#FFFFFF]">
          <div>
            <p className="font-body text-[10px] text-[#D4A843] tracking-[0.4em] uppercase font-semibold">
              How we do it
            </p>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-light text-[#FFFFFF] tracking-[-0.04em] leading-[0.95]">
              What we
              <br />
              <span className="italic text-[#FFFFFF]/80">do.</span>
            </h1>
            <ul className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 max-w-2xl">
              {offerings.map((o) => (
                <li
                  key={o}
                  className="font-body text-sm md:text-[15px] text-[#FFFFFF]/85 flex items-baseline gap-2"
                >
                  <span className="text-[#D4A843]">·</span> {o}
                </li>
              ))}
            </ul>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-body font-bold">
              <Link
                href="/contact"
                className="bg-[#D4A843] text-[#0A0A0A] px-5 py-3 hover:bg-[#E8C56D] transition-colors"
              >
                Start a Project
              </Link>
              <Link
                href="/work"
                className="border border-[#FFFFFF]/40 text-[#FFFFFF] px-5 py-3 hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-colors"
              >
                See Work
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-between text-[#FFFFFF]/60">
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