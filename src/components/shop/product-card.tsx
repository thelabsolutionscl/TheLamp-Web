import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"
import { clp } from "@/lib/format"
import type { Producto } from "@/data/products"

export function ProductCard({
  producto,
  /** Stock real del inventario. El del catálogo es solo el valor inicial. */
  disponible,
  priority = false,
}: {
  producto: Producto
  disponible: number
  priority?: boolean
}) {
  const agotado = disponible <= 0
  const enOferta = producto.precioAntes && producto.precioAntes > producto.precio

  const esCities = ["tokyo", "copenhagen", "zurich"].includes(producto.slug)

  // Las fotos de Cities tienen márgenes internos distintos. En vez de intentar
  // compensarlos solo con object-position, desplazamos el lienzo de cada foto
  // dentro del mismo marco. Tokyo funciona como línea de referencia.
  const encuadreCities: Record<
    string,
    { top: string; bottom: string; translateY: string }
  > = {
    tokyo: { top: "0%", bottom: "0%", translateY: "0%" },
    copenhagen: { top: "-12%", bottom: "-12%", translateY: "10%" },
    zurich: { top: "-9%", bottom: "-9%", translateY: "7%" },
  }

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#5badde]/25 hover:shadow-[0_20px_50px_-20px_rgba(91,173,222,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5badde]/50 motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {esCities && producto.imagenes[0] ? (
          <div
            className="absolute inset-x-0 overflow-hidden"
            style={{
              top: encuadreCities[producto.slug].top,
              bottom: encuadreCities[producto.slug].bottom,
              transform: `translateY(${encuadreCities[producto.slug].translateY})`,
            }}
          >
            <img
              src={producto.imagenes[0].src}
              alt={producto.imagenes[0].alt}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              loading={priority ? "eager" : "lazy"}
            />
          </div>
        ) : (
          <ProductImage
            imagenes={producto.imagenes}
            nombre={producto.nombre}
            coleccion={producto.coleccion}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-center transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        )}

        {agotado && (
          <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
            Agotado
          </span>
        )}
        {!agotado && enOferta && (
          <span className="absolute left-3 top-3 rounded-full bg-[#5badde] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0a0a0a]">
            Oferta
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-white">
          {producto.nombre}
        </h3>
        <p className="text-xs leading-relaxed text-white/50">{producto.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="tabular text-sm font-semibold text-white">
            {clp(producto.precio)}
          </span>
          {enOferta && (
            <span className="tabular text-xs text-white/35 line-through">
              {clp(producto.precioAntes!)}
            </span>
          )}
        </div>
        <span className="mt-0.5 text-[11px] text-white/35">IVA incluido</span>
      </div>
    </Link>
  )
}
