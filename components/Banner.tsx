"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const tags = ["INDIVIDUÁLNÍ PŘÍSTUP", "PRECIZNÍ PROVEDENÍ", "MODERNÍ TECHNOLOGIE", "SPOLEHLIVÝ PARTNER"];

export default function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32"
      style={{
        borderTop: "0.5px solid rgba(212,175,55,0.1)",
        borderBottom: "0.5px solid rgba(212,175,55,0.1)",
      }}
    >
      {/* ── Parallax photo ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/banner1.png"
          alt="Dělníci na střeše při západu slunce — ALFA STAV GROUP"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transform: "scale(1.1)", transformOrigin: "center" }}
        />

        {/* Black fade — silný tmavý overlay pro čitelnost textu */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg,rgba(5,5,5,1) 0%,rgba(5,5,5,0.82) 30%,rgba(5,5,5,0.65) 55%,rgba(5,5,5,0.55) 100%)",
          }}
        />

        {/* Zlatý tónový overlay — zesiluje sunset atmosféru */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg,rgba(0,0,0,0.3) 0%,transparent 40%,rgba(212,100,10,0.08) 100%)",
          }}
        />

        {/* Vignette edges */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(5,5,5,0.6) 100%)",
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-screen-xl mx-auto">

        {/* Line 1 */}
        <div className="overflow-hidden mb-1">
          <motion.h2
            className="font-black uppercase tracking-wide text-white"
            style={{ fontSize: "clamp(28px,5vw,58px)", textShadow: "0 2px 40px rgba(0,0,0,0.8)" }}
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            STAVÍME KVALITNĚ.
          </motion.h2>
        </div>

        {/* Line 2 — gold */}
        <div className="overflow-hidden">
          <motion.h2
            className="font-black uppercase tracking-wide gradient-gold"
            style={{
              fontSize: "clamp(28px,5vw,58px)",
              textShadow: "0 0 80px rgba(212,175,55,0.5), 0 2px 40px rgba(0,0,0,0.8)",
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            STAVÍME NA GENERACE.
          </motion.h2>
        </div>

        {/* Gold divider */}
        <motion.div
          className="mx-auto my-8"
          style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)",
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "60px" } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Tags */}
        <motion.div
          className="flex flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {tags.map((tag, i) => (
            <div key={tag} className="flex items-center">
              <span
                className="text-[8px] tracking-[0.22em] uppercase px-5 py-2"
                style={{ color: "rgba(220,220,220,0.55)" }}
              >
                {tag}
              </span>
              {i < tags.length - 1 && (
                <div className="h-3 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
