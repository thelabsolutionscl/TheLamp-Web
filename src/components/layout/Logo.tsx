import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * ─── CÓMO PONER EL LOGO REAL ────────────────────────────────────────────
 * 1. Guarda el archivo del logo en `public/logo.png` (PNG con fondo
 *    transparente, idealmente de 1200 px de ancho o más).
 * 2. Cambia `LOGO_SRC` de "" a "/logo.png".
 * 3. Ajusta `LOGO_RATIO` al ancho ÷ alto real de tu archivo. Si el logo mide
 *    1200 × 260, el valor es 1200 / 260 = 4.6.
 * Listo: se actualiza en el header, el menú móvil y el footer de una vez.
 *
 * Mientras `LOGO_SRC` esté vacío se dibuja un logotipo tipográfico, para que
 * el sitio nunca muestre una imagen rota.
 * ───────────────────────────────────────────────────────────────────────── */
const LOGO_SRC = ""
const LOGO_RATIO = 4.6

export function Logo({
  className,
  /** Alto en píxeles. El ancho se calcula solo. */
  alto = 24,
}: {
  className?: string
  alto?: number
}) {
  if (LOGO_SRC) {
    return (
      <Image
        src={LOGO_SRC}
        alt="The Lamp"
        width={Math.round(alto * LOGO_RATIO)}
        height={alto}
        className={cn("w-auto", className)}
        style={{ height: alto }}
        priority
      />
    )
  }

  return (
    <span
      className={cn(
        "inline-flex select-none items-center gap-[0.45em] font-[family-name:var(--font-heading)] font-semibold leading-none tracking-[-0.03em] text-white",
        className
      )}
      style={{ fontSize: alto * 0.82 }}
    >
      {/* Punto de luz: el mismo gesto del isotipo de The Lab, en ámbar. */}
      <span
        aria-hidden="true"
        className="inline-block rounded-full bg-[#ffb454]"
        style={{
          width: alto * 0.26,
          height: alto * 0.26,
          boxShadow: `0 0 ${alto * 0.5}px rgba(255,180,84,0.9)`,
        }}
      />
      <span>
        The<span className="text-[#ffb454]">Lamp</span>
      </span>
    </span>
  )
}
