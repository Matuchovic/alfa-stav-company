"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, MapPin, Mail, Globe, ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} className="flex flex-col md:flex-row" style={{borderTop:"0.5px solid rgba(255,255,255,0.06)",background:"rgba(5,5,5,0.75)"}} id="contact">
      {/* Left */}
      <motion.div initial={{opacity:0,y:30}} animate={isInView?{opacity:1,y:0}:{}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
        className="flex-1 p-8 sm:p-10 md:p-16 flex flex-col justify-center">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border border-[rgba(212,175,55,0.35)] rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{animation:"pulseBorder 3s infinite"}}>
            <Phone size={20} className="text-[#D4AF37]" strokeWidth={1.5}/>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-4 h-px bg-[#D4AF37]"/>
              <span className="text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase">KONTAKT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2 sm:mb-3">PŘIPRAVENI ZAČÍT?</h2>
            <p className="text-[12px] leading-relaxed max-w-xs" style={{color:"rgba(154,154,154,0.6)"}}>Nezávazně nám popište váš projekt a my se vám ozveme zpět do 24 hodin.</p>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="hidden md:block w-px" style={{background:"rgba(255,255,255,0.06)"}}/>
      <div className="md:hidden h-px mx-8" style={{background:"rgba(255,255,255,0.06)"}}/>

      {/* Right */}
      <motion.div initial={{opacity:0,y:30}} animate={isInView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay:0.15,ease:[0.16,1,0.3,1]}}
        className="w-full md:w-[380px] p-8 sm:p-10 md:p-14 flex flex-col justify-center" style={{background:"rgba(5,5,5,0.6)"}}>
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#D4AF37"><path d="M10 2L2 8v10h5v-6h6v6h5V8z"/></svg>
          </div>
          <div><div className="text-[12px] font-black tracking-[0.1em]">ALFA</div><div className="text-[7px] font-normal tracking-[0.2em] text-[#9A9A9A]">STAV GROUP</div></div>
        </div>
        <div className="mb-4 pb-4" style={{borderBottom:"0.5px solid rgba(255,255,255,0.06)"}}>
          <div className="text-[8px] tracking-[0.2em] text-[#D4AF37] uppercase mb-1">Jednatel</div>
          <div className="text-[13px] font-bold text-white">Jan Baran</div>
        </div>
        <div className="flex flex-col gap-3 mb-6 sm:mb-7">
          {[{Icon:MapPin,text:"Mladá Boleslav a okolí"},{Icon:Phone,text:"+420 123 456 789"},{Icon:Mail,text:"info@alfastav.cz"},{Icon:Globe,text:"www.alfastav.cz"}].map(({Icon,text})=>(
            <div key={text} className="flex items-center gap-3">
              <Icon size={13} className="text-[#D4AF37] flex-shrink-0" strokeWidth={1.5}/>
              <span className="text-[10px] sm:text-[10px]" style={{color:"rgba(154,154,154,0.7)"}}>{text}</span>
            </div>
          ))}
        </div>
        <motion.button className="group flex items-center justify-center gap-2.5 text-[#050505] text-[9px] tracking-[0.15em] uppercase font-black py-4 px-6 w-full"
          style={{background:"#D4AF37"}} whileHover={{scale:1.02,backgroundColor:"#F0C84A"}} whileTap={{scale:0.98}}>
          ZÍSKAT NEZÁVAZNOU NABÍDKU
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200"/>
        </motion.button>
      </motion.div>
    </section>
  );
}
