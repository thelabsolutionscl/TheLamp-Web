"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Lock } from "lucide-react"
import { useCarrito } from "@/components/shop/cart"
import { CtaBoton } from "@/components/ui/cta-button"
import { iniciarPago, type EstadoCheckout } from "@/app/actions/checkout"
import { regiones, zonas, obtenerZona } from "@/data/shipping"
import { site } from "@/data/site"
import { clp, desglosarIva } from "@/lib/format"
import { formatearRut } from "@/lib/rut"
import { cn } from "@/lib/utils"

const inicial: EstadoCheckout = { estado: "inicial" }

const campo =
  "w-full rounded-lg border border-white/[0.12] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-[#ffb454]/60 focus:outline-none focus:ring-1 focus:ring-[#ffb454]/40"
const etiqueta = "mb-1.5 block text-xs font-medium text-white/60"

export default function Checkout() {
  const router = useRouter()
  const { items, lineas, subtotal, listo } = useCarrito()
  const [estado, accion, enviando] = useActionState(iniciarPago, inicial)

  const [region, setRegion] = useState("")
  const [retiro, setRetiro] = useState(false)
  const [rut, setRut] = useState("")

  // Si el carrito quedó vacío (por ejemplo, al volver atrás después de pagar)
  // no tiene sentido mostrar el formulario.
  useEffect(() => {
    if (listo && lineas.length === 0) router.replace("/carrito")
  }, [listo, lineas.length, router])

  const zonaId = retiro
    ? "retiro"
    : (regiones.find((r) => r.nombre === region)?.zonaId ?? "")
  const zona = obtenerZona(zonaId)

  const { costoDespacho, total, neto, iva } = useMemo(() => {
    const liberado = subtotal >= site.despachoGratisDesde
    const costo = !zona ? 0 : liberado ? 0 : zona.costo
    const t = subtotal + costo
    const d = desglosarIva(t)
    return { costoDespacho: costo, total: t, neto: d.neto, iva: d.iva }
  }, [subtotal, zona])

  if (!listo || lineas.length === 0) {
    return (
      <div className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-8 w-56 animate-pulse rounded bg-white/[0.06]" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Finalizar compra</h1>
        <p className="mt-2 text-sm text-white/50">
          Pagas con tarjeta de crédito, débito o transferencia a través de Flow.
        </p>

        <form action={accion} className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* El carrito viaja como JSON. El servidor solo lee slug, color y
              cantidad, y recalcula los precios desde su propio catálogo. */}
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <input type="hidden" name="zonaId" value={zonaId} />
          {/* Honeypot para bots. Invisible y fuera del orden de tabulación. */}
          <input
            type="text"
            name="empresa_web"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <div className="flex flex-col gap-8">
            <fieldset>
              <legend className="mb-4 font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                Tus datos
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nombre" className={etiqueta}>
                    Nombre y apellido
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    required
                    autoComplete="name"
                    className={campo}
                    placeholder="Camila Rojas"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={etiqueta}>
                    Correo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={campo}
                    placeholder="camila@correo.cl"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className={etiqueta}>
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    autoComplete="tel"
                    className={campo}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rut" className={etiqueta}>
                    RUT <span className="text-white/35">— para la boleta</span>
                  </label>
                  <input
                    id="rut"
                    name="rut"
                    required
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    onBlur={(e) => setRut(formatearRut(e.target.value))}
                    className={campo}
                    placeholder="12.345.678-9"
                    inputMode="text"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                Entrega
              </legend>

              <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.1] bg-white/[0.02] p-4">
                <input
                  type="checkbox"
                  checked={retiro}
                  onChange={(e) => setRetiro(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#ffb454]"
                />
                <span>
                  <span className="block text-sm text-white">
                    Prefiero retirar en el taller
                  </span>
                  <span className="mt-0.5 block text-xs text-white/50">
                    {site.direccion.calle}, {site.direccion.comuna}. Sin costo de
                    despacho, coordinamos por WhatsApp.
                  </span>
                </span>
              </label>

              {!retiro && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="region" className={etiqueta}>
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={cn(campo, "appearance-none")}
                    >
                      <option value="">Elige tu región</option>
                      {regiones.map((r) => (
                        <option key={r.nombre} value={r.nombre}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comuna" className={etiqueta}>
                      Comuna
                    </label>
                    <input
                      id="comuna"
                      name="comuna"
                      required
                      autoComplete="address-level2"
                      className={campo}
                      placeholder="Ñuñoa"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="direccion" className={etiqueta}>
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      required
                      autoComplete="street-address"
                      className={campo}
                      placeholder="Av. Irarrázaval 1234, depto 502"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="referencia" className={etiqueta}>
                      Referencia{" "}
                      <span className="text-white/35">— opcional</span>
                    </label>
                    <input
                      id="referencia"
                      name="referencia"
                      className={campo}
                      placeholder="Conserjería recibe hasta las 20:00"
                    />
                  </div>
                </div>
              )}

              {zona && (
                <p className="mt-4 text-xs text-white/45">
                  {zona.nombre} · {zona.plazo}
                </p>
              )}
            </fieldset>
          </div>

          {/* ── Resumen y pago ──────────────────────────────────────── */}
          <aside className="h-fit rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-white">
              Tu pedido
            </h2>

            <ul className="mt-5 flex flex-col gap-3 border-b border-white/[0.07] pb-5">
              {lineas.map((l) => (
                <li
                  key={`${l.slug}-${l.color}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-white/65">
                    {l.cantidad} × {l.producto.nombre}
                    {l.color && (
                      <span className="block text-xs text-white/35">{l.color}</span>
                    )}
                  </span>
                  <span className="tabular shrink-0 text-white/80">
                    {clp(l.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-white/55">
                <dt>Productos</dt>
                <dd className="tabular">{clp(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-white/55">
                <dt>Despacho</dt>
                <dd className="tabular text-right">
                  {!zona ? (
                    <span className="text-xs">Elige tu región</span>
                  ) : costoDespacho === 0 ? (
                    "Liberado"
                  ) : (
                    clp(costoDespacho)
                  )}
                </dd>
              </div>
              <div className="flex justify-between text-white/40 text-xs">
                <dt>Neto</dt>
                <dd className="tabular">{clp(neto)}</dd>
              </div>
              <div className="flex justify-between text-white/40 text-xs">
                <dt>IVA 19%</dt>
                <dd className="tabular">{clp(iva)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-white/[0.07] pt-3 text-base font-semibold text-white">
                <dt>Total</dt>
                <dd className="tabular">{clp(total)}</dd>
              </div>
            </dl>

            {estado.estado === "error" && estado.mensaje && (
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-lg bg-[#ff4444]/[0.1] px-3.5 py-3 text-xs leading-relaxed text-[#ff8a8a]"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {estado.mensaje}
              </p>
            )}

            <CtaBoton
              type="submit"
              size="lg"
              className="mt-5 w-full"
              disabled={enviando || !zona}
              icon={Lock}
            >
              {enviando ? "Conectando con Flow…" : `Pagar ${clp(total)}`}
            </CtaBoton>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/35">
              Te llevamos a Flow para completar el pago. Nosotros no vemos ni
              guardamos los datos de tu tarjeta.
            </p>

            <Link
              href="/carrito"
              className="mt-4 block text-center text-xs text-white/45 transition-colors hover:text-white"
            >
              Volver al carrito
            </Link>
          </aside>
        </form>

        <p className="mt-10 text-xs text-white/35">
          Al pagar aceptas los{" "}
          <Link href="/terminos" className="underline underline-offset-4 hover:text-white">
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link href="/privacidad" className="underline underline-offset-4 hover:text-white">
            política de privacidad
          </Link>
          . Zonas y plazos de despacho:{" "}
          {zonas
            .filter((z) => z.id !== "retiro")
            .map((z) => `${z.nombre} ${clp(z.costo)}`)
            .join(" · ")}
          .
        </p>
      </div>
    </div>
  )
}
