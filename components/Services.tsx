"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── shared spark type ── */
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; size: number; col: string;
}

function addSparks(pool: Spark[], x: number, y: number, n = 8) {
  for (let i = 0; i < n; i++) {
    pool.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: -(Math.random() * 3 + 1),
      life: 1,
      size: Math.random() * 1.8 + 0.4,
      col: Math.random() > 0.4 ? "#D4AF37" : "#F0C84A",
    });
  }
}

function tickSparks(pool: Spark[]) {
  for (let i = pool.length - 1; i >= 0; i--) {
    const s = pool[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= 0.04;
    if (s.life <= 0) pool.splice(i, 1);
  }
}

function drawSparks(ctx: CanvasRenderingContext2D, pool: Spark[]) {
  pool.forEach(s => {
    ctx.globalAlpha = s.life;
    ctx.fillStyle = s.col;
    ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = s.life * 8;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

/* ══ CARD 0 — STŘECHY: rain + lightning ══ */
function useRoofCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let hovered = false;
    let raf = 0;
    let ltT = 0, ltPath: [number, number][] | null = null;
    const sparks: Spark[] = [];

    const resize = () => { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; ctx.scale(2, 2); };
    resize();

    const rain = Array.from({ length: 60 }, () => ({
      x: Math.random() * 160, y: Math.random() * 170,
      vy: Math.random() * 4 + 3, len: Math.random() * 8 + 4,
      a: Math.random() * 0.4 + 0.1,
    }));

    function makeLightning(cx: number, top: number, bot: number): [number, number][] {
      const pts: [number, number][] = [[cx, top]];
      let y = top;
      while (y < bot) {
        y += Math.random() * 12 + 4;
        pts.push([pts[pts.length - 1][0] + (Math.random() - 0.5) * 20, y]);
      }
      pts.push([cx, bot]); return pts;
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      const w = 160, h = 170, cx = 80, cy = 85;
      ctx.clearRect(0, 0, w, h);

      // rain
      rain.forEach(r => {
        r.y += r.vy * (hovered ? 2 : 1);
        if (r.y > h + 10) { r.y = -10; r.x = Math.random() * w; }
        ctx.globalAlpha = r.a * (hovered ? 1 : 0.35);
        ctx.strokeStyle = "rgba(212,175,55,0.6)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - 1, r.y + r.len); ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // ambient
      const g = ctx.createRadialGradient(cx, cy - 10, 0, cx, cy, hovered ? 90 : 60);
      g.addColorStop(0, `rgba(212,175,55,${hovered ? 0.09 : 0.03})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      // roof
      ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = hovered ? 2 : 1.5;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 16 : 8;
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.moveTo(cx, cy - 50); ctx.lineTo(cx - 65, cy + 32); ctx.lineTo(cx + 65, cy + 32); ctx.closePath(); ctx.stroke();

      // lamely
      ctx.lineWidth = 0.7; ctx.shadowBlur = 4;
      for (let i = 1; i < 7; i++) {
        const fy = cy - 50 + 82 * (i / 7), xo = 65 * (i / 7);
        ctx.globalAlpha = (hovered ? 0.55 : 0.18) * (Math.sin(t * 1.2 + i * 0.5) * 0.4 + 0.6);
        ctx.strokeStyle = "rgba(212,175,55,0.8)";
        ctx.beginPath(); ctx.moveTo(cx - xo, fy); ctx.lineTo(cx + xo, fy); ctx.stroke();
      }

      // door
      ctx.globalAlpha = 0.6; ctx.strokeStyle = "rgba(212,175,55,0.7)"; ctx.lineWidth = 1; ctx.shadowBlur = 5;
      ctx.strokeRect(cx - 11, cy + 12, 22, 20);

      // apex dot
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t * 3);
      ctx.fillStyle = "#D4AF37"; ctx.shadowBlur = hovered ? 20 : 10;
      ctx.beginPath(); ctx.arc(cx, cy - 50, hovered ? 5 : 3.5, 0, Math.PI * 2); ctx.fill();

      // lightning
      if (hovered) {
        ltT += 0.016;
        if (ltT > 1.2) { ltT = 0; ltPath = makeLightning(cx, cy - 50, cy + 32); addSparks(sparks, cx, cy - 50, 14); }
        if (ltPath && ltT < 0.15) {
          ctx.globalAlpha = 0.9 - ltT * 4;
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.shadowBlur = 20; ctx.shadowColor = "#D4AF37";
          ctx.beginPath(); ctx.moveTo(ltPath[0][0], ltPath[0][1]);
          ltPath.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
          ctx.strokeStyle = "#F0C84A"; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(ltPath[0][0], ltPath[0][1]);
          ltPath.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
        }
      } else { ltT = 0; ltPath = null; }

      tickSparks(sparks); drawSparks(ctx, sparks);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    cv.parentElement?.addEventListener("mouseenter", onEnter);
    cv.parentElement?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      cv.parentElement?.removeEventListener("mouseenter", onEnter);
      cv.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

/* ══ CARD 1 — REKONSTRUKCE: blueprint scan ══ */
function useRekoCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let hovered = false, raf = 0, scanY = 0;
    const sparks: Spark[] = [];

    const resize = () => { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; ctx.scale(2, 2); };
    resize();

    const bldgs: [number, number, number, number][] = [[25, 38, 30, 87], [60, 28, 40, 97], [105, 43, 30, 82]];

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      const w = 160, h = 170;
      ctx.clearRect(0, 0, w, h);

      // blueprint bg
      ctx.fillStyle = `rgba(8,16,36,${hovered ? 0.55 : 0.22})`; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(80,140,255,0.05)"; ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 15) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 15) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // scan line
      scanY = (scanY + 0.7 * (hovered ? 2.2 : 0.6)) % h;
      const sg = ctx.createLinearGradient(0, scanY - 22, 0, scanY + 22);
      sg.addColorStop(0, "transparent");
      sg.addColorStop(0.5, `rgba(212,175,55,${hovered ? 0.28 : 0.08})`);
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg; ctx.fillRect(0, scanY - 22, w, 44);

      // buildings
      ctx.shadowColor = "#D4AF37";
      bldgs.forEach((b) => {
        const [bx, by, bw, bh] = b;
        const lit = scanY > by && scanY < by + bh;
        ctx.strokeStyle = lit ? "#F0C84A" : "rgba(212,175,55,0.45)";
        ctx.lineWidth = lit ? 1.5 : 0.8; ctx.shadowBlur = lit ? 12 : 3; ctx.globalAlpha = 0.85;
        ctx.strokeRect(bx, by, bw, bh);
        // windows
        ctx.lineWidth = 0.5; ctx.strokeStyle = lit ? "rgba(240,200,74,0.85)" : "rgba(212,175,55,0.28)";
        ctx.shadowBlur = lit ? 6 : 1;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 2; c++) {
            const wx = bx + 4 + c * (bw / 2 - 3), wy = by + 8 + r * 22;
            if (wy + 10 > by + bh) break;
            ctx.globalAlpha = 0.75;
            ctx.strokeRect(wx, wy, bw / 2 - 7, 10);
            if (lit) { ctx.fillStyle = "rgba(212,175,55,0.14)"; ctx.fillRect(wx, wy, bw / 2 - 7, 10); }
          }
        }
      });

      // dimension annotations on hover
      if (hovered) {
        ctx.strokeStyle = "rgba(212,175,55,0.4)"; ctx.lineWidth = 0.5; ctx.shadowBlur = 3; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(20, 155); ctx.lineTo(140, 155); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 155); ctx.lineTo(24, 152); ctx.moveTo(20, 155); ctx.lineTo(24, 158); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(140, 155); ctx.lineTo(136, 152); ctx.moveTo(140, 155); ctx.lineTo(136, 158); ctx.stroke();
        ctx.font = "7px Inter"; ctx.fillStyle = "rgba(212,175,55,0.65)"; ctx.textAlign = "center";
        ctx.fillText("12.4 m", 80, 163);
        ctx.beginPath(); ctx.moveTo(15, 38); ctx.lineTo(15, 130); ctx.stroke();
        ctx.textAlign = "left"; ctx.fillText("8.5 m", 2, 87);
      }

      // header
      ctx.font = "bold 7px Inter"; ctx.fillStyle = "rgba(212,175,55,0.5)"; ctx.textAlign = "left"; ctx.globalAlpha = 1;
      ctx.fillText("PROJEKT_v2.dwg", 20, 12);
      ctx.font = "6px Inter"; ctx.fillStyle = "rgba(212,175,55,0.3)";
      ctx.fillText(`SCAN ${Math.round(scanY / h * 100)}%`, 112, 12);

      tickSparks(sparks); drawSparks(ctx, sparks);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    cv.parentElement?.addEventListener("mouseenter", onEnter);
    cv.parentElement?.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ══ CARD 2 — NOVOSTAVBY: crane + building ══ */
function useHouseCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let hovered = false, raf = 0;
    let buildH = 0;
    const sparks: Spark[] = [];

    const resize = () => { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; ctx.scale(2, 2); };
    resize();

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      const w = 160, h = 170, cx = 80, cy = 90;
      ctx.clearRect(0, 0, w, h);

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, `rgba(4,4,18,${hovered ? 0.85 : 0.4})`);
      sky.addColorStop(1, "transparent");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

      // stars
      if (hovered) {
        for (let i = 0; i < 22; i++) {
          const sx = (Math.sin(i * 137.5) * w + w) / 2;
          const sy = (Math.cos(i * 137.5) * 40 + 50) / 1.2;
          ctx.globalAlpha = 0.25 + 0.3 * Math.sin(t * 2 + i);
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(sx, sy, 0.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const target = 82;
      buildH = Math.min(target, buildH + 0.35 * (hovered ? 1.6 : 0.4));
      const bx = cx - 48, by = cy + 10, bw = 96;
      const builtTop = by + 80 - buildH;

      ctx.shadowColor = "#D4AF37";

      // foundation
      ctx.strokeStyle = "rgba(212,175,55,0.4)"; ctx.lineWidth = 1; ctx.shadowBlur = 4; ctx.globalAlpha = 0.8;
      ctx.strokeRect(bx - 4, by + 78, bw + 8, 8);

      // walls
      ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = hovered ? 1.5 : 1.1; ctx.shadowBlur = hovered ? 10 : 5;
      ctx.globalAlpha = Math.min(1, buildH / 18);
      ctx.strokeRect(bx, builtTop, bw, buildH);

      // windows
      if (buildH > 48) {
        ctx.lineWidth = 0.7; ctx.strokeStyle = "rgba(212,175,55,0.65)"; ctx.shadowBlur = hovered ? 8 : 3;
        const wa = Math.min(1, (buildH - 48) / 20);
        ([[bx + 8, by + 18], [bx + 38, by + 18], [bx + 68, by + 18]] as [number, number][]).forEach(([wx, wy]) => {
          if (wy < builtTop) return;
          ctx.globalAlpha = wa;
          ctx.strokeRect(wx, wy, 18, 14);
          if (hovered) { ctx.fillStyle = `rgba(212,175,55,${0.1 + 0.08 * Math.sin(t * 2 + wx)})`; ctx.fillRect(wx, wy, 18, 14); }
        });
        ctx.globalAlpha = wa * 0.8;
        ctx.strokeRect(cx - 9, by + 44, 18, 34);
      }

      // roof
      if (buildH > 68) {
        const ra = Math.min(1, (buildH - 68) / 16);
        ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = hovered ? 2 : 1.5; ctx.shadowBlur = hovered ? 16 : 10;
        ctx.globalAlpha = ra;
        ctx.beginPath(); ctx.moveTo(bx - 8, builtTop); ctx.lineTo(cx, builtTop - 38); ctx.lineTo(bx + bw + 8, builtTop); ctx.stroke();
        // chimney
        ctx.lineWidth = 1; ctx.shadowBlur = 5; ctx.globalAlpha = ra * 0.8;
        ctx.strokeRect(cx + 22, builtTop - 32, 10, 20);
        // smoke puffs
        if (hovered) {
          for (let i = 0; i < 3; i++) {
            const sr = (t * 0.5 + i * 0.4) % 1;
            ctx.globalAlpha = ra * (1 - sr) * 0.35;
            ctx.strokeStyle = "rgba(212,175,55,0.3)"; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.arc(cx + 27, builtTop - 32 - sr * 28, sr * 8, 0, Math.PI * 2); ctx.stroke();
          }
        }
        // apex
        ctx.fillStyle = "#D4AF37"; ctx.globalAlpha = ra * (0.7 + 0.3 * Math.sin(t * 2));
        ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(cx, builtTop - 38, hovered ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      }

      // crane
      const hookSwing = Math.sin(t * (hovered ? 1.5 : 0.7)) * 10;
      const craneX = cx + 54, cTop = hovered ? 14 : 28;
      ctx.strokeStyle = "rgba(212,175,55,0.55)"; ctx.lineWidth = 1; ctx.shadowBlur = 4; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.moveTo(craneX, by + 84); ctx.lineTo(craneX, cTop); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(craneX - 42, cTop + 4); ctx.lineTo(craneX + 8, cTop + 4); ctx.stroke();
      ctx.strokeStyle = "rgba(212,175,55,0.25)";
      ctx.beginPath(); ctx.moveTo(craneX - 6, cTop + 4); ctx.lineTo(craneX - 42, cTop + 18); ctx.stroke();
      const hookX = craneX - 28 + hookSwing * 0.3;
      const hookY = hovered ? builtTop - 4 : cTop + 38;
      ctx.strokeStyle = "rgba(212,175,55,0.45)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(craneX - 28, cTop + 4); ctx.lineTo(hookX, hookY); ctx.stroke();
      ctx.strokeStyle = "rgba(212,175,55,0.75)"; ctx.lineWidth = 1; ctx.shadowBlur = 6;
      ctx.strokeRect(hookX - 5, hookY, 10, 7);

      if (hovered && buildH < target && Math.random() < 0.25) addSparks(sparks, bx + Math.random() * bw, builtTop, 5);
      tickSparks(sparks); drawSparks(ctx, sparks);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; buildH = 0; };
    cv.parentElement?.addEventListener("mouseenter", onEnter);
    cv.parentElement?.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ══ CARD 3 — FASÁDY: matrix panels + electric ══ */
function useFacadeCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let hovered = false, raf = 0;
    let elecPath: [number, number][] | null = null, elecT = 0;
    const sparks: Spark[] = [];

    const resize = () => { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; ctx.scale(2, 2); };
    resize();

    const ROWS = 5, COLS = 6, pw = 20, ph = 18, gap = 3;
    const panels = Array.from({ length: ROWS * COLS }, (_, i) => ({
      r: Math.floor(i / COLS), c: i % COLS,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      energy: 0,
    }));

    function makeElec(x1: number, y1: number, x2: number, y2: number): [number, number][] {
      const pts: [number, number][] = [[x1, y1]];
      for (let i = 1; i < 9; i++) {
        pts.push([x1 + (x2 - x1) * (i / 9) + (Math.random() - 0.5) * 10, y1 + (y2 - y1) * (i / 9) + (Math.random() - 0.5) * 10]);
      }
      pts.push([x2, y2]); return pts;
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      const w = 160, h = 170, cx = 80, cy = 85;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      bg.addColorStop(0, `rgba(18,12,4,${hovered ? 0.75 : 0.3})`);
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      const sx = cx - (COLS * (pw + gap)) / 2 + gap / 2;
      const sy = cy - (ROWS * (ph + gap)) / 2;

      ctx.shadowColor = "#D4AF37";

      panels.forEach(p => {
        const px = sx + p.c * (pw + gap), py = sy + p.r * (ph + gap);
        const wave = Math.sin(t * p.speed + p.phase + (p.r + p.c) * 0.4);
        const lit = hovered && wave > 0.35;
        p.energy = lit ? Math.min(1, p.energy + 0.09) : Math.max(0, p.energy - 0.05);

        if (p.energy > 0) { ctx.fillStyle = `rgba(212,175,55,${p.energy * 0.14})`; ctx.fillRect(px, py, pw, ph); }

        ctx.strokeStyle = p.energy > 0.5 ? "#F0C84A" : `rgba(212,175,55,${hovered ? 0.55 : 0.22})`;
        ctx.lineWidth = p.energy > 0.5 ? (hovered ? 1.5 : 1) : 0.7;
        ctx.shadowBlur = p.energy * 14;
        ctx.globalAlpha = (hovered ? 0.6 : 0.22) + p.energy * 0.5;
        ctx.strokeRect(px, py, pw, ph);

        if (p.energy > 0.7) {
          ctx.fillStyle = "#D4AF37"; ctx.globalAlpha = p.energy * 0.9; ctx.shadowBlur = 8;
          ([[px, py], [px + pw, py], [px, py + ph], [px + pw, py + ph]] as [number, number][]).forEach(([dx, dy]) => {
            ctx.beginPath(); ctx.arc(dx, dy, 1.2, 0, Math.PI * 2); ctx.fill();
          });
        }
      });

      // outer border
      const bw2 = COLS * (pw + gap) - gap + 6, bh2 = ROWS * (ph + gap) - gap + 6;
      ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = hovered ? 1.5 : 1;
      ctx.shadowBlur = hovered ? 12 : 5; ctx.globalAlpha = 0.8;
      ctx.strokeRect(cx - bw2 / 2, cy - bh2 / 2, bw2, bh2);

      // electric arcs
      if (hovered) {
        elecT += 0.016;
        if (elecT > 0.6) {
          elecT = 0;
          const p1 = panels[Math.floor(Math.random() * panels.length)];
          const p2 = panels[Math.floor(Math.random() * panels.length)];
          const x1 = sx + p1.c * (pw + gap) + pw / 2, y1 = sy + p1.r * (ph + gap) + ph / 2;
          const x2 = sx + p2.c * (pw + gap) + pw / 2, y2 = sy + p2.r * (ph + gap) + ph / 2;
          elecPath = makeElec(x1, y1, x2, y2);
          addSparks(sparks, x1, y1, 8); addSparks(sparks, x2, y2, 8);
        }
        if (elecPath) {
          const life = Math.max(0, 1 - elecT / 0.2);
          if (life > 0) {
            ctx.globalAlpha = life * 0.85;
            ctx.strokeStyle = "rgba(255,255,200,0.85)"; ctx.lineWidth = 1.2;
            ctx.shadowBlur = 16; ctx.shadowColor = "#F0C84A";
            ctx.beginPath(); ctx.moveTo(elecPath[0][0], elecPath[0][1]);
            elecPath.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
            ctx.strokeStyle = "rgba(212,175,55,0.4)"; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(elecPath[0][0], elecPath[0][1]);
            elecPath.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
          }
        }
      } else { elecPath = null; elecT = 0; }

      tickSparks(sparks); drawSparks(ctx, sparks);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    cv.parentElement?.addEventListener("mouseenter", onEnter);
    cv.parentElement?.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ══ SERVICE CARD ══ */
interface CardProps {
  index: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isInView: boolean;
}

function ServiceCard({ index, name, desc, icon, canvasRef, isInView }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#080808] overflow-hidden cursor-pointer"
      whileHover={{ y: -4, zIndex: 10 }}
    >
      {/* gold top line */}
      <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-10"
        style={{ background: "linear-gradient(90deg,#D4AF37,#F0C84A)" }} />

      {/* canvas */}
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="w-full block"
        style={{ height: 170 }}
      />

      {/* body */}
      <div className="p-5">
        <motion.div
          className="w-9 h-9 border border-[rgba(212,175,55,0.22)] flex items-center justify-center mb-3 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[rgba(212,175,55,0.07)]"
        >
          {icon}
        </motion.div>
        <h3 className="text-[13px] font-black tracking-[0.07em] uppercase text-white mb-2">{name}</h3>
        <p className="text-[10px] leading-relaxed mb-4" style={{ color: "rgba(154,154,154,0.62)" }}>{desc}</p>
        <div className="flex items-center gap-1.5 text-[8px] tracking-[0.16em] uppercase font-semibold transition-colors duration-200"
          style={{ color: "rgba(212,175,55,0.65)" }}
        >
          VÍCE INFORMACÍ
          <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} className="inline-block">→</motion.span>
        </div>
      </div>

      {/* corner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 100%,rgba(212,175,55,0.04) 0%,transparent 60%)" }} />
    </motion.div>
  );
}

/* ══ MAIN EXPORT ══ */
export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cv0 = useRef<HTMLCanvasElement | null>(null);
  const cv1 = useRef<HTMLCanvasElement | null>(null);
  const cv2 = useRef<HTMLCanvasElement | null>(null);
  const cv3 = useRef<HTMLCanvasElement | null>(null);

  useRoofCanvas(cv0);
  useRekoCanvas(cv1);
  useHouseCanvas(cv2);
  useFacadeCanvas(cv3);

  const cards = [
    {
      name: "STŘECHY", desc: "Realizace nových střech a kompletní rekonstrukce.",
      canvasRef: cv0,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      name: "REKONSTRUKCE", desc: "Rekonstrukce bytů, domů a komerčních objektů.",
      canvasRef: cv1,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>,
    },
    {
      name: "NOVOSTAVBY", desc: "Výstavba rodinných domů od základů po předání.",
      canvasRef: cv2,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 20V10l8-6 8 6v10M8 20v-6h8v6"/></svg>,
    },
    {
      name: "FASÁDY", desc: "Moderní fasádní systémy a zateplovací řešení.",
      canvasRef: cv3,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="1"/><path d="M8 2v20M14 2v20M2 8h20M2 14h20"/></svg>,
    },
  ];

  return (
    <section className="bg-[#050505] py-24 px-8 md:px-16" id="services">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.28em] text-[#D4AF37] uppercase">CO DĚLÁME</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">NAŠE SLUŽBY</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.06)]">
          {cards.map((card, i) => (
            <ServiceCard key={card.name} index={i} isInView={isInView} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
