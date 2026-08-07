import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { ClearCart } from "@/components/shop/clear-cart"
import { CtaButton } from "@/components/ui/cta-button"
import { obtenerPedido, type Pedido } from "@/lib/orders"
import { clp, fechaCL } from "@/lib/format"
import { whatsappUrl } from "@/lib/whatsapp"
import { site } from "@/data/site"

// El pedido vive en KV y cambia de estado con el webhook: nunca se cachea.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
}

const presentacion: Record<
  Pedido["estado"],
  { icono: typeof CheckCircle2; color: string; titulo: string; texto: string }
> = {
  pagado: {
    icono: CheckCircle2,
    color: "#3ddc97",
    titulo: "¡Listo, tu pago se confirmó!",
    texto:
      "Te mandamos la confirmación al correo. Preparamos el pedido y te avisamos apenas salga el envío.",
  },
  pendiente: {
    icono: Clock,
    // Ámbar de aviso, no el acento de marca: acá comunica "espera".
    color: "#ffb454",
    titulo: "Estamos confirmando tu pago",
    texto:
      "Flow todavía no nos confirma la transacción. Suele tardar menos de un minuto: refresca esta página en un rato. Si pagaste por transferencia, puede tomar más.",
  },
  rechazado: {
    icono: XCircle,
    color: "#ff4444",
    titulo: "El pago fue rechazado",
    texto:
      "Tu banco no autorizó la transacción. No te cobramos nada. Puedes intentar con otra tarjeta o escribirnos y lo vemos juntos.",
  },
  anulado: {
    icono: XCircle,
    color: "#ff4444",
    titulo: "El pago se anuló",
    texto:
      "La transacción quedó anulada y no se hizo ningún cobro. Si fue un error, puedes volver a intentarlo.",
  },
}

export default async function EstadoPedido({
  params,
}: {
  params: Promise<{ numero: string }>
}) {
  const { numero } = await params
  const pedido = await obtenerPedido(numero)
  if (!pedido) notFound()

  const p = presentacion[pedido.estado]
  const Icono = p.icono

  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      {pedido.estado === "pagado" && <ClearCart />}

      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Icono className="mx-auto h-10 w-10" style={{ color: p.color }} />
          <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            {p.titulo}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
            {p.texto}
          </p>
          <p className="tabular mt-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.15em] text-white/40">
            Pedido {pedido.numero} · {fechaCL(pedido.creado)}
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
          <ul className="flex flex-col gap-3 border-b border-white/[0.07] pb-5">
            {pedido.items.map((l) => (
              <li
                key={`${l.slug}-${l.color}`}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-white/65">
                  {l.cantidad} × {l.nombre}
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
              <dd className="tabular">{clp(pedido.totales.productos)}</dd>
            </div>
            <div className="flex justify-between text-white/55">
              <dt>Despacho — {pedido.despacho.zonaNombre}</dt>
              <dd className="tabular">
                {pedido.totales.despacho === 0
                  ? "Liberado"
                  : clp(pedido.totales.despacho)}
              </dd>
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <dt>Neto</dt>
              <dd className="tabular">{clp(pedido.totales.neto)}</dd>
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <dt>IVA 19%</dt>
              <dd className="tabular">{clp(pedido.totales.iva)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/[0.07] pt-3 text-base font-semibold text-white">
              <dt>Total</dt>
              <dd className="tabular">{clp(pedido.totales.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-white/55">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/45">
              {pedido.despacho.zonaId === "retiro" ? "Retiro" : "Despacho"}
            </p>
            <p>{pedido.cliente.nombre}</p>
            <p>{pedido.despacho.direccion}</p>
            {pedido.despacho.zonaId !== "retiro" && (
              <p>
                {pedido.despacho.comuna}, {pedido.despacho.region}
              </p>
            )}
            {pedido.despacho.referencia && <p>{pedido.despacho.referencia}</p>}
            <p className="mt-2 text-xs text-white/40">
              Plazo estimado: {pedido.despacho.plazo}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {pedido.estado === "pagado" ? (
            <CtaButton href="/tienda" variant="secondary" arrow>
              Seguir viendo lámparas
            </CtaButton>
          ) : pedido.estado === "pendiente" ? (
            <CtaButton href={`/pedido/${pedido.numero}`}>
              Actualizar estado
            </CtaButton>
          ) : (
            <CtaButton href="/tienda" arrow>
              Volver a intentar
            </CtaButton>
          )}
          <CtaButton
            href={whatsappUrl(`Hola, consulto por mi pedido ${pedido.numero}.`)}
            external
            variant="secondary"
          >
            Escribirnos por WhatsApp
          </CtaButton>
        </div>

        <p className="mt-8 text-center text-xs text-white/35">
          Guarda este número. Con él puedes consultarnos por tu pedido en
          cualquier momento, o escribirnos a{" "}
          <Link
            href={`mailto:${site.email}`}
            className="underline underline-offset-4 hover:text-white"
          >
            {site.email}
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
