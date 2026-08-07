"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCarrito } from "@/components/shop/cart"
import { ProductImage } from "@/components/ui/product-image"
import { CtaButton } from "@/components/ui/cta-button"
import { clp, desglosarIva } from "@/lib/format"
import { site } from "@/data/site"

export default function Carrito() {
  const { lineas, subtotal, unidades, listo, cambiarCantidad, quitar } = useCarrito()
  const { neto, iva } = desglosarIva(subtotal)
  const faltaParaDespachoGratis = site.despachoGratisDesde - subtotal

  // Antes de leer localStorage no sabemos si el carrito tiene algo. Mostrar
  // "está vacío" acá sería mentir por medio segundo.
  if (!listo) {
    return (
      <div className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-8 w-48 animate-pulse rounded bg-white/[0.06]" />
        </div>
      </div>
    )
  }

  if (lineas.length === 0) {
    return (
      <div className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-white/25" />
          <h1 className="mt-5 text-2xl font-bold text-white">
            Tu carrito está vacío
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Mira las lámparas y agrega la que te haga sentido. El carrito se
            queda guardado en este navegador.
          </p>
          <CtaButton href="/tienda" className="mt-8" arrow>
            Ver las lámparas
          </CtaButton>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Tu carrito</h1>
        <p className="mt-2 text-sm text-white/50">
          {unidades} {unidades === 1 ? "producto" : "productos"}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {lineas.map((l) => (
              <li key={`${l.slug}-${l.color}`} className="flex gap-4 py-5 sm:gap-6">
                <Link
                  href={`/producto/${l.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-[#111111] sm:h-28 sm:w-24"
                >
                  <ProductImage
                    imagenes={l.producto.imagenes}
                    nombre={l.producto.nombre}
                    coleccion={l.producto.coleccion}
                    sizes="96px"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/producto/${l.slug}`}
                    className="font-[family-name:var(--font-heading)] text-sm font-semibold text-white transition-colors hover:text-[#ffb454]"
                  >
                    {l.producto.nombre}
                  </Link>
                  {l.color && (
                    <span className="text-xs text-white/45">{l.color}</span>
                  )}
                  <span className="tabular text-xs text-white/45">
                    {clp(l.producto.precio)} c/u
                  </span>

                  <div className="mt-auto flex items-center gap-3 pt-3">
                    <div className="inline-flex items-center rounded-lg border border-white/[0.12]">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(l.slug, l.color, l.cantidad - 1)
                        }
                        className="p-2 text-white/60 transition-colors hover:text-white"
                        aria-label={`Quitar una unidad de ${l.producto.nombre}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="tabular w-8 text-center text-sm">
                        {l.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(l.slug, l.color, l.cantidad + 1)
                        }
                        disabled={l.cantidad >= l.producto.stock}
                        className="p-2 text-white/60 transition-colors hover:text-white disabled:opacity-30"
                        aria-label={`Agregar una unidad de ${l.producto.nombre}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitar(l.slug, l.color)}
                      className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-[#ff4444]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Quitar
                    </button>
                  </div>
                </div>

                <span className="tabular shrink-0 text-sm font-semibold text-white">
                  {clp(l.subtotal)}
                </span>
              </li>
            ))}
          </ul>

          {/* ── Resumen ─────────────────────────────────────────────── */}
          <aside className="h-fit rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-white">
              Resumen
            </h2>

            <dl className="mt-5 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-white/55">
                <dt>Neto</dt>
                <dd className="tabular">{clp(neto)}</dd>
              </div>
              <div className="flex justify-between text-white/55">
                <dt>IVA 19%</dt>
                <dd className="tabular">{clp(iva)}</dd>
              </div>
              <div className="flex justify-between text-white/55">
                <dt>Despacho</dt>
                <dd className="text-right text-xs">Se calcula al pagar</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-white/[0.07] pt-3 text-base font-semibold text-white">
                <dt>Subtotal</dt>
                <dd className="tabular">{clp(subtotal)}</dd>
              </div>
            </dl>

            {faltaParaDespachoGratis > 0 ? (
              <p className="mt-4 rounded-lg bg-[#ffb454]/[0.08] px-3.5 py-3 text-xs leading-relaxed text-[#ffb454]">
                Te faltan {clp(faltaParaDespachoGratis)} para el despacho
                liberado.
              </p>
            ) : (
              <p className="mt-4 rounded-lg bg-[#3ddc97]/[0.08] px-3.5 py-3 text-xs leading-relaxed text-[#3ddc97]">
                Tu despacho va liberado.
              </p>
            )}

            <CtaButton href="/checkout" size="lg" className="mt-5 w-full" arrow>
              Ir a pagar
            </CtaButton>

            <Link
              href="/tienda"
              className="mt-4 block text-center text-xs text-white/45 transition-colors hover:text-white"
            >
              Seguir viendo lámparas
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
