"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Home, RefreshCw, Building2, Grid3x3 } from "lucide-react";

const services = [
  {
    icon: Home,
    name: "STŘECHY",
    desc: "Realizace nových střech a kompletní rekonstrukce. Pracujeme s prémiálními materiály a zaručujeme precizní provedení.",
    bg: "linear-gradient(145deg,#2d1f08 0%,#1a1208 50%,#080808 100%)",
    lines: "168deg",
  },
  {
    icon: RefreshCw,
    name: "REKONSTRUKCE",
    desc: "Rekonstrukce bytů, domů a komerčních objektů. Od projektu po klíče v ruce.",
    bg: "linear-gradient(145deg,#141c1e 0%,#0e1214 50%,#080808 100%)",
    lines: "160deg",
  },
  {
    icon: Building2,
    name: "NOVOSTAVBY",
    desc: "Výstavba rodinných domů od základů po předání. Plánování, realizace i dozor v jednom.",
    bg: "linear-gradient(145deg,#0c1420 0%,#0a1018 50%,#080808 100%)",
    lines: "172deg",
  },
  {
    icon: Grid3x3,
    name: "FASÁDY",
    desc: "Moderní fasádní systémy a zateplovací řešení. Estetika i energetická úspornost.",
    bg: "linear-gradient(145deg,#1c1c18 0%,#121210 50%,#080808 100%)",
    lines: "165deg",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#050505] py-24 px-8 md:px-16" id="services">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
          ref={ref}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.28em] text-[#D4AF37] uppercase">CO DĚLÁME</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            NAŠE SLUŽBY
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.06)]">
          {services.map((srv, i) => (
            <ServiceCard key={srv.name} srv={srv} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ srv, index, isInView }: { srv: (typeof services)[0]; index: number; isInView: boolean }) {
  const Icon = srv.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      className="group relative bg-[#080808] overflow-hidden cursor-pointer"
      whileHover={{ y: -4, zIndex: 10 }}
    >
      {/* Gold top line */}
      <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-10"
        style={{ background: "linear-gradient(90deg,#D4AF37,#F0C84A)" }}
      />

      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <motion.div
          className="w-full h-full"
          style={{ background: srv.bg }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `repeating-linear-gradient(${srv.lines},rgba(212,175,55,0.04) 0,rgba(212,175,55,0.04) 1px,transparent 1px,transparent 22px)` }}
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,#080808 0%,rgba(8,8,8,0.1) 100%)" }} />
      </div>

      {/* Body */}
      <div className="p-6">
        <motion.div
          className="w-10 h-10 border border-[rgba(212,175,55,0.25)] flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[rgba(212,175,55,0.07)]"
          whileHover={{ rotate: 5 }}
        >
          <Icon size={17} className="text-[#D4AF37]" strokeWidth={1.5} />
        </motion.div>

        <h3 className="text-[13px] font-black tracking-[0.07em] uppercase text-white mb-3">
          {srv.name}
        </h3>
        <p className="text-[10px] text-[#9A9A9A] leading-relaxed mb-5">{srv.desc}</p>

        <div className="flex items-center gap-2 text-[9px] tracking-[0.16em] text-[#D4AF37]/70 uppercase font-semibold group-hover:text-[#F0C84A] transition-colors duration-200">
          VÍCE INFORMACÍ
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
          >→</motion.span>
        </div>
      </div>

      {/* Corner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 100%,rgba(212,175,55,0.04) 0%,transparent 60%)" }}
      />
    </motion.div>
  );
}
