import Link from "next/link"
import {
  Lightbulb,
  Mic,
  Timer,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { CtaButton } from "@/components/ui/cta-button"
import { ProductCard } from "@/components/shop/product-card"
import { colecciones, productosDestacados } from "@/data/products"
import { faq } from "@/data/faq"
import { site } from "@/data/site"
import { clp } from "@/lib/format"
import { stockActual } from "@/lib/inventario"

// La portada se sirve estática y se regenera cada minuto. Así carga rápido y
// el "Agotado" nunca queda más de 60 segundos desfasado. La verdad definitiva
// sobre el stock la tiene el checkout, que consulta el inventario en vivo.
export const revalidate = 60

export default async function Home() {
  const destacados = productosDestacados()
  const stock = await stockActual()

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 lg:px-12 lg:pb-28 lg:pt-28">
        {/* Cono de luz: el sitio no tiene fotos todavía, así que el hero
            construye la atmósfera con CSS en vez de dejar un hueco. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,180,84,0.22) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffb454]/25 bg-[#ffb454]/[0.07] px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#ffb454]">
              <Sparkles className="h-3 w-3" />
              Iluminación de diseño · Chile
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Lámparas que saben
              <br />
              cuándo bajar la luz
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60">
              Diseño minimalista, luz que se atenúa de verdad y control desde el
              celular. Funcionan con Google Home y Alexa, sin hub y sin
              instalación complicada.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <CtaButton href="/tienda" size="lg" arrow>
                Ver las lámparas
              </CtaButton>
              <CtaButton href="/luz-inteligente" size="lg" variant="secondary">
                Cómo funciona
              </CtaButton>
            </div>

            <p className="mt-7 text-xs text-white/40">
              Despacho a todo Chile · Liberado sobre{" "}
              {clp(site.despachoGratisDesde)} · {site.garantiaMeses} meses de
              garantía
            </p>
          </div>
        </div>
      </section>

      {/* ── Los tres argumentos ──────────────────────────────────────── */}
      <section className="reveal px-6 py-12 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-4 sm:grid-cols-3">
          {[
            {
              icon: Lightbulb,
              titulo: "Luz que no encandila",
              texto:
                "CRI 90+ y atenuación continua de 1% a 100%, sin parpadeo. Los colores de tu casa se ven como son.",
            },
            {
              icon: Mic,
              titulo: "Google Home y Alexa",
              texto:
                "Se vincula en un par de minutos desde la app. Sin hub, sin puente, sin comprar nada aparte.",
            },
            {
              icon: Timer,
              titulo: "Rutinas automáticas",
              texto:
                "Luz fría para trabajar, cálida a partir de las 19:00. Lo configuras una vez y se olvida el tema.",
            },
          ].map((b) => (
            <div
              key={b.titulo}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              <b.icon className="h-5 w-5 text-[#ffb454]" />
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                {b.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {b.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Destacados ───────────────────────────────────────────────── */}
      <section className="reveal px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Las más pedidas
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Tres modelos que resuelven el 80% de las casas.
              </p>
            </div>
            <Link
              href="/tienda"
              className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-[#ffb454]"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p, i) => (
              <ProductCard
                key={p.slug}
                producto={p}
                disponible={stock.get(p.slug) ?? 0}
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Colecciones ──────────────────────────────────────────────── */}
      <section className="reveal px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Según dónde la necesites
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colecciones.map((c) => (
              <Link
                key={c.id}
                href={`/tienda?coleccion=${c.id}`}
                className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all hover:border-[#ffb454]/25 hover:bg-white/[0.04]"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                  {c.nombre}
                </h3>
                <p className="mt-1.5 text-sm text-white/50">{c.descripcion}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#ffb454]">
                  Ver modelos
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Garantías ────────────────────────────────────────────────── */}
      <section className="reveal px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1400px] rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                titulo: `${site.garantiaMeses} meses de garantía`,
                texto:
                  "Si falla por fabricación, la retiramos y la reponemos. Sin discusión.",
              },
              {
                icon: Truck,
                titulo: "Despacho a todo Chile",
                texto: `Liberado sobre ${clp(site.despachoGratisDesde)}. En Santiago, entre 2 y 3 días hábiles.`,
              },
              {
                icon: Sparkles,
                titulo: "10 días para arrepentirte",
                texto:
                  "Si no te gustó cómo se ve en tu casa, la cambias o la devuelves.",
              },
            ].map((g) => (
              <div key={g.titulo} className="flex gap-4">
                <g.icon className="h-5 w-5 shrink-0 text-[#ffb454]" />
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-white">
                    {g.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {g.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dudas frecuentes ─────────────────────────────────────────── */}
      <section className="reveal px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Las dudas de siempre
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Si te queda otra, escríbenos por WhatsApp y te respondemos el
              mismo día.
            </p>
            <CtaButton
              href="/ayuda"
              variant="secondary"
              size="sm"
              className="mt-6"
              arrow
            >
              Ver todas las preguntas
            </CtaButton>
          </div>
          <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {faq.slice(0, 4).map((f) => (
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
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────────────────────── */}
      <section className="reveal px-6 py-16 lg:px-12">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl border border-[#ffb454]/20 p-10 text-center sm:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,180,84,0.14) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Elige la tuya y la despachamos esta semana
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55">
              Pagas con tarjeta, Webpay o transferencia. Te llega la boleta al
              correo junto con el seguimiento del envío.
            </p>
            <CtaButton href="/tienda" size="lg" className="mt-8" arrow>
              Ver las lámparas
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  )
}
