"use client"

import { useEffect } from "react"
import { CtaBoton } from "@/components/ui/cta-button"
import { whatsappUrl } from "@/lib/whatsapp"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[error]", error)
  }, [error])

  return (
    <div className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-white">Se nos cayó algo</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          No pudimos cargar esta página. Prueba de nuevo; si sigue igual,
          escríbenos y lo vemos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaBoton onClick={reset}>Reintentar</CtaBoton>
          <a
            href={whatsappUrl("Hola, me apareció un error en la web de The Lamp.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-white/[0.14] px-6 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Avisarnos por WhatsApp
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] text-white/25">
            Código: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
