"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── shared spark / util ─── */
interface Pt { x: number; y: number }

function makeBolt(x1: number, y1: number, x2: number, y2: number): Pt[] {
  const pts: Pt[] = [{ x: x1, y: y1 }];
  let x = x1, y = y1;
  while (y > y2) {
    y -= Math.random() * 12 + 4;
    x += (Math.random() - 0.5) * 14;
    pts.push({ x, y });
  }
  pts.push({ x: x2, y: y2 });
  return pts;
}

/* ─── Canvas setup ─── */
function setupCanvas(cv: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const r = cv.getBoundingClientRect();
  const W = r.width, H = r.height;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return { ctx, W, H };
}

/* ══════════════════════════════════════
   HOOK FACTORY — keeps each effect isolated
══════════════════════════════════════ */

/* 0 — AURORA WIREFRAME PARALLAX */
function useAuroraCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let { ctx, W, H } = setupCanvas(cv);
    let hovered = false, mx = 0.5, my = 0.5, raf = 0;

    const ro = new ResizeObserver(() => { ({ ctx, W, H } = setupCanvas(cv)); });
    ro.observe(cv.parentElement!);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      layer: Math.floor(Math.random() * 3),
      r: Math.random() * 1.6 + 0.3,
      a: Math.random() * 0.5 + 0.15,
      ph: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    }));

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // bg
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#0e0c04"); bg.addColorStop(1, "#050402");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // aurora bands
      for (let i = 0; i < 3; i++) {
        const y = H * (0.25 + i * 0.22) + Math.sin(t * 0.3 + i * 1.2) * H * 0.06;
        const ag = ctx.createLinearGradient(0, y - H * 0.12, 0, y + H * 0.12);
        ag.addColorStop(0, "transparent");
        ag.addColorStop(0.5, `rgba(212,175,55,${hovered ? 0.07 : 0.02})`);
        ag.addColorStop(1, "transparent");
        ctx.fillStyle = ag; ctx.fillRect(0, y - H * 0.12, W, H * 0.24);
      }

      const px = (mx - 0.5) * (hovered ? 38 : 8);
      const py = (my - 0.5) * (hovered ? 24 : 5);
      const cx = W / 2, cy = H * 0.46;

      // 3 depth wireframe layers
      ([
        [0, 0.18, 1.4, 14],
        [1, 0.1, 0.9, 7],
        [2, 0.05, 0.45, 3],
      ] as [number, number, number, number][]).forEach(([layer, ds, alpha, blur]) => {
        const ox = px * ds, oy = py * ds;
        const scale = 1 - layer * 0.08;
        const bw = W * 0.5 * scale, bh = H * 0.44 * scale;
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.5 - layer * 0.4;
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? blur : blur * 0.3;
        ctx.globalAlpha = hovered ? alpha : alpha * 0.35;
        ctx.strokeRect(cx - bw / 2 + ox, cy - bh / 2 + oy, bw, bh);
        ctx.beginPath();
        ctx.moveTo(cx - bw / 2 - 6 + ox, cy - bh / 2 + oy);
        ctx.lineTo(cx + ox, cy - bh / 2 - H * 0.27 * scale + oy);
        ctx.lineTo(cx + bw / 2 + 6 + ox, cy - bh / 2 + oy);
        ctx.stroke();
        if (layer === 0) {
          ctx.lineWidth = 0.7; ctx.shadowBlur = hovered ? 8 : 2;
          ([ [-0.2, 0.08], [0.1, 0.08] ] as [number, number][]).forEach(([dx, dy]) => {
            const wx = cx + dx * W + ox, wy = cy + dy * H + oy;
            const ww = bw * 0.2, wh = bh * 0.28;
            ctx.globalAlpha = hovered ? 0.7 : 0.3;
            ctx.strokeRect(wx, wy, ww, wh);
            if (hovered) {
              ctx.fillStyle = `rgba(212,175,55,${0.1 + 0.1 * Math.sin(t * 1.5 + wx * 0.01)})`;
              ctx.fillRect(wx, wy, ww, wh);
            }
          });
        }
      });

      // particles
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const ds = [0.18, 0.1, 0.04][p.layer];
        const ox = px * ds, oy = py * ds;
        const pulse = 0.5 + 0.5 * Math.sin(t * (1 + p.layer * 0.3) + p.ph);
        ctx.globalAlpha = p.a * (hovered ? 1 : 0.4) * pulse;
        ctx.fillStyle = "#D4AF37";
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? (p.layer === 0 ? 10 : 4) : 1;
        ctx.beginPath(); ctx.arc(p.x * W + ox, p.y * H + oy, p.r * (hovered ? 1.4 : 1), 0, Math.PI * 2); ctx.fill();
      });

      if (hovered) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].layer !== particles[j].layer) continue;
            const d = Math.hypot((particles[i].x - particles[j].x) * W, (particles[i].y - particles[j].y) * H);
            if (d < 55) {
              ctx.globalAlpha = (1 - d / 55) * 0.25;
              ctx.strokeStyle = "rgba(212,175,55,.7)"; ctx.lineWidth = 0.4; ctx.shadowBlur = 2;
              ctx.beginPath(); ctx.moveTo(particles[i].x * W, particles[i].y * H);
              ctx.lineTo(particles[j].x * W, particles[j].y * H); ctx.stroke();
            }
          }
        }
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; mx = 0.5; my = 0.5; };
    const onMove = (e: MouseEvent) => { const r = cv.parentElement!.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
    cv.parentElement!.addEventListener("mouseenter", onEnter);
    cv.parentElement!.addEventListener("mouseleave", onLeave);
    cv.parentElement!.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); cv.parentElement?.removeEventListener("mousemove", onMove); };
  }, [ref]);
}

