import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand/30">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <Link href="/" className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              KIM
            </Link>
            <p className="font-body text-xs text-stone mt-3 max-w-xs leading-relaxed">
              Bespoke interior design studio crafting exceptional spaces with precision, materiality, and contemporary African character.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-right">
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

        <div className="mt-12 pt-6 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-[10px] text-stone tracking-wide">
            &copy; {new Date().getFullYear()} Kim Interior Designs
          </p>
          <p className="font-body text-[10px] text-stone tracking-widest uppercase">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
