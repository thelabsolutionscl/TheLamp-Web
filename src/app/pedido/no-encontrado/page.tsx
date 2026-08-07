import type { Metadata } from "next"
import { HelpCircle } from "lucide-react"
import { CtaButton } from "@/components/ui/cta-button"
import { whatsappUrl } from "@/lib/whatsapp"
import { site } from "@/data/site"

export const metadata: Metadata = {
  title: "No encontramos tu pedido",
  robots: { index: false, follow: false },
}

export default function PedidoNoEncontrado() {
  return (
    <div className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-md text-center">
        <HelpCircle className="mx-auto h-9 w-9 text-white/30" />
        <h1 className="mt-5 text-2xl font-bold text-white">
          No encontramos tu pedido
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Puede que el pago no se haya completado, o que el enlace esté
          incompleto. Si te llegó el cobro, escríbenos con tu correo y lo
          revisamos al tiro — no vas a perder tu compra.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaButton
            href={whatsappUrl("Hola, pagué un pedido pero no encuentro el detalle.")}
            external
          >
            Escribirnos por WhatsApp
          </CtaButton>
          <CtaButton href={`mailto:${site.email}`} variant="secondary">
            Escribir por correo
          </CtaButton>
        </div>
      </div>
    </div>
  )
}
