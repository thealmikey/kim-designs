import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import Preloader from "@/components/Preloader";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AgentationToolbar from "@/components/AgentationToolbar";
import ScrollToTop from "@/components/ScrollToTop";
import { SelectionProvider } from "@/components/variants/v5/SelectionContext";
import SelectionBar from "@/components/variants/v5/SelectionBar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? "Kim Interior Designs",
    template: `%s`,
  },
  description:
    "Bespoke interior design studio crafting exceptional spaces with precision, materiality, and contemporary African character.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
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
        <AgentationToolbar />
      </body>
    </html>
  );
}
