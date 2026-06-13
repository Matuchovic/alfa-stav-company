"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCounter } from "@/hooks/useScrollReveal";

const stats = [
  { target: 25, suffix: "+", label: "LET ZKUŠENOSTÍ" },
  { target: 500, suffix: "+", label: "DOKONČENÝCH PROJEKTŮ" },
  { target: 100, suffix: "%", label: "SPOKOJENÝCH KLIENTŮ" },
];

function StatItem({ stat, index, isInView }: { stat: typeof stats[0]; index: number; isInView: boolean }) {
  const numRef = useCounter(stat.target, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center py-12 px-8 group cursor-default overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 110%,rgba(212,175,55,0.07) 0%,transparent 70%)" }}
      />

      {/* Divider right */}
      {index < stats.length - 1 && (
        <div
          className="absolute right-0 top-[20%] h-[60%] w-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
      )}

      {/* Number */}
      <div
        className="font-black leading-none tracking-tighter mb-2"
        style={{
          fontSize: "clamp(44px,7vw,72px)",
          color: "#D4AF37",
          textShadow: "0 0 40px rgba(212,175,55,0.25)",
        }}
      >
        <span ref={numRef}>0</span>
        {stat.suffix}
      </div>

      <div className="text-[8px] tracking-[0.25em] text-[#9A9A9A] uppercase font-medium">
        {stat.label}
      </div>

      {/* Gold underline on hover */}
      <motion.div
        className="h-px mt-4 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        initial={{ width: 0 }}
        whileHover={{ width: "80%" }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

export default function Numbers() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#080808", borderTop: "0.5px solid rgba(255,255,255,0.06)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
    >
      {/* Background architectural lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(90deg,rgba(212,175,55,0.015) 0,rgba(212,175,55,0.015) 1px,transparent 1px,transparent 80px)",
        }}
      />

      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
