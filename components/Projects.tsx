"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const projects = [
  { num: "01", type: "NOVOSTAVBA",    name: "Rodinný dům Na Vinici", loc: "Mladá Boleslav", year: "2023", bg: "linear-gradient(145deg,#1a2010 0%,#0e1208 100%)" },
  { num: "02", type: "STŘECHA",       name: "Moderní střecha",        loc: "Praha",          year: "2023", bg: "linear-gradient(145deg,#201810 0%,#120e08 100%)" },
  { num: "03", type: "REKONSTRUKCE",  name: "Vila Háje",              loc: "Mladá Boleslav", year: "2022", bg: "linear-gradient(145deg,#101828 0%,#080e18 100%)" },
  { num: "04", type: "FASÁDA",        name: "Bytový komplex",         loc: "Mladá Boleslav", year: "2022", bg: "linear-gradient(145deg,#1a1810 0%,#100e08 100%)" },
  { num: "05", type: "KOMERČNÍ",      name: "Office Park",            loc: "Mladá Boleslav", year: "2023", bg: "linear-gradient(145deg,#182020 0%,#0e1414 100%)" },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-8 md:px-16" id="projects" style={{background:"transparent"}}>
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-[#D4AF37]" />
              <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,.65)" }}>
                VYBRANÉ REALIZACE
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              NAŠE PROJEKTY
            </h2>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase hidden md:block" style={{ color: "rgba(212,175,55,.3)" }}>
            05 realizací
          </span>
        </motion.div>

        {/* Masonry grid */}
        <div
          className="grid gap-[5px]"
          style={{ gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "190px 190px" }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden cursor-pointer bg-[#0E0E0E] ${i === 0 ? "row-span-2" : ""}`}
            >
              {/* Background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: p.bg }}
              >
                {/* Architectural line pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "repeating-linear-gradient(168deg,rgba(212,175,55,0.03) 0,rgba(212,175,55,0.03) 1px,transparent 1px,transparent 24px)",
                  }}
                />
              </div>

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(0deg,rgba(5,5,5,.92) 0%,rgba(5,5,5,.2) 50%,transparent 80%)",
                }}
              />

              {/* Gold overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(0deg,rgba(212,175,55,.07) 0%,transparent 60%)" }}
              />

              {/* Gold bottom rule */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-10"
                style={{ background: "linear-gradient(90deg,#D4AF37,#F0C84A,transparent)" }}
              />

              {/* Plus icon */}
              <motion.div
                className="absolute top-3 right-3 z-10 w-6 h-6 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[rgba(212,175,55,.1)]"
                whileHover={{ rotate: 45 }}
              >
                <Plus size={11} className="text-white/40 group-hover:text-[#D4AF37] transition-colors" />
              </motion.div>

              {/* Meta */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 translate-y-0.5 group-hover:translate-y-0 transition-transform duration-300">
                <div
                  className="text-[7px] tracking-[0.3em] uppercase mb-1.5"
                  style={{ color: "rgba(212,175,55,.55)" }}
                >
                  {p.num} — {p.type}
                </div>
                <div
                  className="font-black uppercase text-white leading-tight tracking-wide"
                  style={{ fontSize: i === 0 ? "16px" : "11px" }}
                >
                  {p.name}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[8px] tracking-wide" style={{ color: "rgba(154,154,154,.45)" }}>
                    {p.loc}
                  </span>
                  <span className="text-[7px] tracking-wide" style={{ color: "rgba(212,175,55,.4)" }}>
                    {p.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="flex justify-end mt-5"
        >
          <button
            className="text-[8px] tracking-[0.18em] uppercase px-5 py-2.5 transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            style={{ border: "0.5px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)" }}
          >
            ZOBRAZIT VŠECHNY REALIZACE
          </button>
        </motion.div>
      </div>
    </section>
  );
}
