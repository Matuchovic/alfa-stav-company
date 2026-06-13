"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) setProgress((window.scrollY / h) * 100);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[9998] pointer-events-none transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #D4AF37, #F0C84A)",
        boxShadow: "0 0 8px rgba(212,175,55,0.6)",
      }}
    />
  );
}
