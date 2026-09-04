import Link from "next/link";

const quickLinks = [
  { href: "/v6/work", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-sand/30">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-4">
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

          {/* Quick Links — matches woodkivu's footer pattern */}
          <div className="md:col-span-2">
            <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
              Quick Links
            </p>
            <ul className="flex flex-col gap-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="font-body text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-3">
              Contact
            </p>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a
                  href="mailto:info@winteriordesign.co.ke"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  info@winteriordesign.co.ke
                </a>
              </li>
              <li>
                <a
                  href="tel:+254728846560"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  +254 728 846 560
                </a>
              </li>
              <li>
                <a
                  href="tel:+254755164654"
                  className="font-body text-xs text-stone hover:text-foreground transition-colors tracking-wide"
                >
                  +254 755 164 654
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div className="md:col-span-3">
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
