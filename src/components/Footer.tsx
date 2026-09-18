import Link from "next/link";

const quickLinks = [
  { href: "/kitchens", label: "Kitchens" },
  { href: "/wardrobes", label: "Wardrobes" },
  { href: "/bath-vanities", label: "Bath Vanities" },
  { href: "/shop-fit-outs", label: "Shop Fit-Outs" },
  { href: "/studio", label: "About" },
  { href: "/contact", label: "Contact" },
];

const contactLinks = [
  { href: "mailto:info@winteriordesign.co.ke", label: "info@winteriordesign.co.ke" },
  { href: "tel:+254728846560", label: "+254 728 846 560" },
  { href: "tel:+254755164654", label: "+254 755 164 654" },
];

const socialLinks = [
  { href: "https://wa.me/254728846560", label: "WhatsApp", icon: "whatsapp" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F5F1E9] border-t border-[#171716]/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-6"
              aria-label="Winterior Design home"
            >
              <span className="relative block" style={{ height: "48px", width: "48px", flexShrink: 0 }}>
                <img
                  src="/winterior-mark.png"
                  alt="Winterior Design"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </span>
              <span className="flex flex-col items-start justify-center gap-0.5 leading-none">
                <span
                  className="font-bold tracking-[0.04em] uppercase whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                    lineHeight: 1,
                    color: "#171716",
                  }}
                >
                  WINTERIOR
                </span>
                <span
                  className="font-semibold tracking-[0.32em] uppercase whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "clamp(0.5rem, 0.8vw, 0.625rem)",
                    lineHeight: 1,
                    letterSpacing: "0.42em",
                    color: "#171716",
                  }}
                >
                  DESIGN
                </span>
              </span>
            </Link>
            <p className="font-body text-sm text-[#171716]/70 max-w-xs leading-relaxed">
              Kitchen, wardrobe, and bath vanities centre. Elegant kitchens,
              modern bathrooms, vibrant shop fit-outs, and bespoke wardrobe
              designs — crafted in Nairobi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#A68A64] font-semibold mb-4">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-[#171716]/80 hover:text-[#A68A64] transition-colors tracking-[0.05em]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#A68A64] font-semibold mb-4">
              Contact
            </p>
            <ul className="flex flex-col gap-2">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-[#171716]/80 hover:text-[#A68A64] transition-colors tracking-[0.05em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/254728846560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-[#171716]/80 hover:text-[#25D366] transition-colors tracking-[0.05em] inline-flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#A68A64] font-semibold mb-4">
              Visit
            </p>
            <address className="font-body text-sm text-[#171716]/80 leading-relaxed not-italic">
              Enterprise Rd, Opp Hillocks Hotel<br />
              Industrial Area, Nairobi<br />
              P.O. Box 39254-00623
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#171716]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[10px] tracking-[0.1em] uppercase text-[#171716]/50">
            &copy; {new Date().getFullYear()} Winterior Design
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#171716]/50">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}