/* 1 — MOLTEN GOLD ROOF */
function useMoltenCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let { ctx, W, H } = setupCanvas(cv);
    let hovered = false, mx = 0.5, my = 0.5, raf = 0;
    const ro = new ResizeObserver(() => { ({ ctx, W, H } = setupCanvas(cv)); });
    ro.observe(cv.parentElement!);

    const drops = Array.from({ length: 28 }, () => ({
      x: Math.random(), y: -Math.random() * 0.5,
      vy: 0.003 + Math.random() * 0.004,
      r: Math.random() * 1.2 + 0.4,
      a: Math.random() * 0.7 + 0.2,
      trail: [] as { x: number; y: number }[],
    }));

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#120a02"); bg.addColorStop(1, "#060402");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // lava glow
      const lava = (Math.sin(t * 0.4) + 1) / 2;
      const lg = ctx.createLinearGradient(0, H * 0.6, 0, H);
      lg.addColorStop(0, "transparent");
      lg.addColorStop(0.5, `rgba(212,100,10,${hovered ? 0.12 * lava : 0.03 * lava})`);
      lg.addColorStop(1, `rgba(255,140,20,${hovered ? 0.18 * lava : 0.05 * lava})`);
      ctx.fillStyle = lg; ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // drops with trails
      drops.forEach(d => {
        d.y += d.vy * (hovered ? 2.5 : 1);
        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 12) d.trail.shift();
        if (d.y > 1.1) { d.y = -Math.random() * 0.3; d.x = Math.random(); d.trail = []; }

        for (let i = 1; i < d.trail.length; i++) {
          const a = (i / d.trail.length) * d.a * (hovered ? 1 : 0.4);
          ctx.globalAlpha = a * 0.7;
          ctx.strokeStyle = "rgba(212,175,55,.85)"; ctx.lineWidth = d.r * 0.4;
          ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 4 : 1;
          ctx.beginPath(); ctx.moveTo(d.trail[i - 1].x * W, d.trail[i - 1].y * H);
          ctx.lineTo(d.trail[i].x * W, d.trail[i].y * H); ctx.stroke();
        }
        ctx.globalAlpha = d.a * (hovered ? 1 : 0.4);
        ctx.fillStyle = hovered ? "#F0C84A" : "#D4AF37";
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 8 : 2;
        ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r * (hovered ? 1.5 : 1), 0, Math.PI * 2); ctx.fill();
      });

      // tilt roof
      const tX = (mx - 0.5) * 14 * (hovered ? 1 : 0.15);
      const tY = (my - 0.5) * 8 * (hovered ? 1 : 0.15);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.transform(1, tY * 0.012, tX * 0.012, 1, 0, 0); ctx.translate(-W / 2, -H / 2);
      const cx = W / 2, cy = H * 0.52, rW = W * 0.62, rH = H * 0.42;
      ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 16 : 6;
      ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = hovered ? 2 : 1.3; ctx.globalAlpha = 0.9;
      ctx.strokeRect(cx - rW / 2, cy - rH / 2, rW, rH);
      ctx.beginPath(); ctx.moveTo(cx - rW / 2 - 7, cy - rH / 2); ctx.lineTo(cx, cy - rH / 2 - H * 0.3); ctx.lineTo(cx + rW / 2 + 7, cy - rH / 2); ctx.stroke();
      ctx.fillStyle = "#F0C84A"; ctx.shadowBlur = hovered ? 20 : 8;
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t * 3);
      ctx.beginPath(); ctx.arc(cx, cy - rH / 2 - H * 0.3, hovered ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // shine
      const sx = (hovered ? mx : 0.5) * W * 1.5 - W * 0.25;
      const sg = ctx.createLinearGradient(sx - 60, 0, sx + 60, H);
      sg.addColorStop(0, "transparent"); sg.addColorStop(0.5, `rgba(255,235,180,${hovered ? 0.1 : 0.015})`); sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg; ctx.globalAlpha = 1; ctx.fillRect(0, 0, W, H);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);
    const onEnter = () => { hovered = true; }; const onLeave = () => { hovered = false; mx = 0.5; my = 0.5; };
    const onMove = (e: MouseEvent) => { const r = cv.parentElement!.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
    cv.parentElement!.addEventListener("mouseenter", onEnter); cv.parentElement!.addEventListener("mouseleave", onLeave); cv.parentElement!.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); cv.parentElement?.removeEventListener("mousemove", onMove); };
  }, [ref]);
}

