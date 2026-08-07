import Link from "next/link"
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import { Logo } from "./Logo"
import { site } from "@/data/site"
import { colecciones } from "@/data/products"
import { whatsappUrl } from "@/lib/whatsapp"

const ayuda = [
  { label: "Despacho y devoluciones", href: "/ayuda#despacho" },
  { label: "Preguntas frecuentes", href: "/ayuda" },
  { label: "Luz inteligente", href: "/luz-inteligente" },
  { label: "Contacto", href: "/contacto" },
]

const legales = [
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] pb-8 pt-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo alto={24} className="self-start" />
            <p className="max-w-[28ch] text-xs leading-relaxed text-white/55">
              Lámparas de diseño con luz inteligente. Despachamos a todo Chile.
            </p>
            <div className="mt-2 flex flex-col gap-2.5">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                {site.email}
              </a>
              <span className="inline-flex items-start gap-2 text-xs text-white/55">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {site.direccion.calle}, {site.direccion.comuna}, Santiago
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-white/55">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {site.horario}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              Tienda
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/tienda"
                  className="text-xs text-white/55 transition-colors hover:text-white"
                >
                  Todas las lámparas
                </Link>
              </li>
              {colecciones.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tienda?coleccion=${c.id}`}
                    className="text-xs text-white/55 transition-colors hover:text-white"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              Ayuda
            </p>
            <ul className="flex flex-col gap-2.5">
              {ayuda.map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="text-xs text-white/55 transition-colors hover:text-white"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              {legales.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/55 transition-colors hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nombre} · {site.empresa.razonSocial} ·
            RUT {site.empresa.rut}
          </p>
          <p>
            Una marca de{" "}
            <a
              href={site.empresa.matrizUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 transition-colors hover:text-[#ffb454]"
            >
              {site.empresa.matriz}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
