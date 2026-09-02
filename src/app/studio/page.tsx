import StudioSection from "@/components/StudioSection";
import WorkInProgress from "@/components/WorkInProgress";

export default function StudioPage() {
  return (
    <main>
      <section className="pt-24 md:pt-32 px-4 md:px-12 pb-12 md:pb-16 border-b border-sand/30">
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-6">
          The Studio
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-light text-foreground tracking-[-0.04em] leading-[0.95] max-w-6xl">
          How we
          <br />
          <span className="italic text-foreground/70">work.</span>
        </h1>
        <p className="font-body text-base md:text-lg text-warm-gray leading-relaxed max-w-2xl mt-8 md:mt-10">
          A studio is a method. Ours has four steps, and we don&apos;t skip
          any of them. The result is interiors that respond to the people who
          live with them — kitchens, wardrobes, bath vanities, and shop
          fit-outs made to last.
        </p>
      </section>

      <StudioSection />

      <WorkInProgress />
    </main>
  );
}
