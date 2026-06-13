"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCounter } from "@/hooks/useScrollReveal";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRef = useCounter(25, 1800);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mx = 0, my = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number };
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.55 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = "rgba(212,175,55,0.025)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
        ctx.fill();

        // Mouse connection
        const dm = Math.hypot(p.x - mx, p.y - my);
        if (dm < 140) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(212,175,55,${0.1 * (1 - dm / 140)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });

      // Particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (glowRef.current) {
        glowRef.current.style.left = (mx - 200) + "px";
        glowRef.current.style.top = (my - 200) + "px";
      }
    };
    canvas.parentElement?.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      const roofEl = hero.querySelector<HTMLDivElement>(".hero-roof");
      if (roofEl) roofEl.style.transform = `translateY(${y * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

      {/* Roof shape */}
      <div
        className="hero-roof absolute right-0 top-0 w-[52%] h-full"
        style={{
          background: "linear-gradient(160deg,#2d1f08 0%,#1a1208 30%,#0a0805 70%,#050505 100%)",
          clipPath: "polygon(10% 0,100% 0,100% 100%,0 100%)",
          zIndex: 2,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(168deg,rgba(212,175,55,0.04) 0,rgba(212,175,55,0.04) 1px,transparent 1px,transparent 28px)",
          }}
        />
        {/* Roof highlight */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: "linear-gradient(160deg,rgba(212,175,55,0.06) 0%,transparent 40%)",
          }}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 z-[3]" style={{ background: "linear-gradient(90deg,rgba(5,5,5,0.97) 0%,rgba(5,5,5,0.75) 50%,rgba(5,5,5,0.1) 100%)" }} />
      <div className="absolute inset-0 z-[3]" style={{ background: "linear-gradient(0deg,rgba(5,5,5,0.8) 0%,transparent 50%)" }} />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%)",
          zIndex: 4,
          transition: "left 0.05s, top 0.05s",
          top: "30%", left: "10%",
        }}
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-[5] px-8 md:px-16 max-w-screen-xl mx-auto w-full pt-28"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
              ALFA STAV COMPANY
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              variants={itemVariants}
              className="font-black uppercase leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: "clamp(56px,10vw,110px)" }}
            >
              <span className="block text-white">STAVÍME</span>
              <span className="block gradient-gold">BUDOUCNOST</span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-[#9A9A9A] text-sm leading-relaxed mb-10 max-w-sm">
            Komplexní stavební realizace, střechy,<br />
            rekonstrukce a novostavby<br />
            v Mladé Boleslavi a širokém okolí.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.button
              className="group flex items-center gap-2.5 text-[#050505] text-[9px] tracking-[0.15em] uppercase font-black px-7 py-4 transition-all duration-200"
              style={{ background: "#D4AF37" }}
              whileHover={{ scale: 1.03, backgroundColor: "#F0C84A" }}
              whileTap={{ scale: 0.98 }}
            >
              ZÍSKAT NABÍDKU
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            <motion.button
              className="flex items-center gap-2 text-white text-[9px] tracking-[0.15em] uppercase font-semibold px-7 py-4 border border-white/20 transition-all duration-300 hover:border-white/50 hover:bg-white/4"
              whileTap={{ scale: 0.98 }}
            >
              NAŠE REALIZACE
            </motion.button>
          </motion.div>
        </div>

        {/* Stats block */}
        <motion.div
          variants={itemVariants}
          className="absolute right-8 md:right-16 bottom-24 text-right"
        >
          <div
            className="font-black leading-none tracking-tight"
            style={{
              fontSize: "clamp(48px,8vw,80px)",
              color: "#D4AF37",
              textShadow: "0 0 60px rgba(212,175,55,0.4)",
            }}
          >
            <span ref={counterRef}>0</span>+
          </div>
          <div className="text-[9px] tracking-[0.22em] text-[#9A9A9A] uppercase mt-1">
            LET ZKUŠENOSTÍ
          </div>
          <div className="text-[7px] tracking-[0.18em] text-[#9A9A9A]/40 uppercase mt-1">
            STAVÍME KVALITNĚ OD ROKU 1998
          </div>
          <div className="mt-3 h-px w-full bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-7 h-7 border border-white/15 rounded-full flex items-center justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={12} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
