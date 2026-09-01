import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-background px-6">
      <div className="max-w-2xl text-center">
        <p className="font-body text-[10px] text-warm-gray tracking-[0.4em] uppercase mb-6">
          404 — Not Found
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-tight leading-[1.05]">
          The space<br />
          <span className="italic text-foreground/70">isn&apos;t here</span>
        </h1>
        <p className="mt-8 font-body text-base md:text-lg text-warm-gray max-w-md mx-auto leading-relaxed">
          The page you are looking for may have been moved or never existed. Let&apos;s
          guide you back to the studio.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 font-body text-xs text-foreground border border-foreground/20 px-8 py-4 hover:bg-foreground hover:text-cream transition-all duration-500 tracking-[0.25em] uppercase"
          >
            <span className="w-6 h-px bg-foreground/40 group-hover:bg-cream transition-colors" />
            Return Home
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 font-body text-xs text-warm-gray hover:text-foreground transition-colors tracking-[0.25em] uppercase"
          >
            <span className="w-6 h-px bg-warm-gray group-hover:bg-foreground transition-colors" />
            View Work
          </Link>
        </div>
      </div>
    </main>
  );
}
