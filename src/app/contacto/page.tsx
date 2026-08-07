"use client"

import { useActionState } from "react"
import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, MessageCircle } from "lucide-react"
import { CtaBoton } from "@/components/ui/cta-button"
import { enviarContacto, type EstadoContacto } from "@/app/actions/contacto"
import { site } from "@/data/site"
import { whatsappUrl } from "@/lib/whatsapp"

const inicial: EstadoContacto = { estado: "inicial" }

const campo =
  "w-full rounded-lg border border-white/[0.12] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-[#5badde]/60 focus:outline-none focus:ring-1 focus:ring-[#5badde]/40"
const etiqueta = "mb-1.5 block text-xs font-medium text-white/60"

export default function Contacto() {
  const [estado, accion, enviando] = useActionState(enviarContacto, inicial)

  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Contacto</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Dudas antes de comprar, consultas por un pedido o proyectos de
            iluminación para locales y oficinas. Contestamos el mismo día hábil.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-sm">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white/65 transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#5badde]" />
              WhatsApp — la vía más rápida
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-3 text-white/65 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#5badde]" />
              {site.email}
            </a>
            <span className="inline-flex items-start gap-3 text-white/55">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5badde]" />
              {site.direccion.calle}, {site.direccion.comuna}, Santiago
            </span>
            <span className="inline-flex items-center gap-3 text-white/55">
              <Clock className="h-4 w-4 shrink-0 text-[#5badde]" />
              {site.horario}
            </span>
          </div>
        </div>

        <form action={accion} className="flex flex-col gap-4">
          <input
            type="text"
            name="empresa_web"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <div>
            <label htmlFor="nombre" className={etiqueta}>
              Nombre
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
            <label htmlFor="mensaje" className={etiqueta}>
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              required
              rows={6}
              className={campo}
              placeholder="Cuéntanos qué necesitas."
            />
          </div>

          {estado.estado !== "inicial" && estado.mensaje && (
            <p
              role="status"
              className={`flex items-start gap-2 rounded-lg px-3.5 py-3 text-xs leading-relaxed ${
                estado.estado === "ok"
                  ? "bg-[#3ddc97]/[0.1] text-[#3ddc97]"
                  : "bg-[#ff4444]/[0.1] text-[#ff8a8a]"
              }`}
            >
              {estado.estado === "ok" ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              {estado.mensaje}
            </p>
          )}

          <CtaBoton type="submit" disabled={enviando} className="mt-2 self-start">
            {enviando ? "Enviando…" : "Enviar mensaje"}
          </CtaBoton>
        </form>
      </div>
    </div>
  )
}
