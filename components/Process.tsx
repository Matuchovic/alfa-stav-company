"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, FileText, Clock, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Users,
    num: "01",
    name: "KONZULTACE",
    desc: "Probereme vaše představy a požadavky. Žádné závazky, pouze otevřený rozhovor.",
  },
  {
    icon: FileText,
    num: "02",
    name: "NÁVRH ŘEŠENÍ",
    desc: "Připravíme návrh řešení a cenovou nabídku přesně na míru vašemu projektu.",
  },
  {
    icon: Clock,
    num: "03",
    name: "REALIZACE",
    desc: "Kvalitně a včas zrealizujeme domluvený projekt s průběžnou komunikací.",
  },
  {
    icon: CheckCircle,
    num: "04",
    name: "PŘEDÁNÍ DÍLA",
    desc: "Předáme dílo, provedeme prohlídku a jsme tu pro vás i pro případný servis.",
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16" style={{ background: "transparent" }} id="process" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.28em] text-[#D4AF37] uppercase">JAK PROBÍHÁ SPOLUPRÁCE</span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">NAŠE PROJEKTY VZNIKAJÍ<br />
            <span className="gradient-gold">VE ČTYŘECH KROCÍCH</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <motion.div
            className="absolute hidden md:block"
            style={{
              top: 40,
              left: "12.5%",
              right: "12.5%",
              height: "0.5px",
              background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.25) 15%,rgba(212,175,55,0.4) 50%,rgba(212,175,55,0.25) 85%,transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-center md:text-center group"
                >
                  {/* Arrow between steps */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute right-[-18px] top-9 z-10 text-[#D4AF37]/30 text-lg">
                      →
                    </div>
                  )}

                  {/* Circle */}
                  <motion.div
                    className="w-[72px] h-[72px] border border-[rgba(212,175,55,0.3)] rounded-full flex items-center justify-center mx-auto mb-5 relative cursor-pointer"
                    style={{ background: "rgba(5,5,5,0.5)" }}
                    whileHover={{
                      borderColor: "#D4AF37",
                      backgroundColor: "rgba(212,175,55,0.06)",
                      boxShadow: "0 0 24px rgba(212,175,55,0.18)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={26} className="text-[#D4AF37]" strokeWidth={1.4} />

                    {/* Orbit ring */}
                    <motion.div
                      className="absolute inset-[-4px] rounded-full border border-[rgba(212,175,55,0.12)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>

                  <div className="text-[8px] font-black tracking-[0.22em] text-[#D4AF37] mb-2">
                    {step.num}
                  </div>
                  <div className="text-[11px] font-black tracking-[0.08em] uppercase text-white mb-3">
                    {step.name}
                  </div>
                  <p className="text-[10px] text-[#9A9A9A] leading-relaxed max-w-[160px] mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
