import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import Preloader from "@/components/Preloader";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AgentationToolbar from "@/components/AgentationToolbar";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SelectionProvider } from "@/components/variants/v5/SelectionContext";
import SelectionBar from "@/components/variants/v5/SelectionBar";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? "WINTERIOR DESIGN",
    template: `%s`,
  },
  description:
    "Winterior Design — kitchen, wardrobe, and bath vanities centre in Nairobi. Elegant kitchens, modern bathrooms, vibrant shop fit-outs, and bespoke wardrobe designs.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Preloader />
        <ScrollToTop />
        <CustomCursor />
        <Navigation />
        <SmoothScrollProvider>
          <SelectionProvider>
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <SelectionBar />
          </SelectionProvider>
        </SmoothScrollProvider>
        <Footer />
        <WhatsAppFloat />
        <AgentationToolbar />
      </body>
    </html>
  );
}
