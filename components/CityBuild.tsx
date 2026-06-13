"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Building {
  x: number; z: number; w: number; d: number;
  floors: number; delay: number; type: "hero" | "tower" | "block" | "small";
  totalH: number; progress: number;
  glowP: number; glowS: number;
  done: boolean;
  sparks: Spark[];
}

interface Spark {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; size: number; col: string;
}

const BLDG_DEFS = [
  { x:0,    z:0,   w:72, d:72, floors:14, delay:0,   type:"hero"  },
  { x:-190, z:40,  w:55, d:55, floors:9,  delay:0.6, type:"tower" },
  { x:190,  z:20,  w:60, d:60, floors:11, delay:0.4, type:"tower" },
  { x:-340, z:80,  w:45, d:45, floors:7,  delay:1.0, type:"block" },
  { x:340,  z:60,  w:48, d:48, floors:8,  delay:0.9, type:"block" },
  { x:-100, z:130, w:40, d:40, floors:6,  delay:1.4, type:"block" },
  { x:110,  z:110, w:42, d:42, floors:6,  delay:1.3, type:"block" },
  { x:-480, z:110, w:35, d:35, floors:5,  delay:1.8, type:"small" },
  { x:480,  z:90,  w:36, d:36, floors:5,  delay:1.7, type:"small" },
  { x:-250, z:160, w:30, d:30, floors:4,  delay:2.1, type:"small" },
  { x:260,  z:150, w:32, d:32, floors:4,  delay:2.0, type:"small" },
  { x:-50,  z:200, w:50, d:50, floors:8,  delay:1.6, type:"tower" },
  { x:600,  z:130, w:28, d:28, floors:3,  delay:2.4, type:"small" },
  { x:-600, z:150, w:26, d:26, floors:3,  delay:2.5, type:"small" },
] as const;

const PHASE_LABELS = [
  "Příprava základů…",
  "Betonáž podlaží…",
  "Ocelová konstrukce…",
  "Fasáda a střecha…",
  "Rozsviťme město!",
];

const BUILD_SPEED = 0.38;
const FOV = 420;

