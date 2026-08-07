/**
 * Fondo global: grilla técnica en el turquesa oficial + dos glows cálidos que
 * representan la luz física de las lámparas.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -inset-[64px] opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,204,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,204,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          animation: "grid-drift 24s linear infinite",
        }}
      />
      <div
        className="absolute left-[-10%] top-[-15%] h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,180,84,0.10) 0%, transparent 70%)",
          animation: "glow-breathe-a 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-15%] h-[55vw] max-h-[640px] w-[55vw] max-w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,60,0.08) 0%, transparent 70%)",
          animation: "glow-breathe-b 21s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.75) 100%)",
        }}
      />
    </div>
  )
}
