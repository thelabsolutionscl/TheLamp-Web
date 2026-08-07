import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Coleccion, Imagen } from "@/data/products"

/**
 * Foto de producto con marcador de posición.
 *
 * Mientras un producto no tenga fotos en `src/data/products.ts`, dibuja una
 * silueta de la lámpara con su halo de luz en vez de una imagen rota. Es
 * feo tener el sitio esperando fotos, pero es peor tenerlo con cuadros
 * grises: esto se ve intencional hasta que llegue la sesión de fotos.
 */
export function ProductImage({
  imagenes,
  indice = 0,
  nombre,
  coleccion,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  imagenes: Imagen[]
  indice?: number
  nombre: string
  coleccion: Coleccion
  className?: string
  sizes?: string
  priority?: boolean
}) {
  // Copenhagen usa la foto 1 como principal. Intercambiamos 0 y 1 para que
  // también la galería mantenga un orden coherente sin duplicar imágenes.
  const indiceReal =
    nombre === "Copenhagen"
      ? indice === 0
        ? 1
        : indice === 1
          ? 0
          : indice
      : indice

  const imagen = imagenes[indiceReal]

  if (imagen) {
    return (
      <Image
        src={imagen.src}
        alt={imagen.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-[#111111]",
        className
      )}
      role="img"
      aria-label={`Fotografía de la lámpara ${nombre} próximamente`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 32%, rgba(255,180,84,0.18) 0%, transparent 70%)",
        }}
      />
      <SiluetaLampara coleccion={coleccion} />
      <span className="absolute bottom-3 left-0 right-0 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/25">
        Foto próximamente
      </span>
    </div>
  )
}

/** Silueta simple por colección. Trazo fino, coherente con el resto del sitio. */
function SiluetaLampara({ coleccion }: { coleccion: Coleccion }) {
  const trazo = {
    fill: "none",
    stroke: "rgba(255,180,84,0.45)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="relative h-2/5 w-2/5 max-h-40 max-w-40"
      aria-hidden="true"
    >
      {coleccion === "mesa" && (
        <>
          <path d="M32 46 L38 26 H62 L68 46 Z" {...trazo} />
          <path d="M50 46 V74" {...trazo} />
          <path d="M36 78 H64" {...trazo} />
        </>
      )}
      {coleccion === "colgante" && (
        <>
          <path d="M50 16 V38" {...trazo} />
          <path d="M30 62 L38 38 H62 L70 62 Z" {...trazo} />
        </>
      )}
      {coleccion === "muro" && (
        <>
          <path d="M34 22 V78" {...trazo} />
          <path d="M34 42 H56 L62 52 H40 Z" {...trazo} />
        </>
      )}
      {coleccion === "pie" && (
        <>
          <path d="M36 26 L42 12 H58 L64 26 Z" {...trazo} />
          <path d="M50 26 V80" {...trazo} />
          <path d="M34 84 H66" {...trazo} />
        </>
      )}
      {/* Rayos de luz: el gesto que hace legible la silueta a tamaño chico. */}
      <g opacity="0.5">
        <path d="M22 34 H14" {...trazo} />
        <path d="M78 34 H86" {...trazo} />
        <path d="M27 22 L21 16" {...trazo} />
        <path d="M73 22 L79 16" {...trazo} />
      </g>
    </svg>
  )
}
