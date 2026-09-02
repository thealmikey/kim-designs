import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand/30">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
            >
              WINTERIOR
            </Link>
            <p className="font-body text-xs text-stone mt-3 max-w-xs leading-relaxed">
              Kitchen, wardrobe, and bath vanities centre. Elegant kitchens,
              modern bathrooms, vibrant shop fit-outs, and bespoke wardrobe
              designs — crafted in Nairobi.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-6 text-right">
            <div>
              <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
                Studio
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { href: "/work", label: "Work" },
                  { href: "/studio", label: "Studio" },
                  { href: "/services", label: "Services" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
                Contact
              </p>
              <div className="flex flex-col gap-1.5 text-right">
                <a
                  href="mailto:info@winteriordesign.co.ke"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  info@winteriordesign.co.ke
                </a>
                <a
                  href="tel:+254728846560"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  +254 728 846 560
                </a>
                <a
                  href="tel:+254755164654"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  +254 755 164 654
                </a>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
                Visit
              </p>
              <p className="font-body text-xs text-stone leading-relaxed">
                Enterprise Rd, Opp Hillocks Hotel
                <br />
                Industrial Area, Nairobi
                <br />
                P.O. Box 39254-00623
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-[10px] text-stone tracking-wide">
            &copy; {new Date().getFullYear()} Winterior Design
          </p>
          <p className="font-body text-[10px] text-stone tracking-widest uppercase">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
