import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#0A0A0A] px-6 pt-[var(--nav-two-row-height)]">
      <div className="max-w-2xl text-center">
        <p className="font-body text-[10px] text-[#D4A843] tracking-[0.4em] uppercase font-semibold mb-6">
          404 — Not Found
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-[#FFFFFF] tracking-tight leading-[1.05]">
          The space
          <br />
          <span className="italic text-[#FFFFFF]/75">isn&apos;t here</span>
        </h1>
        <p className="mt-8 font-body text-base md:text-lg text-[#FFFFFF]/65 max-w-md mx-auto leading-relaxed">
          The page you are looking for may have been moved or never existed. Let&apos;s
          guide you back to the studio.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-body text-[11px] font-bold text-[#0A0A0A] bg-[#D4A843] px-8 py-4 hover:bg-[#E8C56D] transition-colors tracking-[0.25em] uppercase"
          >
            Return Home
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-3 font-body text-[11px] font-bold text-[#FFFFFF]/70 border border-[#2A2A2A] px-8 py-4 hover:border-[#D4A843] hover:text-[#D4A843] transition-colors tracking-[0.25em] uppercase"
          >
            View Work
          </Link>
        </div>
      </div>
    </main>
  );
}