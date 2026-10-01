import Link from "next/link";

const quickLinks = [
  { href: "/studio", label: "About Us" },
  { href: "/services", label: "How we do it" },
  { href: "/kitchens", label: "Kitchens" },
  { href: "/wardrobes", label: "Wardrobes" },
  { href: "/bath-vanities", label: "Bath Vanities" },
  { href: "/shop-fit-outs", label: "Shop Fit-Outs" },
  { href: "/contact", label: "Contact Us" },
];

const contactLinks = [
  { href: "mailto:info@winteriordesign.co.ke", label: "info@winteriordesign.co.ke" },
  { href: "tel:0728846560", label: "0728 846 560" },
  { href: "tel:0737825013", label: "0737 825 013" },
];

const socialLinks = [
  { href: "https://wa.me/254728846560", label: "WhatsApp", icon: "whatsapp" },
  { href: "https://www.instagram.com/woodkivuinteriors/", label: "Instagram", icon: "instagram" },
  { href: "https://web.facebook.com/WoodKivuInteriorsKenya/", label: "Facebook", icon: "facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#C6C5CA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="Winterior Design home">
              <span className="relative block" style={{ height: "50px", width: "50px", flexShrink: 0 }}>
                <img src="/winterior-mark.png" alt="Winterior Design" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </span>
              <span className="flex flex-col items-start justify-center gap-0.5 leading-none">
                <span className="font-bold tracking-[0.04em] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(1.25rem, 2vw, 1.5rem)", lineHeight: 1, color: "#333333" }}>
                  WINTERIOR
                </span>
                <span className="font-semibold tracking-[0.32em] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-roboto), sans-serif", fontSize: "clamp(0.5rem, 0.8vw, 0.625rem)", lineHeight: 1, letterSpacing: "0.42em", color: "#FF6600" }}>
                  DESIGN
                </span>
              </span>
            </Link>
            <p className="font-body text-sm text-[#333333]/60 max-w-xs leading-relaxed">
              Kitchen, wardrobe, and bath vanities centre. Elegant kitchens, modern bathrooms, vibrant shop fit-outs, and bespoke wardrobe designs — crafted in Nairobi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] font-semibold mb-4">Quick Links</p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-[#333333]/70 hover:text-[#FF6600] transition-colors tracking-[0.05em]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] font-semibold mb-4">Get In Touch</p>
            <ul className="flex flex-col gap-2">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-body text-sm text-[#333333]/70 hover:text-[#FF6600] transition-colors tracking-[0.05em]">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="https://wa.me/254728846560" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-[#333333]/70 hover:text-[#25D366] transition-colors tracking-[0.05em] inline-flex items-center gap-2">
                  <span>💬</span> WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Visit / Social */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#FF6600] font-semibold mb-4">Follow Us</p>
            <div className="flex flex-col gap-3 mb-6">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-[#333333]/70 hover:text-[#FF6600] transition-colors tracking-[0.05em] inline-flex items-center gap-2">
                  <span>{link.icon === "whatsapp" ? "💬" : link.icon === "instagram" ? "📷" : "📘"}</span>
                  {link.label}
                </a>
              ))}
            </div>
            <address className="font-body text-sm text-[#333333]/60 leading-relaxed not-italic">
              Enterprise Rd, Opp Hillocks Hotel<br />
              Industrial Area, Nairobi<br />
              P.O. Box 39254-00623
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#C6C5CA] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[10px] tracking-[0.1em] uppercase text-[#333333]/60">
            &copy; {new Date().getFullYear()} Winterior Design
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#333333]/60">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}