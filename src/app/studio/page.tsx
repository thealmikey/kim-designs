import StudioSection from "@/components/StudioSection";
import WorkInProgress from "@/components/WorkInProgress";

export default function StudioPage() {
  return (
    <main>
      <section className="pt-[calc(var(--nav-two-row-height)+3rem)] md:pt-[calc(var(--nav-two-row-height)+5rem)] px-4 md:px-12 pb-12 md:pb-16 border-b border-[#C6C5CA]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
          <div>
            <p className="font-body text-[11px] text-warm-gray tracking-[0.4em] uppercase mb-6">
              The Studio
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-medium text-[#333333] tracking-[-0.02em] leading-[0.95]">
              How we
              <br />
              <span className="italic text-[#333333]/80">work.</span>
            </h1>
          </div>
          <p className="font-body text-base md:text-lg text-warm-gray leading-relaxed md:max-w-md shrink-0">
            A studio is a method. Ours has four steps, and we don&apos;t skip
            any of them. The result is interiors that respond to the people who
            live with them — kitchens, wardrobes, bath vanities, and shop
            fit-outs made to last.
          </p>
        </div>
      </section>

      <StudioSection />

      <WorkInProgress />
    </main>
  );
}
