"use client";

import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      // slow parallax — 0.25 ratio = subtle depth
      el.style.transform = `translateY(${scrolled * 0.25}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Parallax photo layer */}
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          top: "-25%",
          height: "150%",
          backgroundImage: "url('/par-alfa.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Heavy black overlay — keeps sections dark & readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(5,5,5,0.88)",
        }}
      />

      {/* Subtle vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(5,5,5,0.55) 100%)",
        }}
      />
    </div>
  );
}
