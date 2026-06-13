"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Domů", "Služby", "Realizace", "O nás", "Reference", "Kontakt"];

/* ── Triangle Peak Logo Icon ── */
function LogoMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 56 56" overflow="visible" fill="none">
      <polygon
        points="28,4 52,50 4,50"
        stroke="#D4AF37"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="rgba(212,175,55,0.04)"
      />
      <polygon
        points="28,16 42,44 14,44"
        stroke="rgba(212,175,55,0.3)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="rgba(212,175,55,0.03)"
      />
      <line x1="14" y1="44" x2="42" y2="44" stroke="rgba(212,175,55,0.35)" strokeWidth="0.8"/>
      <line x1="19" y1="36" x2="37" y2="36" stroke="rgba(212,175,55,0.2)" strokeWidth="0.7"/>
      <circle
        cx="28" cy="4" r="6"
        fill="rgba(212,175,55,0.15)"
        style={{ filter: "blur(4px)" }}
      />
      <circle
        cx="28" cy="4" r="2.5"
        fill="#D4AF37"
        style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.9))" }}
      />
    </svg>
  );
}

/* ── Animated Logo ── */
function AnimatedLogo() {
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="relative flex-shrink-0"
      >
        <LogoMark />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
            filter: "blur(6px)",
            animation: "pulseBorder 4s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        {/* ALFA | STAV */}
        <div className="flex items-baseline gap-[5px] overflow-hidden">
          <motion.span
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            className="text-[15px] font-black tracking-[0.12em] text-white leading-none"
          >
            ALFA
          </motion.span>
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            className="inline-block w-px h-[11px] bg-[#D4AF37] origin-center mb-[1px]"
            style={{ boxShadow: "0 0 6px rgba(212,175,55,0.8)" }}
          />
          <motion.span
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="text-[15px] font-extralight tracking-[0.12em] text-[#D4AF37] leading-none"
            style={{ textShadow: "0 0 20px rgba(212,175,55,0.4)" }}
          >
            STAV
          </motion.span>
        </div>

        {/* GROUP + expanding line */}
        <div className="flex items-center gap-2 mt-[3px] overflow-hidden">
          <motion.span
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
            className="text-[15px] font-black tracking-[0.12em] text-white leading-none"
          >
            GROUP
          </motion.span>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.35 }}
            className="h-px origin-left"
            style={{
              background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)",
              minWidth: 28,
              flex: 1,
            }}
          />
        </div>

        {/* Tagline */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-[6.5px] tracking-[0.28em] text-[#9A9A9A]/45 uppercase mt-[4px] font-light"
        >
          Stavební realizace · Mladá Boleslav
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ── Header ── */
export default function Header() {
  const [active, setActive] = useState("Domů");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* Magnetic CTA */
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      if (Math.hypot(x, y) < 90) {
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      }
    };
    const onLeave = () => {
      el.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "";
    };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Always floating glass card — no scroll change */
  const glassStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(28px) saturate(200%)",
    WebkitBackdropFilter: "blur(28px) saturate(200%)",
    borderRadius: "16px",
    border: "0.5px solid rgba(255,255,255,0.1)",
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)",
    padding: "0 32px",
    height: "64px",
    width: "calc(100% - 64px)",
    maxWidth: "1280px",
    margin: "0 auto",
  };

  return (
    <>
      {/* Fixed outer strip — always 14px padding top */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center" style={{ padding: "14px 32px" }}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-between w-full"
          style={glassStyle}
        >
          {/* Logo */}
          {mounted && <AnimatedLogo />}

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.5 }}
                onClick={() => setActive(link)}
                className="relative text-[9px] tracking-[0.14em] uppercase font-medium transition-colors duration-200 group py-1"
                style={{ color: active === link ? "#D4AF37" : "rgba(255,255,255,0.5)" }}
              >
                {link}
                <motion.span
                  className="absolute -bottom-0.5 left-0 h-px bg-[#D4AF37]"
                  initial={false}
                  animate={{ width: active === link ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="absolute -bottom-0.5 left-0 h-px bg-[#D4AF37]/40 w-0 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="hidden lg:block"
          >
            <button
              ref={ctaRef}
              className="relative overflow-hidden group"
              style={{
                border: "0.5px solid rgba(212,175,55,0.5)",
                borderRadius: "4px",
                padding: "9px 20px",
                background: "rgba(212,175,55,0.06)",
              }}
            >
              <span
                className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                style={{ transformOrigin: "left" }}
              />
              <span
                className="relative z-10 text-[9px] tracking-[0.16em] uppercase font-bold group-hover:text-[#050505] transition-colors duration-300"
                style={{ color: "#D4AF37" }}
              >
                Poptat realizaci
              </span>
            </button>
          </motion.div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center gap-[5px] p-2 ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-white origin-center"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-px w-5 bg-white"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-white origin-center"
              transition={{ duration: 0.3 }}
            />
          </button>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 left-4 right-4 lg:hidden"
            style={{
              top: "92px",
              background: "rgba(8,6,2,0.94)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-left px-6 py-3.5 text-[10px] tracking-[0.16em] uppercase transition-colors duration-200"
                  style={{ color: active === link ? "#D4AF37" : "rgba(255,255,255,0.55)" }}
                  onClick={() => { setActive(link); setMobileOpen(false); }}
                >
                  {link}
                </motion.button>
              ))}
              <div className="px-6 pt-2 pb-4">
                <div className="h-px bg-white/5 mb-4" />
                <button
                  className="w-full py-3 text-[9px] tracking-[0.16em] uppercase font-bold text-[#050505] bg-[#D4AF37]"
                  style={{ borderRadius: "4px" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Poptat realizaci
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
