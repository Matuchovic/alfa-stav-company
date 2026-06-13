"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const tags = ["INDIVIDUÁLNÍ PŘÍSTUP", "PRECIZNÍ PROVEDENÍ", "MODERNÍ TECHNOLOGIE", "SPOLEHLIVÝ PARTNER"];

export default function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{ borderTop: "0.5px solid rgba(212,175,55,0.1)", borderBottom: "0.5px solid rgba(212,175,55,0.1)" }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, background: "linear-gradient(160deg,#1a1005 0%,#0c0a04 40%,#050505 100%)" }}
      />

      {/* Architectural line grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(90deg,rgba(212,175,55,0.018) 0,rgba(212,175,55,0.018) 1px,transparent 1px,transparent 55px)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg,rgba(212,175,55,0.012) 0,rgba(212,175,55,0.012) 1px,transparent 1px,transparent 55px)" }}
      />

      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 600, height: 400, background: "radial-gradient(ellipse,rgba(212,175,55,0.06) 0%,transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-8 max-w-screen-xl mx-auto">
        {/* Main text */}
        <div className="overflow-hidden mb-2">
          <motion.h2
            className="font-black uppercase tracking-wide text-white"
            style={{ fontSize: "clamp(28px,5vw,56px)" }}
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            STAVÍME KVALITNĚ.
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            className="font-black uppercase tracking-wide gradient-gold"
            style={{
              fontSize: "clamp(28px,5vw,56px)",
              textShadow: "0 0 80px rgba(212,175,55,0.35)",
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            STAVÍME NA GENERACE.
          </motion.h2>
        </div>

        {/* Divider */}
        <motion.div
          className="mx-auto my-8"
          style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)" }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "60px" } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Tags */}
        <motion.div
          className="flex flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {tags.map((tag, i) => (
            <div key={tag} className="flex items-center">
              <span className="text-[8px] tracking-[0.22em] text-[#9A9A9A]/60 uppercase px-5 py-2">
                {tag}
              </span>
              {i < tags.length - 1 && (
                <div className="h-3 w-px bg-white/08" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
