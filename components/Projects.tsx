"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const projects = [
  { num:"01", type:"NOVOSTAVBA",   name:"Rodinný dům Na Vinici", loc:"Mladá Boleslav", year:"2023", bg:"linear-gradient(145deg,#1a2010 0%,#0e1208 100%)" },
  { num:"02", type:"STŘECHA",      name:"Moderní střecha",        loc:"Praha",          year:"2023", bg:"linear-gradient(145deg,#201810 0%,#120e08 100%)" },
  { num:"03", type:"REKONSTRUKCE", name:"Vila Háje",              loc:"Mladá Boleslav", year:"2022", bg:"linear-gradient(145deg,#101828 0%,#080e18 100%)" },
  { num:"04", type:"FASÁDA",       name:"Bytový komplex",         loc:"Mladá Boleslav", year:"2022", bg:"linear-gradient(145deg,#1a1810 0%,#100e08 100%)" },
  { num:"05", type:"KOMERČNÍ",     name:"Office Park",            loc:"Mladá Boleslav", year:"2023", bg:"linear-gradient(145deg,#182020 0%,#0e1414 100%)" },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once:true, margin:"-80px" });

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16" id="projects" style={{background:"transparent"}}>
      <div className="max-w-screen-xl mx-auto">
        <motion.div ref={ref} initial={{opacity:0,y:30}} animate={isInView?{opacity:1,y:0}:{}}
          transition={{duration:0.8,ease:[0.16,1,0.3,1]}} className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-[#D4AF37]"/>
              <span className="text-[9px] tracking-[0.3em] uppercase" style={{color:"rgba(212,175,55,.65)"}}>VYBRANÉ REALIZACE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">NAŠE PROJEKTY</h2>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase hidden sm:block" style={{color:"rgba(212,175,55,.3)"}}>05 realizací</span>
        </motion.div>

        {/* Mobile: single column stack / Tablet: 2 col / Desktop: masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[5px]"
          style={{gridTemplateRows:"auto"}}>
          {projects.map((p,i)=>(
            <motion.div key={p.num}
              initial={{opacity:0,y:30,scale:0.97}} animate={isInView?{opacity:1,y:0,scale:1}:{}}
              transition={{duration:0.7,delay:i*0.1,ease:[0.16,1,0.3,1]}}
              className={`group relative overflow-hidden cursor-pointer bg-[#0E0E0E] ${
                i===0?"sm:row-span-2 lg:row-span-2":""
              }`}
              style={{minHeight: i===0 ? "280px" : "180px"}}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{background:p.bg}}>
                <div className="absolute inset-0" style={{background:"repeating-linear-gradient(168deg,rgba(212,175,55,0.03) 0,rgba(212,175,55,0.03) 1px,transparent 1px,transparent 24px)"}}/>
              </div>
              <div className="absolute inset-0" style={{background:"linear-gradient(0deg,rgba(5,5,5,.92) 0%,rgba(5,5,5,.2) 50%,transparent 80%)"}}/>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:"linear-gradient(0deg,rgba(212,175,55,.07) 0%,transparent 60%)"}}/>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-10" style={{background:"linear-gradient(90deg,#D4AF37,#F0C84A,transparent)"}}/>
              <motion.div className="absolute top-3 right-3 z-10 w-6 h-6 border border-white/20 rounded-full flex items-center justify-center" whileHover={{rotate:45}}>
                <Plus size={11} className="text-white/40 group-hover:text-[#D4AF37] transition-colors"/>
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
                <div className="text-[7px] tracking-[0.3em] uppercase mb-1" style={{color:"rgba(212,175,55,.55)"}}>{p.num} — {p.type}</div>
                <div className="font-black uppercase text-white leading-tight" style={{fontSize:i===0?"clamp(14px,2.5vw,16px)":"11px"}}>{p.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px]" style={{color:"rgba(154,154,154,.45)"}}>{p.loc}</span>
                  <span className="text-[7px]" style={{color:"rgba(212,175,55,.4)"}}>{p.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{opacity:0}} animate={isInView?{opacity:1}:{}} transition={{delay:0.8}} className="flex justify-center sm:justify-end mt-4 sm:mt-5">
          <button className="text-[8px] tracking-[0.18em] uppercase px-5 py-2.5 w-full sm:w-auto text-center transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            style={{border:"0.5px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.4)"}}>
            ZOBRAZIT VŠECHNY REALIZACE
          </button>
        </motion.div>
      </div>
    </section>
  );
}
