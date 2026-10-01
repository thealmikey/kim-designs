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
    <main className="bg-white">
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
            <p className="font-body text-[10px] text-[#FF6600] tracking-[0.4em] uppercase font-semibold">
              How we do it
            </p>
          </div>

          {/* w-fit makes the panel hug its content instead of holding a fixed
              max-w-4xl, which left the right half of the row empty. The
              heading carries no forced line break so it sets on one line when
              there is room and wraps gently when there is not. */}
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border-l-2 border-[#FF6600] -ml-6 lg:-ml-16 w-fit max-w-[calc(100%+3rem)]">
            <div className="px-6 md:px-8 lg:px-10 py-6 md:py-8">
              <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] font-medium text-[#FFFFFF] tracking-[-0.02em] leading-[0.95]">
                What we do<span className="italic text-[#FFFFFF]/90">.</span>
              </h1>
              <ul className="mt-6 md:mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {offerings.map((o) => (
                  <li
                    key={o}
                    className="font-body text-sm md:text-[15px] text-[#FFFFFF]/90 flex items-baseline gap-2"
                  >
                    <span className="text-[#FF6600]">·</span> {o}
                  </li>
                ))}
              </ul>
              <div className="mt-6 md:mt-7 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-body font-bold">
                <Link
                  href="/contact"
                  className="bg-[#FF6600] text-[#FFFFFF] px-5 py-3 hover:bg-[#D95500] transition-colors"
                >
                  Start a Project
                </Link>
                <Link
                  href="/work"
                  className="border border-[#FFFFFF]/45 text-[#FFFFFF] px-5 py-3 hover:bg-[#FFFFFF] hover:text-[#333333] transition-colors"
                >
                  See Work
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between text-[#FFFFFF]/70">            <p className="font-body text-[10px] tracking-[0.3em] uppercase">
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