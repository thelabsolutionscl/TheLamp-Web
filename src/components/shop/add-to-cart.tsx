"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCarrito } from "./cart"
import { CtaBoton } from "@/components/ui/cta-button"
import { cn } from "@/lib/utils"
import type { Producto } from "@/data/products"

/** Selector de color y cantidad + botón de agregar, para la ficha de producto. */
export function AddToCart({
  producto,
  /** Stock real del inventario, no el valor inicial del catálogo. */
  disponible,
}: {
  producto: Producto
  disponible: number
}) {
  const { agregar } = useCarrito()
  const [color, setColor] = useState(producto.colores[0] ?? "Único")
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  const agotado = disponible <= 0
  const tope = Math.min(disponible, 10)

  function onAgregar() {
    agregar(producto.slug, color, cantidad)
    setAgregado(true)
    // Se vuelve al estado normal solo: un "Agregado ✓" permanente confunde
    // cuando el visitante quiere sumar otra unidad.
    window.setTimeout(() => setAgregado(false), 2500)
  }

  if (agotado) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="text-sm font-medium text-white">Agotada por ahora</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          Escríbenos y te avisamos apenas entre stock. Normalmente reponemos en
          dos a tres semanas.
        </p>
        <Link
          href="/contacto"
          className="mt-3 inline-block text-xs font-medium text-[#5badde] underline underline-offset-4 hover:text-[#82c4e9]"
        >
          Avísenme cuando llegue
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {producto.colores.length > 1 && (
        <fieldset>
          <legend className="mb-2.5 text-xs font-medium uppercase tracking-wider text-white/50">
            Color
          </legend>
          <div className="flex flex-wrap gap-2">
            {producto.colores.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-xs transition-all",
                  color === c
                    ? "border-[#5badde] bg-[#5badde]/10 text-white"
                    : "border-white/[0.12] text-white/60 hover:border-white/25 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-lg border border-white/[0.12]">
          <button
            type="button"
            onClick={() => setCantidad((n) => Math.max(1, n - 1))}
            disabled={cantidad <= 1}
            className="p-2.5 text-white/60 transition-colors hover:text-white disabled:opacity-30"
            aria-label="Quitar una unidad"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            className="tabular w-9 text-center text-sm font-medium"
            aria-live="polite"
          >
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad((n) => Math.min(tope, n + 1))}
            disabled={cantidad >= tope}
            className="p-2.5 text-white/60 transition-colors hover:text-white disabled:opacity-30"
            aria-label="Agregar una unidad"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <CtaBoton
          onClick={onAgregar}
          size="lg"
          icon={agregado ? Check : ShoppingBag}
          className="flex-1 min-w-[200px]"
        >
          {agregado ? "Agregado al carrito" : "Agregar al carrito"}
        </CtaBoton>
      </div>

      {disponible <= 5 && (
        <p className="text-xs text-[#ffb454]">
          {disponible === 1 ? "Queda 1 unidad." : `Quedan ${disponible} unidades.`}
        </p>
      )}
    </div>
  )
}