/* 2 — MATRIX RAIN + SCAN */
function useMatrixCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let { ctx, W, H } = setupCanvas(cv);
    let hovered = false, raf = 0, scanY = 0;
    const ro = new ResizeObserver(() => { ({ ctx, W, H } = setupCanvas(cv)); });
    ro.observe(cv.parentElement!);

    const CHARS = "01アイウエオカキクサシスセタチ";
    const COLS = 14;
    const cols = Array.from({ length: COLS }, (_, i) => ({
      x: i, y: -Math.random() * 100, speed: 1.5 + Math.random() * 2,
    }));
    const scanData = [
      { l: "PLOCHA", v: "312 m²" }, { l: "PATRA", v: "3" },
      { l: "ROK", v: "2022" }, { l: "TYP", v: "VILA" },
    ];

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(4,8,20,.96)"; ctx.fillRect(0, 0, W, H);

      const colW = W / COLS;
      cols.forEach((col, ci) => {
        col.y += col.speed * (hovered ? 2 : 1);
        if (col.y > H + 50) col.y = -30 - Math.random() * H;
        const steps = Math.floor((col.y + 60) / 10);
        for (let s = 0; s < Math.min(steps, 18); s++) {
          const cy = col.y - s * 10; if (cy < 0 || cy > H) continue;
          const fade = 1 - s / 18, isHead = s === 0;
          ctx.globalAlpha = (hovered ? 1 : 0.5) * (isHead ? 1 : fade * 0.6);
          ctx.fillStyle = isHead ? "#F0C84A" : `rgba(212,175,55,${fade * 0.8})`;
          ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = isHead ? (hovered ? 12 : 5) : (hovered ? 3 : 1);
          ctx.font = `${Math.floor(colW * 0.7)}px monospace`; ctx.textAlign = "center";
          ctx.fillText(CHARS[Math.floor(t * 8 + ci * 7 + s * 3) % CHARS.length], ci * colW + colW / 2, cy);
        }
      });

      // scan
      scanY = (scanY + 1.5 * (hovered ? 2.5 : 0.8)) % H;
      const sg = ctx.createLinearGradient(0, scanY - 28, 0, scanY + 12);
      sg.addColorStop(0, "transparent"); sg.addColorStop(0.6, `rgba(212,175,55,${hovered ? 0.35 : 0.08})`); sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg; ctx.globalAlpha = 1; ctx.fillRect(0, scanY - 28, W, 40);
      ctx.strokeStyle = `rgba(212,175,55,${hovered ? 0.65 : 0.18})`; ctx.lineWidth = 1;
      ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 10 : 3;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();

      // building
      const bx = W * 0.16, by = H * 0.1, bw = W * 0.68, bh = H * 0.78;
      ctx.strokeStyle = "rgba(212,175,55,0.28)"; ctx.lineWidth = 0.8; ctx.shadowBlur = 3; ctx.globalAlpha = 0.75;
      ctx.strokeRect(bx, by, bw, bh);
      for (let f = 1; f < 4; f++) { ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.moveTo(bx, by + bh * (f / 4)); ctx.lineTo(bx + bw, by + bh * (f / 4)); ctx.stroke(); }
      // corner brackets
      ([[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]] as [number, number][]).forEach(([ex, ey], i) => {
        const sx2 = i % 2 === 0 ? 1 : -1, sy2 = i < 2 ? 1 : -1, bl = 9;
        ctx.strokeStyle = "rgba(212,175,55,.65)"; ctx.lineWidth = 1; ctx.globalAlpha = hovered ? 0.8 : 0.3;
        ctx.beginPath(); ctx.moveTo(ex + sx2 * bl, ey); ctx.lineTo(ex, ey); ctx.lineTo(ex, ey + sy2 * bl); ctx.stroke();
      });

      // data overlay
      if (hovered) {
        scanData.forEach((d, i) => {
          const dy = H * (0.22 + i * 0.18);
          const revealed = scanY > dy;
          ctx.globalAlpha = revealed ? 0.9 : 0.08;
          ctx.font = "bold 7px Inter"; ctx.fillStyle = "rgba(212,175,55,.85)"; ctx.textAlign = "left"; ctx.shadowBlur = revealed ? 4 : 0;
          ctx.fillText(d.l, bx + 8, dy);
          ctx.font = "7px Inter"; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.textAlign = "right";
          ctx.fillText(d.v, bx + bw - 8, dy);
        });
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);
    const onEnter = () => { hovered = true; }; const onLeave = () => { hovered = false; };
    cv.parentElement!.addEventListener("mouseenter", onEnter); cv.parentElement!.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* 3 — ELECTRIC CITY */
function useElectricCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let { ctx, W, H } = setupCanvas(cv);
    let hovered = false, raf = 0, glitch = 0, glitchCool = 0;
    const ro = new ResizeObserver(() => { ({ ctx, W, H } = setupCanvas(cv)); });
    ro.observe(cv.parentElement!);

    const city = Array.from({ length: 12 }, () => ({
      x: 0.05 + Math.random() * 0.82, h: 0.2 + Math.random() * 0.55, w: 0.055 + Math.random() * 0.03,
    }));
    const bolts: { pts: Pt[]; life: number; ix: number; iy: number }[] = [];

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#080410"); bg.addColorStop(1, "#020108");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // stars
      for (let i = 0; i < 25; i++) {
        const sx = (Math.sin(i * 137.5) * W + W) / 2, sy = Math.abs(Math.cos(i * 97.3)) * H * 0.45;
        ctx.globalAlpha = 0.18 + 0.15 * Math.sin(t + i);
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 0.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      const groundY = H * 0.78;
      city.forEach((b, i) => {
        const bx = b.x * W, bw2 = b.w * W, bh = b.h * H, by = groundY - bh;
        const glow = 0.4 + 0.3 * Math.sin(t * 0.8 + i * 0.4);
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? 10 : 3;
        ctx.strokeStyle = `rgba(212,175,55,${hovered ? 0.65 + glow * 0.25 : 0.28 + glow * 0.1})`;
        ctx.lineWidth = hovered ? 1.2 : 0.7; ctx.globalAlpha = hovered ? 0.9 : 0.6;
        ctx.strokeRect(bx, by, bw2, bh);
        // windows
        const wR = Math.floor(bh / 12), wC = Math.floor(bw2 / 8);
        for (let r = 0; r < wR; r++) for (let c = 0; c < wC; c++) {
          if (Math.sin(t * 0.4 + r * 1.1 + c * 0.7 + i) > 0.25) {
            ctx.fillStyle = `rgba(212,175,55,${hovered ? 0.25 : 0.1})`; ctx.shadowBlur = hovered ? 5 : 1;
            ctx.globalAlpha = hovered ? 0.7 : 0.3;
            ctx.fillRect(bx + c * 8 + 2, by + r * 12 + 3, 4, 6);
          }
        }
      });

      // ground
      ctx.strokeStyle = "rgba(212,175,55,.4)"; ctx.lineWidth = 0.8; ctx.shadowBlur = 2; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      // lightning
      if (hovered) {
        glitchCool = Math.max(0, glitchCool - 16);
        if (glitchCool === 0) {
          glitchCool = 600 + Math.random() * 800;
          const b = city[Math.floor(Math.random() * city.length)];
          const tx = b.x * W + b.w * W / 2, ty = groundY - b.h * H;
          bolts.push({ pts: makeBolt(tx + (Math.random() - 0.5) * 40, 10, tx, ty), life: 1, ix: tx, iy: ty });
        }
        for (let i = bolts.length - 1; i >= 0; i--) {
          bolts[i].life -= 0.06;
          if (bolts[i].life <= 0) bolts.splice(i, 1);
        }
        bolts.forEach(b => {
          ctx.globalAlpha = b.life * 0.85;
          ctx.strokeStyle = "rgba(255,255,200,.9)"; ctx.lineWidth = 1.5; ctx.shadowColor = "#F0C84A"; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.moveTo(b.pts[0].x, b.pts[0].y);
          b.pts.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
          ctx.strokeStyle = "rgba(212,175,55,.5)"; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(b.pts[0].x, b.pts[0].y);
          b.pts.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
          if (b.life > 0.7) {
            const rg = ctx.createRadialGradient(b.ix, b.iy, 0, b.ix, b.iy, 22);
            rg.addColorStop(0, `rgba(255,220,100,${b.life * 0.5})`); rg.addColorStop(1, "transparent");
            ctx.fillStyle = rg; ctx.fillRect(b.ix - 22, b.iy - 22, 44, 44);
          }
        });
      }

      // glitch
      glitch = Math.max(0, glitch - 16);
      if (hovered && glitch === 0) glitch = 500 + Math.random() * 900;
      if (glitch > 400) {
        const inten = (glitch - 400) / 200;
        for (let i = 0; i < 5 * inten; i++) {
          const sy2 = Math.random() * H, sh = Math.random() * 10 + 2, ox = (Math.random() - 0.5) * 18 * inten;
          ctx.globalAlpha = inten * 0.4;
          ctx.fillStyle = "rgba(255,40,40,.35)"; ctx.fillRect(ox, sy2, W, sh);
          ctx.fillStyle = "rgba(40,40,255,.35)"; ctx.fillRect(-ox, sy2, W, sh);
        }
        for (let i = 0; i < 10 * inten; i++) {
          ctx.fillStyle = `rgba(212,175,55,${Math.random() * 0.9})`; ctx.globalAlpha = 1;
          ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 10, 2);
        }
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);
    const onEnter = () => { hovered = true; }; const onLeave = () => { hovered = false; };
    cv.parentElement!.addEventListener("mouseenter", onEnter); cv.parentElement!.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* 4 — DNA HELIX CONSTELLATION */
function useConstellationCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let { ctx, W, H } = setupCanvas(cv);
    let hovered = false, raf = 0;
    const ro = new ResizeObserver(() => { ({ ctx, W, H } = setupCanvas(cv)); });
    ro.observe(cv.parentElement!);

    const COUNT = 32;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 1.8 + 0.4, a: Math.random() * 0.55 + 0.2,
      ph: Math.random() * Math.PI * 2,
    }));
    const helixTarget = Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 4;
      const side = i % 2 === 0 ? 1 : -1;
      return { x: 0.5 + Math.cos(angle) * 0.28 * side, y: 0.05 + i / COUNT * 0.9 };
    });

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#0c0810"); bg.addColorStop(1, "#040208");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const spd = hovered ? 0.06 : 0.008;
      particles.forEach((p, i) => {
        const tgt = helixTarget[i];
        p.x += (tgt.x - p.x) * spd; p.y += (tgt.y - p.y) * spd;
        if (!hovered) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
          if (p.y < 0.02 || p.y > 0.98) p.vy *= -1;
        }
        const pulse = 0.5 + 0.5 * Math.sin(t * (1.2 + i * 0.05) + p.ph);
        ctx.globalAlpha = p.a * (hovered ? 1 : 0.5) * (0.65 + 0.35 * pulse);
        ctx.fillStyle = i % 2 === 0 ? "#D4AF37" : "#F0C84A";
        ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = hovered ? p.r * 6 : 2;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * (hovered ? 1.5 : 1), 0, Math.PI * 2); ctx.fill();
      });

      // connections
      if (hovered) {
        for (let i = 0; i < COUNT - 2; i += 2) {
          const a = particles[i], b = particles[i + 1];
          ctx.globalAlpha = 0.4; ctx.strokeStyle = "rgba(212,175,55,.75)"; ctx.lineWidth = 0.7; ctx.shadowColor = "#D4AF37"; ctx.shadowBlur = 4;
          ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke();
          if (i > 0) {
            ctx.globalAlpha = 0.2; ctx.lineWidth = 0.4;
            ctx.beginPath(); ctx.moveTo(particles[i - 2].x * W, particles[i - 2].y * H); ctx.lineTo(a.x * W, a.y * H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(particles[i - 1].x * W, particles[i - 1].y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke();
          }
        }
      } else {
        for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
          const d = Math.hypot((particles[i].x - particles[j].x) * W, (particles[i].y - particles[j].y) * H);
          if (d < 45) {
            ctx.globalAlpha = (1 - d / 45) * 0.15;
            ctx.strokeStyle = "rgba(212,175,55,.7)"; ctx.lineWidth = 0.4; ctx.shadowBlur = 1;
            ctx.beginPath(); ctx.moveTo(particles[i].x * W, particles[i].y * H); ctx.lineTo(particles[j].x * W, particles[j].y * H); ctx.stroke();
          }
        }
      }

      if (hovered) {
        ctx.globalAlpha = 0.22; ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = 0.8; ctx.shadowBlur = 5;
        ctx.strokeRect(W * 0.28, H * 0.3, W * 0.44, H * 0.55);
        ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.3); ctx.lineTo(W * 0.5, H * 0.08); ctx.lineTo(W * 0.75, H * 0.3); ctx.stroke();
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);
    const onEnter = () => { hovered = true; }; const onLeave = () => { hovered = false; };
    cv.parentElement!.addEventListener("mouseenter", onEnter); cv.parentElement!.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.parentElement?.removeEventListener("mouseenter", onEnter); cv.parentElement?.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ══ CARD COMPONENT ══ */
