"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const projects = [
  { title: "Rodinný dům", location: "Mladá Boleslav", year: "2023", bg: "linear-gradient(140deg,#182010,#0e1208,#060806)" },
  { title: "Moderní střecha", location: "Praha", year: "2023", bg: "linear-gradient(140deg,#201810,#120e08,#080606)" },
  { title: "Rekonstrukce vily", location: "Mladá Boleslav", year: "2022", bg: "linear-gradient(140deg,#101828,#080e18,#060810)" },
  { title: "Bytová jednotka", location: "Mladá Boleslav", year: "2022", bg: "linear-gradient(140deg,#1a1810,#100e08,#080608)" },
  { title: "Komerční objekt", location: "Mladá Boleslav", year: "2023", bg: "linear-gradient(140deg,#182020,#0e1414,#060c0c)" },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-[#050505] py-24 px-8 md:px-16" id="projects" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#D4AF37]" />
              <span className="text-[9px] tracking-[0.28em] text-[#D4AF37] uppercase">VYBRANÉ REALIZACE</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white">NAŠE PROJEKTY</h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border border-white/12 text-white/60 text-[8px] tracking-[0.16em] uppercase px-5 py-3 transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            ZOBRAZIT VŠECHNY REALIZACE
          </motion.button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-[#0E0E0E] overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="h-32 md:h-36 overflow-hidden relative">
                <motion.div
                  className="w-full h-full"
                  style={{ background: p.bg }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Architectural pattern */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "repeating-linear-gradient(170deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 16px)" }}
                  />
                </motion.div>

                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-400"
                  style={{ background: "linear-gradient(0deg,rgba(5,5,5,0.9) 0%,rgba(5,5,5,0.3) 60%,transparent 100%)" }}
                />

                {/* Gold overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(0deg,rgba(212,175,55,0.08) 0%,transparent 60%)" }}
                />

                {/* Plus icon */}
                <motion.div
                  className="absolute top-2.5 right-2.5 w-6 h-6 border border-white/20 flex items-center justify-center z-10 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[rgba(212,175,55,0.1)]"
                  whileHover={{ rotate: 45 }}
                >
                  <Plus size={11} className="text-white/50 group-hover:text-[#D4AF37] transition-colors" />
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="text-[10px] font-bold text-white mb-1 tracking-wide">
                  {p.title}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-[#9A9A9A] tracking-wide">{p.location}</span>
                  <span className="text-[8px] text-[#D4AF37]/50 tracking-wide">{p.year}</span>
                </div>
              </div>

              {/* Bottom gold line */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: "linear-gradient(90deg,#D4AF37,#F0C84A)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
