"use client";

import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.22}px)`;
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
      {/* Parallax photo */}
      <div
        ref={imgRef}
        className="absolute will-change-transform"
        style={{
          inset: 0,
          top: "-28%",
          height: "156%",
          backgroundImage: "url('/par-alfa.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay — lighter now so photo shows through sections */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(5,5,5,0.78)" }}
      />

      {/* Bottom fade to black */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,rgba(5,5,5,0.3) 0%,transparent 25%,transparent 75%,rgba(5,5,5,0.5) 100%)",
        }}
      />
    </div>
  );
}
