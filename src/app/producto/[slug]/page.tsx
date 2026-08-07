import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ChevronRight, Truck, ShieldCheck, MessageCircle } from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"
import { ProductCard } from "@/components/shop/product-card"
import { AddToCart } from "@/components/shop/add-to-cart"
import {
  colecciones,
  obtenerProducto,
  productos,
  type Producto,
} from "@/data/products"
import { site } from "@/data/site"
import { clp, desglosarIva } from "@/lib/format"
import { whatsappProducto } from "@/lib/whatsapp"

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const producto = obtenerProducto(slug)
  if (!producto) return {}
  return {
    title: `${producto.nombre} · ${producto.tagline}`,
    description: producto.descripcion,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      title: `${producto.nombre} · ${site.nombre}`,
      description: producto.descripcion,
      type: "website",
    },
  }
}

/** Datos estructurados de producto: es lo que hace que Google muestre el
 *  precio y la disponibilidad en el resultado de búsqueda. */
function jsonLdProducto(producto: Producto) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    brand: { "@type": "Brand", name: site.nombre },
    category: colecciones.find((c) => c.id === producto.coleccion)?.nombre,
    color: producto.colores.join(", "),
    weight: {
      "@type": "QuantitativeValue",
      value: producto.pesoKg,
      unitCode: "KGM",
    },
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${producto.slug}`,
      priceCurrency: "CLP",
      price: producto.precio,
      availability:
        producto.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.nombre },
    },
  }
}

export default async function FichaProducto({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const producto = obtenerProducto(slug)
  if (!producto) notFound()

  const { neto, iva } = desglosarIva(producto.precio)
  const coleccion = colecciones.find((c) => c.id === producto.coleccion)
  const relacionados = productos
    .filter((p) => p.slug !== producto.slug && p.coleccion === producto.coleccion)
    .concat(productos.filter((p) => p.slug !== producto.slug))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3)

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProducto(producto)) }}
      />

      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Miga de pan" className="mb-8 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/tienda" className="transition-colors hover:text-white">
            Tienda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/tienda?coleccion=${producto.coleccion}`}
            className="transition-colors hover:text-white"
          >
            {coleccion?.nombre}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/60">{producto.nombre}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Galería ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111]">
              <ProductImage
                imagenes={producto.imagenes}
                nombre={producto.nombre}
                coleccion={producto.coleccion}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {producto.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {producto.imagenes.slice(1, 5).map((img, i) => (
                  <div
                    key={img.src}
                    className="relative aspect-square overflow-hidden rounded-lg border border-white/[0.07] bg-[#111111]"
                  >
                    <ProductImage
                      imagenes={producto.imagenes}
                      indice={i + 1}
                      nombre={producto.nombre}
                      coleccion={producto.coleccion}
                      sizes="20vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Compra ──────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {producto.nombre}
            </h1>
            <p className="mt-2 text-sm text-white/55">{producto.tagline}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="tabular text-2xl font-semibold text-white">
                {clp(producto.precio)}
              </span>
              {producto.precioAntes && producto.precioAntes > producto.precio && (
                <span className="tabular text-sm text-white/35 line-through">
                  {clp(producto.precioAntes)}
                </span>
              )}
            </div>
            <p className="tabular mt-1 text-xs text-white/40">
              Neto {clp(neto)} + IVA {clp(iva)}
            </p>

            <p className="mt-6 text-sm leading-relaxed text-white/65">
              {producto.descripcion}
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {producto.caracteristicas.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb454]" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <AddToCart producto={producto} />
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-xs text-white/50">
              <span className="inline-flex items-center gap-2.5">
                <Truck className="h-4 w-4 shrink-0 text-white/40" />
                Despacho a todo Chile, liberado sobre{" "}
                {clp(site.despachoGratisDesde)}
              </span>
              <span className="inline-flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-white/40" />
                {site.garantiaMeses} meses de garantía y 10 días para cambio o
                devolución
              </span>
              <a
                href={whatsappProducto(producto.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2.5 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-white/40" />
                ¿Dudas antes de comprar? Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Especificaciones ──────────────────────────────────────── */}
        <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-xl font-bold text-white">Especificaciones</h2>
            <dl className="mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {producto.especificaciones.map((e) => (
                <div key={e.label} className="flex justify-between gap-6 py-3">
                  <dt className="text-sm text-white/45">{e.label}</dt>
                  <dd className="text-right text-sm text-white/80">{e.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Medidas y despacho</h2>
            <dl className="mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-white/45">Alto</dt>
                <dd className="tabular text-sm text-white/80">
                  {producto.medidas.alto} cm
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-white/45">Ancho</dt>
                <dd className="tabular text-sm text-white/80">
                  {producto.medidas.ancho} cm
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-white/45">Profundidad</dt>
                <dd className="tabular text-sm text-white/80">
                  {producto.medidas.profundidad} cm
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-white/45">Peso con embalaje</dt>
                <dd className="tabular text-sm text-white/80">
                  {producto.pesoKg} kg
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-white/45">Colores</dt>
                <dd className="text-right text-sm text-white/80">
                  {producto.colores.join(" · ")}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ── Relacionados ──────────────────────────────────────────── */}
        {relacionados.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-bold text-white">También te puede servir</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((p) => (
                <ProductCard key={p.slug} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
