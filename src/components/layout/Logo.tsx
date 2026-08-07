import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * ─── SI QUIERES USAR EL ARCHIVO DEL LOGO EN VEZ DE ESTO ─────────────────
 * Lo que se dibuja acá es la ampolleta del logo redibujada en vectores, con
 * "THE LAMP" al lado en Montserrat. Se hizo así porque el logo original es
 * apilado (THE arriba, LAMP abajo) y en la barra superior, a 22 px de alto,
 * cada línea quedaría en 9 px: ilegible.
 *
 * Si consigues una versión horizontal de una sola línea:
 * 1. Guárdala en `public/logo.png` (PNG con fondo transparente, 1200 px de
 *    ancho o más).
 * 2. Cambia `LOGO_SRC` de "" a "/logo.png".
 * 3. Ajusta `LOGO_RATIO` al ancho ÷ alto real del archivo. Si mide
 *    1200 × 260, el valor es 1200 / 260 = 4.6.
 * Se actualiza de una vez en el header, el menú móvil y el footer.
 * ───────────────────────────────────────────────────────────────────────── */
const LOGO_SRC = ""
const LOGO_RATIO = 4.6

/** El celeste del casquillo, único color del logo. */
const CELESTE = "#5badde"

/**
 * La ampolleta del logo: vidrio en trazo blanco, casquillo celeste, y el
 * conjunto inclinado como en el original. Se dibuja upright y se rota, que es
 * mucho más fácil de mantener que calcular los puntos ya inclinados.
 */
function Ampolleta({ alto }: { alto: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={alto}
      height={alto}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <g transform="rotate(34 12 12)">
        {/* Vidrio */}
        <path
          d="M12 2.6a6.2 6.2 0 0 1 3.7 11.2v1.1H8.3v-1.1A6.2 6.2 0 0 1 12 2.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        {/* Reflejo interior: el trazo diagonal del logo */}
        <path
          d="M10.1 11.6 14 6.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Casquillo */}
        <rect x="8.3" y="16.1" width="7.4" height="2.5" rx="0.5" fill={CELESTE} />
        <rect x="9.3" y="19.2" width="5.4" height="2.2" rx="0.5" fill={CELESTE} />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  /** Alto en píxeles del conjunto. */
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
        "inline-flex select-none items-center text-white",
        className
      )}
      style={{ gap: alto * 0.34 }}
    >
      <Ampolleta alto={alto * 1.15} />
      <span
        className="font-[family-name:var(--font-heading)] font-bold uppercase leading-none"
        style={{ fontSize: alto * 0.78, letterSpacing: "-0.01em" }}
      >
        The&nbsp;Lamp
      </span>
    </span>
  )
}
