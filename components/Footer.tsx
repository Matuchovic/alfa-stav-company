"use client";

const footerLinks = {
  Firma:    ["O nás","Náš tým","Kariéra","Aktuality"],
  Služby:   ["Střechy","Rekonstrukce","Novostavby","Fasády"],
  Realizace:["Naše projekty","Reference","Certifikáty"],
  Právní:   ["Ochrana osobních údajů","Zásady cookies"],
};

export default function Footer() {
  return (
    <footer style={{background:"rgba(5,5,5,0.88)",borderTop:"0.5px solid rgba(255,255,255,0.06)"}}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#D4AF37"><path d="M10 2L2 8v10h5v-6h6v6h5V8z"/></svg>
              </div>
              <div>
                <div className="text-[11px] font-black tracking-[0.1em]">ALFA</div>
                <div className="text-[7px] text-[#9A9A9A] tracking-[0.2em]">STAV GROUP</div>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed mb-3" style={{color:"rgba(154,154,154,0.6)"}}>Komplexní stavební realizace v Mladé Boleslavi a okolí od roku 1998.</p>
            <div className="text-[9px]" style={{color:"rgba(212,175,55,0.5)"}}>IČ: 123 456 789</div>
          </div>
          {Object.entries(footerLinks).map(([section,links])=>(
            <div key={section}>
              <div className="text-[9px] font-black tracking-[0.18em] text-white uppercase mb-3 sm:mb-4">{section}</div>
              <ul className="flex flex-col gap-2">
                {links.map(link=>(
                  <li key={link}><button className="text-[10px] text-left transition-colors duration-200 hover:text-[#D4AF37]" style={{color:"rgba(154,154,154,0.55)"}}>{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t px-4 sm:px-8 md:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4" style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <div className="text-[8px] text-center sm:text-left" style={{color:"rgba(154,154,154,0.35)"}}>© {new Date().getFullYear()} ALFA STAV GROUP s.r.o. · Všechna práva vyhrazena</div>
        <div className="text-[8px]" style={{color:"rgba(154,154,154,0.3)"}}>Jednatel: <span style={{color:"rgba(154,154,154,0.5)"}}>Jan Baran</span></div>
      </div>
    </footer>
  );
}
