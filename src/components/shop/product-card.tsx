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

  // Las fotos de Cities tienen composiciones distintas. Copenhagen necesita
  // partir desde arriba para que la base de la lámpara quede alineada con Tokyo
  // dentro de la grilla de la tienda.
  const posicionFoto = producto.slug === "copenhagen" ? "object-top" : "object-center"

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#5badde]/25 hover:shadow-[0_20px_50px_-20px_rgba(91,173,222,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5badde]/50 motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          imagenes={producto.imagenes}
          nombre={producto.nombre}
          coleccion={producto.coleccion}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`${posicionFoto} transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100`}
        />
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
