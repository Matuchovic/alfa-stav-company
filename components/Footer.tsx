"use client";

import { motion } from "framer-motion";

const footerLinks = {
  Firma: ["O nás", "Náš tým", "Kariéra", "Aktuality"],
  Služby: ["Střechy", "Rekonstrukce", "Novostavby", "Fasády"],
  Realizace: ["Naše projekty", "Reference", "Certifikáty", "Materiály"],
  Právní: ["Ochrana osobních údajů", "Zásady cookies", "Obchodní podmínky"],
};

export default function Footer() {
  return (
    <footer
      className="" style={{background:"rgba(5,5,5,0.88)"}}
      style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
    >
      {/* Links grid */}
      <div className="max-w-screen-xl mx-auto px-8 md:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#D4AF37">
                  <path d="M10 2L2 8v10h5v-6h6v6h5V8z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] font-black tracking-[0.1em]">ALFA</div>
                <div className="text-[7px] text-[#9A9A9A] tracking-[0.2em]">STAV GROUP</div>
              </div>
            </div>
            <p className="text-[10px] text-[#9A9A9A] leading-relaxed mb-4">
              Komplexní stavební realizace v Mladé Boleslavi a okolí od roku 1998.
            </p>
            <div className="text-[9px] text-[#D4AF37]/60">
              IČ: 123 456 789<br />
              DIČ: CZ123456789
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="text-[9px] font-black tracking-[0.18em] text-white uppercase mb-4">
                {section}
              </div>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-[10px] text-[#9A9A9A] hover:text-[#D4AF37] transition-colors duration-200 text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-8 md:px-16 py-4 flex flex-wrap items-center justify-between gap-4"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="text-[8px] text-[#9A9A9A]/40 tracking-wide">
          © {new Date().getFullYear()} ALFA STAV GROUP s.r.o. &nbsp;|&nbsp; Všechna práva vyhrazena
        </div>
        <div className="flex items-center gap-1 text-[8px] text-[#9A9A9A]/30 tracking-wide">
          Jednatel: <span className="text-[#9A9A9A]/50 ml-1">Jan Baran</span>
        </div>
      </div>
    </footer>
  );
}