export default function CityBuild() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const restartRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;


    let W = 0, H = 0;
    let RAF = 0;
    let buildStart: number | null = null;
    let lastT = 0;
    let camAngle = -0.3;
    let camTargetAngle = -0.3;
    let camY = -80;

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* ── projection ── */
    function project(x: number, y: number, z: number) {
      const cos = Math.cos(camAngle), sin = Math.sin(camAngle);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const ry = y - camY;
      const depth = FOV + rz + 350;
      if (depth < 1) return null;
      const s = FOV / depth;
      return { sx: W / 2 + rx * s, sy: H * 0.78 + ry * s, s, z: rz };
    }

    /* ── state ── */
    const state: Building[] = BLDG_DEFS.map(b => ({
      ...b,
      totalH: b.floors * 28,
      progress: 0,
      glowP: Math.random() * Math.PI * 2,
      glowS: 0.4 + Math.random() * 0.6,
      done: false,
      sparks: [],
    }));

    /* ── sparks ── */
    function addSparks(b: Building, wx: number, wy: number, wz: number, n: number) {
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        b.sparks.push({
          x: wx + (Math.random() - 0.5) * 30,
          y: wy, z: wz + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed * 0.6,
          vy: -(Math.random() * 2.5 + 0.5),
          vz: Math.sin(angle) * speed * 0.6,
          life: 1,
          size: Math.random() * 1.8 + 0.4,
          col: Math.random() > 0.4 ? "#D4AF37" : "#F0C84A",
        });
      }
    }

    function updateSparks(b: Building) {
      b.sparks = b.sparks.filter(s => s.life > 0);
      b.sparks.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.z += s.vz;
        s.vy += 0.08; s.life -= 0.032;
      });
    }

    function drawSparks(b: Building) {
      b.sparks.forEach(s => {
        const p = project(s.x, s.y, s.z);
        if (!p || p.z > 600) return;
        const a = s.life * Math.min(1, (600 - p.z) / 200);
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = s.life * 8;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, s.size * p.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
    }

    /* ── draw building ── */
    function drawBuilding(b: Building, t: number) {
      if (b.progress <= 0) return;
      const builtH = b.totalH * b.progress;
      const glow = 0.5 + 0.5 * Math.sin(t * b.glowS + b.glowP);
      const alpha = 0.6 + glow * 0.35;
      const hw = b.w / 2, hd = b.d / 2;
      const { x, z } = b;
      const floorsBuilt = Math.floor(b.progress * b.floors);
      const floorH = b.totalH / b.floors;

      /* vertical pillars */
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = b.type === "hero" ? 1.4 : 1.0;
      ([[x - hw, z - hd], [x + hw, z - hd], [x + hw, z + hd], [x - hw, z + hd]] as [number, number][]).forEach(([px, pz]) => {
        const bot = project(px, 0, pz);
        const top = project(px, -builtH, pz);
        if (!bot || !top) return;
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath(); ctx.moveTo(bot.sx, bot.sy); ctx.lineTo(top.sx, top.sy); ctx.stroke();
      });

      /* floor rings */
      ctx.lineWidth = 0.7;
      for (let f = 0; f <= floorsBuilt; f++) {
        const fy = -(f * floorH);
        const fa = f === 0 || f === floorsBuilt ? alpha * 0.85 : alpha * 0.22;
        ctx.strokeStyle = f === floorsBuilt && b.progress < 1 ? "#F0C84A" : "#D4AF37";
        ctx.globalAlpha = fa;
        const pts = ([[x - hw, fy, z - hd], [x + hw, fy, z - hd], [x + hw, fy, z + hd], [x - hw, fy, z + hd]] as [number, number, number][])
          .map(([cx, cy, cz]) => project(cx, cy, cz)).filter(Boolean) as { sx: number; sy: number; s: number; z: number }[];
        if (pts.length < 4) continue;
        ctx.beginPath(); ctx.moveTo(pts[0].sx, pts[0].sy);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
        ctx.closePath(); ctx.stroke();
      }

      /* diagonal cross pattern */
      if (b.type === "tower" || b.type === "hero") {
        ctx.strokeStyle = "rgba(212,175,55,0.18)";
        ctx.lineWidth = 0.5;
        for (let f = 0; f < floorsBuilt; f++) {
          if (f % 2 !== 0) continue;
          const y1 = -(f * floorH), y2 = -((f + 1) * floorH);
          const a1 = project(x - hw, y1, z - hd), a2 = project(x + hw, y2, z - hd);
          const a3 = project(x + hw, y1, z - hd), a4 = project(x - hw, y2, z - hd);
          ctx.globalAlpha = 0.18;
          if (a1 && a2) { ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.stroke(); }
          if (a3 && a4) { ctx.beginPath(); ctx.moveTo(a3.sx, a3.sy); ctx.lineTo(a4.sx, a4.sy); ctx.stroke(); }
        }
      }

      /* active construction edge glow */
      if (b.progress < 1) {
        const topY = -(floorsBuilt * floorH);
        ctx.strokeStyle = "#F0C84A";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 8 + b.glowP);
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = 10;
        const pts = ([[x - hw, topY, z - hd], [x + hw, topY, z - hd], [x + hw, topY, z + hd], [x - hw, topY, z + hd]] as [number, number, number][])
          .map(([cx, cy, cz]) => project(cx, cy, cz)).filter(Boolean) as { sx: number; sy: number; s: number; z: number }[];
        if (pts.length === 4) {
          ctx.beginPath(); ctx.moveTo(pts[0].sx, pts[0].sy);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
          ctx.closePath(); ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      /* rooftop glow when done */
      if (b.progress >= 1) {
        const top = project(x, -b.totalH, z);
        if (top && top.z < 600) {
          const ga = glow * 0.8 * Math.min(1, (600 - top.z) / 300);
          ctx.globalAlpha = ga;
          const rg = ctx.createRadialGradient(top.sx, top.sy, 0, top.sx, top.sy, 10 * top.s);
          rg.addColorStop(0, "#D4AF37"); rg.addColorStop(1, "transparent");
          ctx.fillStyle = rg;
          ctx.beginPath(); ctx.arc(top.sx, top.sy, 10 * top.s, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      drawSparks(b);
    }

    /* ── ground grid ── */
    function drawGround(t: number) {
      ctx.lineWidth = 0.4;
      const size = 70, range = 10;
      for (let i = -range; i <= range; i++) {
        const pulse = 0.06 + 0.03 * Math.sin(t * 0.6 + i * 0.4);
        ctx.strokeStyle = "rgba(212,175,55,0.15)";
        ctx.globalAlpha = pulse;
        const a1 = project(i * size, 0, -range * size), a2 = project(i * size, 0, range * size);
        const b1 = project(-range * size, 0, i * size), b2 = project(range * size, 0, i * size);
        if (a1 && a2) { ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.stroke(); }
        if (b1 && b2) { ctx.beginPath(); ctx.moveTo(b1.sx, b1.sy); ctx.lineTo(b2.sx, b2.sy); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }

    /* ── float particles ── */
    const floatParts = Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 1000,
      y: -Math.random() * 600,
      z: (Math.random() - 0.5) * 600,
      vy: -(Math.random() * 0.25 + 0.05),
      a: Math.random() * 0.4 + 0.1,
      r: Math.random() * 1.2 + 0.2,
    }));

    function drawParticles(t: number) {
      floatParts.forEach(p => {
        p.y += p.vy;
        if (p.y < -620) p.y = 20;
        const pr = project(p.x, p.y, p.z);
        if (!pr || pr.z > 700) return;
        const a = p.a * (0.5 + 0.5 * Math.sin(t + p.x * 0.01)) * Math.min(1, (700 - pr.z) / 300);
        ctx.globalAlpha = a;
        ctx.fillStyle = "#D4AF37";
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = 3;
        ctx.beginPath(); ctx.arc(pr.sx, pr.sy, p.r * pr.s, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
    }

    /* ── update building ── */
    function updateBuilding(b: Building, elapsed: number) {
      if (b.done) return;
      const t = elapsed - b.delay;
      if (t <= 0) return;
      const prevFloor = Math.floor(b.progress * b.floors);
      b.progress = Math.min(1, (t * BUILD_SPEED) / b.floors);
      const curFloor = Math.floor(b.progress * b.floors);
      if (curFloor > prevFloor && curFloor > 0) {
        const fy = -(curFloor * b.totalH / b.floors);
        addSparks(b, b.x, fy, b.z, 22);
        addSparks(b, b.x + b.w / 2, fy, b.z, 10);
        addSparks(b, b.x - b.w / 2, fy, b.z, 10);
      }
      if (b.progress >= 1) b.done = true;
      updateSparks(b);
    }

    /* ── main loop ── */
    function loop(now: number) {
      RAF = requestAnimationFrame(loop);
      const t = now / 1000;
      const dt = t - lastT; lastT = t;
      if (!buildStart) buildStart = t;
      const elapsed = t - buildStart;

      camTargetAngle = -0.3 + Math.sin(elapsed * 0.06) * 0.35 + elapsed * 0.006;
      camAngle += (camTargetAngle - camAngle) * 0.02;
      camY = -80 + Math.sin(elapsed * 0.1) * 10;

      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W / 2, H * 0.6, 0, W / 2, H * 0.6, W * 0.65);
      bg.addColorStop(0, "rgba(212,175,55,0.06)");
      bg.addColorStop(0.5, "rgba(140,90,10,0.03)");
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      drawGround(t);
      state.forEach(b => updateBuilding(b, elapsed));
      [...state].sort((a, b) => {
        const az = project(a.x, 0, a.z)?.z ?? 0;
        const bz = project(b.x, 0, b.z)?.z ?? 0;
        return bz - az;
      }).forEach(b => drawBuilding(b, t));
      drawParticles(t);

      /* update progress UI */
      const prog = state.reduce((s, b) => s + b.progress, 0) / state.length;
      if (progressRef.current) progressRef.current.style.width = (prog * 100) + "%";
      if (labelRef.current) {
        const li = Math.min(Math.floor(prog * PHASE_LABELS.length), PHASE_LABELS.length - 1);
        labelRef.current.textContent = PHASE_LABELS[li];
      }
    }
    RAF = requestAnimationFrame(loop);

    /* restart fn */
    restartRef.current = () => {
      cancelAnimationFrame(RAF);
      buildStart = null; lastT = 0;
      state.forEach(b => { b.progress = 0; b.done = false; b.sparks = []; });
      RAF = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(RAF);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#020202", height: "520px" }}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top fade — blend from hero */}
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(180deg,#050505 0%,transparent 100%)" }} />

      {/* Vignette bottom */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%,transparent 30%,rgba(2,2,2,0.6) 70%,#020202 100%)" }} />

      {/* UI overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-8 md:px-16 py-8">
        {/* Left — label + progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-px bg-[#D4AF37]" />
            <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
              ALFA STAV GROUP — Živá vizualizace
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden" style={{ width: 120, height: 1, background: "rgba(255,255,255,0.07)" }}>
              <div ref={progressRef} className="absolute left-0 top-0 h-full"
                style={{ width: "0%", background: "#D4AF37", boxShadow: "0 0 6px rgba(212,175,55,0.8)", transition: "none" }} />
            </div>
            <span ref={labelRef} className="text-[8px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(212,175,55,0.5)" }}>
              Příprava základů…
            </span>
          </div>
        </motion.div>

        {/* Right — restart */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => restartRef.current()}
          className="text-[8px] tracking-[0.14em] uppercase px-4 py-2 transition-all duration-200"
          style={{
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "rgba(154,154,154,0.4)",
            background: "transparent",
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = "#D4AF37"; (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.4)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(154,154,154,0.4)"; (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ↺ Znovu postavit
        </motion.button>
      </div>
    </section>
  );
}
