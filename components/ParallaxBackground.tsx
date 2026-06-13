"use client";

export default function ParallaxBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Foto — čistě fixed, žádný JS parallax pohyb */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/par-alfa.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Hlavní tmavý overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(5,5,5,0.82)" }}
      />
    </div>
  );
}
