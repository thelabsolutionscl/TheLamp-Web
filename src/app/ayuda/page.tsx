import type { Metadata } from "next"
import { CtaButton } from "@/components/ui/cta-button"
import { faq } from "@/data/faq"
import { zonas } from "@/data/shipping"
import { site } from "@/data/site"
import { clp } from "@/lib/format"
import { whatsappUrl } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Ayuda",
  description:
    "Despacho, plazos, garantía, cambios y devoluciones de The Lamp. Respuestas a las preguntas más frecuentes sobre nuestras lámparas con luz inteligente.",
  alternates: { canonical: "/ayuda" },
}

// Datos estructurados de FAQ: es lo que hace que Google despliegue las
// preguntas directo en el resultado de búsqueda.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.pregunta,
    acceptedAnswer: { "@type": "Answer", text: f.respuesta },
  })),
}

export default function Ayuda() {
  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Ayuda</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Todo lo que suelen preguntarnos antes y después de comprar. Si te
          queda una duda, escríbenos por WhatsApp: contestamos el mismo día
          hábil.
        </p>

        {/* ── Despacho ────────────────────────────────────────────────── */}
        <section id="despacho" className="mt-14 scroll-mt-24">
          <h2 className="text-xl font-bold text-white">Despacho y plazos</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Despachamos a todo Chile. El costo se calcula por zona y aparece en
            el checkout antes de pagar. Sobre {clp(site.despachoGratisDesde)} el
            despacho va liberado.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.1] text-left">
                  <th className="pb-3 font-medium text-white/45">Zona</th>
                  <th className="pb-3 font-medium text-white/45">Costo</th>
                  <th className="pb-3 font-medium text-white/45">Plazo</th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((z) => (
                  <tr key={z.id} className="border-b border-white/[0.06]">
                    <td className="py-3 pr-4 text-white/80">{z.nombre}</td>
                    <td className="tabular py-3 pr-4 text-white/60">
                      {z.costo === 0 ? "Sin costo" : clp(z.costo)}
                    </td>
                    <td className="py-3 text-white/60">{z.plazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Los plazos se cuentan en días hábiles desde que confirmamos el pago.
            Para Isla de Pascua y Juan Fernández cotizamos aparte: escríbenos
            antes de comprar.
          </p>
        </section>

        {/* ── Devoluciones ────────────────────────────────────────────── */}
        <section id="devoluciones" className="mt-14 scroll-mt-24">
          <h2 className="text-xl font-bold text-white">Cambios y devoluciones</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-white/60">
            <p>
              Tienes 10 días corridos desde que recibes la lámpara para pedir un
              cambio o una devolución, siempre que venga en su caja original y
              sin uso.
            </p>
            <p>
              Si el producto llegó fallado o no es el que pediste, el despacho de
              vuelta lo pagamos nosotros y te reponemos o devolvemos el total.
              Si simplemente no te gustó, el costo del envío de vuelta corre por
              tu cuenta.
            </p>
            <p>
              La garantía por falla de fabricación es de {site.garantiaMeses}{" "}
              meses. No cubre daños por caída, humedad ni conexión a un voltaje
              distinto de 220V.
            </p>
            <p>
              Para iniciar cualquiera de los dos, escríbenos con tu número de
              pedido.
            </p>
          </div>
        </section>

        {/* ── Preguntas ───────────────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-white">Preguntas frecuentes</h2>
          <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {faq.map((f) => (
              <div key={f.pregunta} className="py-5">
                <dt className="font-[family-name:var(--font-heading)] text-sm font-semibold text-white">
                  {f.pregunta}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/55">
                  {f.respuesta}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <CtaButton href={whatsappUrl()} external>
            Escribirnos por WhatsApp
          </CtaButton>
          <CtaButton href="/contacto" variant="secondary" arrow>
            Mandarnos un mensaje
          </CtaButton>
        </div>
      </div>
    </div>
  )
}
