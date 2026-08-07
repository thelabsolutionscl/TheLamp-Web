import type { Metadata } from "next"
import Link from "next/link"
import { ProductCard } from "@/components/shop/product-card"
import { colecciones, productos, type Coleccion } from "@/data/products"
import { site } from "@/data/site"
import { clp } from "@/lib/format"
import { stockActual } from "@/lib/inventario"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Todas las lámparas de The Lamp: de mesa, colgantes, de muro y de pie. Luz inteligente compatible con Google Home y Alexa. Despacho a todo Chile.",
  alternates: { canonical: "/tienda" },
}

const esColeccion = (v: string | undefined): v is Coleccion =>
  colecciones.some((c) => c.id === v)

export default async function Tienda({
  searchParams,
}: {
  searchParams: Promise<{ coleccion?: string }>
}) {
  const { coleccion } = await searchParams
  const filtro = esColeccion(coleccion) ? coleccion : undefined
  const lista = filtro ? productos.filter((p) => p.coleccion === filtro) : productos
  const activa = colecciones.find((c) => c.id === filtro)
  const stock = await stockActual()

  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {activa ? activa.nombre : "Todas las lámparas"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {activa
              ? activa.descripcion
              : "Todas se atenúan, cambian de temperatura de color y funcionan con Google Home y Alexa."}{" "}
            Despacho liberado sobre {clp(site.despachoGratisDesde)}.
          </p>
        </header>

        <nav
          aria-label="Filtrar por colección"
          className="mt-8 flex flex-wrap gap-2"
        >
          <Link
            href="/tienda"
            aria-current={!filtro ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-all",
              !filtro
                ? "border-[#00d4cc] bg-[#00d4cc]/10 text-white"
                : "border-white/[0.12] text-white/60 hover:border-white/25 hover:text-white"
            )}
          >
            Todas
          </Link>
          {colecciones.map((c) => (
            <Link
              key={c.id}
              href={`/tienda?coleccion=${c.id}`}
              aria-current={filtro === c.id ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-2 text-xs transition-all",
                filtro === c.id
                  ? "border-[#00d4cc] bg-[#00d4cc]/10 text-white"
                  : "border-white/[0.12] text-white/60 hover:border-white/25 hover:text-white"
              )}
            >
              {c.nombre}
            </Link>
          ))}
        </nav>

        {lista.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((p, i) => (
              <ProductCard
                key={p.slug}
                producto={p}
                disponible={stock.get(p.slug) ?? 0}
                priority={i < 3}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-white/50">
            Todavía no hay modelos en esta colección.{" "}
            <Link
              href="/tienda"
              className="text-[#00d4cc] underline underline-offset-4"
            >
              Ver todas las lámparas
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}
