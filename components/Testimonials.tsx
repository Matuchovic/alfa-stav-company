"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Od první schůzky po dokončení naprosto profesionální přístup. Kvalita práce předčila naše očekávání. Pan Baran a jeho tým jsou jedničky.",
    author: "Jan Novák",
    location: "Mladá Boleslav",
    project: "Rekonstrukce rodinného domu",
  },
  {
    quote: "Střechu nám realizovali rychle, čistě a v přesně domluvené ceně. Žádná překvapení, žádné prodlení. Určitě doporučuji každému!",
    author: "Petra Horáčková",
    location: "Mladá Boleslav",
    project: "Nová střecha — sedlová",
  },
  {
    quote: "Novostavba splnila všechna naše přání. Tým ALFA STAV je spolehlivý a profesionální partner, se kterým je radost pracovat.",
    author: "Tomáš Krejčí",
    location: "Praha",
    project: "Novostavba rodinného domu",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => {
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <section
      className="bg-[#050505] py-24 px-8 md:px-16"
      id="testimonials"
      ref={ref}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.28em] text-[#D4AF37] uppercase">REFERENCE KLIENTŮ</span>
            <div className="w-5 h-px bg-[#D4AF37]" />
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden"
            style={{
              background: "#0E0E0E",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }}
            />

            {/* Quote mark bg */}
            <div
              className="absolute top-4 left-6 text-[100px] font-black leading-none select-none pointer-events-none"
              style={{ color: "rgba(212,175,55,0.04)", fontFamily: "serif" }}
            >
              "
            </div>

            <div className="p-10 md:p-14 text-center relative z-10">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-7">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="text-[#D4AF37] text-base"
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              {/* Quote */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={idx}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-sm text-[#D0D0D0] leading-loose italic mb-6">
                    "{testimonials[idx].quote}"
                  </p>
                  <div className="h-px w-12 mx-auto mb-5" style={{ background: "rgba(212,175,55,0.3)" }} />
                  <div className="text-[11px] font-black tracking-[0.1em] text-[#D4AF37]">
                    {testimonials[idx].author}
                  </div>
                  <div className="text-[9px] text-[#9A9A9A] tracking-wide mt-1">
                    {testimonials[idx].location}
                  </div>
                  <div className="text-[8px] text-[#9A9A9A]/50 tracking-wide mt-1">
                    {testimonials[idx].project}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => { setDir(-1); setIdx((i) => (i - 1 + testimonials.length) % testimonials.length); }}
                  className="w-8 h-8 border border-white/12 flex items-center justify-center text-[#9A9A9A] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200"
                  aria-label="Předchozí"
                >
                  <ChevronLeft size={13} />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all duration-300 rounded-sm"
                      style={{
                        width: i === idx ? 20 : 5,
                        height: 5,
                        background: i === idx ? "#D4AF37" : "rgba(255,255,255,0.15)",
                      }}
                      aria-label={`Přepnout na referenci ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => { setDir(1); setIdx((i) => (i + 1) % testimonials.length); }}
                  className="w-8 h-8 border border-white/12 flex items-center justify-center text-[#9A9A9A] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200"
                  aria-label="Další"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Bottom glow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.15),transparent)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