interface CardProps {
  id: string; num: string; type: string;
  name: string; loc: string; year: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  className: string; index: number; isInView: boolean;
}

function ProjectCard({ id, num, type, name, loc, year, canvasRef, className, index, isInView }: CardProps) {
  return (
    <motion.div
      id={id}
      className={`${className} relative overflow-hidden cursor-pointer bg-[#060606]`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* canvas fills full card */}
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* overlay */}
      <div className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(0deg,rgba(3,3,3,.95) 0%,rgba(3,3,3,.18) 45%,transparent 75%)" }} />

      {/* gold bottom rule */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-[4]"
        style={{ background: "linear-gradient(90deg,#D4AF37,#F0C84A,transparent)" }} />

      {/* arrow */}
      <div className="absolute top-2.5 right-2.5 z-[4] w-6 h-6 border border-white/15 rounded-full flex items-center justify-center text-[9px] text-white/30 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] group-hover:rotate-45">
        ↗
      </div>

      {/* meta */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <div className="text-[7px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(212,175,55,.5)" }}>
          {num} — {type}
        </div>
        <div className="font-black uppercase text-white leading-tight tracking-wide"
          style={{ fontSize: className.includes("col-span") ? "15px" : "11px" }}>
          {name}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[8px] tracking-wide" style={{ color: "rgba(154,154,154,.45)" }}>{loc}</span>
          <span className="text-[7px] tracking-wide" style={{ color: "rgba(212,175,55,.4)" }}>{year}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ══ MAIN ══ */
export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cv0 = useRef<HTMLCanvasElement | null>(null);
  const cv1 = useRef<HTMLCanvasElement | null>(null);
  const cv2 = useRef<HTMLCanvasElement | null>(null);
  const cv3 = useRef<HTMLCanvasElement | null>(null);
  const cv4 = useRef<HTMLCanvasElement | null>(null);

  useAuroraCanvas(cv0);
  useMoltenCanvas(cv1);
  useMatrixCanvas(cv2);
  useElectricCanvas(cv3);
  useConstellationCanvas(cv4);

  const projects = [
    { id:"p0", num:"01", type:"NOVOSTAVBA", name:"Rodinný dům Na Vinici", loc:"Mladá Boleslav", year:"2023", canvasRef:cv0, className:"group col-span-1 row-span-2 min-h-[360px]" },
    { id:"p1", num:"02", type:"STŘECHA",    name:"Moderní střecha",        loc:"Praha",          year:"2023", canvasRef:cv1, className:"group col-span-1 row-span-1" },
    { id:"p2", num:"03", type:"REKONSTRUKCE",name:"Vila Háje",             loc:"Mladá Boleslav", year:"2022", canvasRef:cv2, className:"group col-span-1 row-span-1" },
    { id:"p3", num:"04", type:"FASÁDA",     name:"Bytový komplex",         loc:"Mladá Boleslav", year:"2022", canvasRef:cv3, className:"group col-span-1 row-span-1" },
    { id:"p4", num:"05", type:"KOMERČNÍ",   name:"Office Park",            loc:"Mladá Boleslav", year:"2023", canvasRef:cv4, className:"group col-span-1 row-span-1" },
  ];

  return (
    <section className="bg-[#030303] py-24 px-8 md:px-16" id="projects">
      <div className="max-w-screen-xl mx-auto">
        {/* header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-[#D4AF37]" />
              <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,.65)" }}>VYBRANÉ REALIZACE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">NAŠE PROJEKTY</h2>
          </div>
          <div className="text-[9px] tracking-[0.2em] uppercase hidden md:block" style={{ color: "rgba(212,175,55,.3)" }}>
            05 realizací
          </div>
        </motion.div>

        {/* masonry grid */}
        <div
          className="grid gap-[5px]"
          style={{ gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "180px 180px" }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} {...p} index={i} isInView={isInView} />
          ))}
        </div>

        {/* show all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="flex justify-end mt-5"
        >
          <button className="text-[8px] tracking-[0.18em] uppercase px-5 py-2.5 transition-all duration-300"
            style={{ border: "0.5px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,.4)"; (e.target as HTMLElement).style.color = "#D4AF37"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,.1)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,.4)"; }}
          >
            ZOBRAZIT VŠECHNY REALIZACE
          </button>
        </motion.div>
      </div>
    </section>
  );
}
