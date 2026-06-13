import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ParallaxBackground from "@/components/ParallaxBackground";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "ALFA STAV GROUP | Stavební firma Mladá Boleslav",
  description: "Komplexní stavební realizace, střechy, rekonstrukce a novostavby v Mladé Boleslavi a okolí. Více než 25 let zkušeností, 500+ dokončených projektů.",
  keywords: "stavební firma, střechy, rekonstrukce, novostavby, fasády, Mladá Boleslav, ALFA STAV",
  authors: [{ name: "ALFA STAV GROUP s.r.o." }],
  openGraph: {
    title: "ALFA STAV GROUP | Stavební firma Mladá Boleslav",
    description: "Komplexní stavební realizace, střechy, rekonstrukce a novostavby v Mladé Boleslavi.",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body style={{ background: "#050505" }}>
        <SmoothScroll>
          <ScrollProgress />
          {/* Global parallax background — fixed behind everything */}
          <ParallaxBackground />
          {/* Page content sits on top via z-index */}
          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
