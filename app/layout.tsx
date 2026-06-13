import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

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
      <body>
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
