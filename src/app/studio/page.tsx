import StudioSection from "@/components/StudioSection";

export default function StudioPage() {
  return (
    <main>
      <div className="pt-24 md:pt-32 px-6 md:px-12 pb-8">
        <p className="font-body text-xs text-warm-gray tracking-[0.3em] uppercase mb-4">
          Philosophy
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight">
          The Studio
        </h1>
      </div>
      <StudioSection />
    </main>
  );
}
