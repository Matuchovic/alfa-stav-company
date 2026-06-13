"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";

const navLinks = ["Domů", "Služby", "Realizace", "O nás", "Reference", "Kontakt"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Domů");
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Magnetic CTA effect
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const dist = Math.hypot(x, y);
      if (dist < 80) {
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      }
    };
    const onLeave = () => { el.style.transform = ""; };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid transparent",
      }}
    >
      <div className="flex items-center justify-between px-8 py-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center border border-[#D4AF37] transition-all duration-300"
            style={{ animation: "pulseBorder 3s infinite" }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#D4AF37">
              <path d="M10 2L2 8v10h5v-6h6v6h5V8z" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-black tracking-[0.1em] leading-tight text-white">
              ALFA
            </div>
            <div className="text-[7px] font-normal tracking-[0.2em] text-[#9A9A9A]">
              STAV COMPANY
            </div>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => setActive(link)}
              className="relative text-[9px] tracking-[0.14em] uppercase font-medium transition-colors duration-200 group"
              style={{ color: active === link ? "#D4AF37" : "#9A9A9A" }}
            >
              {link}
              <span
                className="absolute -bottom-0.5 left-0 h-px bg-[#D4AF37] transition-all duration-300"
                style={{ width: active === link ? "100%" : "0%" }}
              />
              <span className="absolute -bottom-0.5 left-0 h-px bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-300 opacity-60" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            ref={ctaRef}
            className="relative overflow-hidden border border-[#D4AF37] text-[#D4AF37] text-[9px] tracking-[0.14em] uppercase font-bold px-5 py-2.5 transition-all duration-300 group"
            style={{ transitionProperty: "transform, color" }}
          >
            <span
              className="absolute inset-0 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
              style={{ transformOrigin: "left" }}
            />
            <span className="relative z-10 group-hover:text-[#050505] transition-colors duration-300">
              Poptat realizaci
            </span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block h-px w-6 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
          <span className={`block h-px w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#050505] border-t border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="text-left px-8 py-3 text-[11px] tracking-[0.14em] uppercase text-[#9A9A9A] hover:text-[#D4AF37] transition-colors"
                  onClick={() => { setActive(link); setMobileOpen(false); }}
                >
                  {link}
                </motion.button>
              ))}
              <div className="px-8 pt-2">
                <button className="w-full border border-[#D4AF37] text-[#D4AF37] text-[9px] tracking-[0.14em] uppercase font-bold py-3 mt-2">
                  Poptat realizaci
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
