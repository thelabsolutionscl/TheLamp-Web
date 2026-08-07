import type { Metadata } from "next"
import { Wifi, Smartphone, Mic, Timer, Palette, Users } from "lucide-react"
import { CtaButton } from "@/components/ui/cta-button"

export const metadata: Metadata = {
  title: "Luz inteligente",
  description:
    "Cómo funciona la domótica de las lámparas The Lamp: conexión Wi-Fi sin hub, control desde la app y compatibilidad con Google Home y Alexa.",
  alternates: { canonical: "/luz-inteligente" },
}

const pasos = [
  {
    icono: Wifi,
    titulo: "1. La enchufas",
    texto:
      "La lámpara enciende y queda esperando. No hay que instalar un hub, un puente ni un enchufe especial: se conecta directo a tu Wi-Fi de 2,4 GHz.",
  },
  {
    icono: Smartphone,
    titulo: "2. La emparejas desde la app",
    texto:
      "Abres la app, ella detecta la lámpara y le pasas la clave de tu Wi-Fi. Toma menos de dos minutos y es una sola vez.",
  },
  {
    icono: Mic,
    titulo: "3. La vinculas con tu asistente",
    texto:
      "Desde Google Home o Alexa agregas la lámpara y le pones el nombre que quieras. Desde ahí funciona por voz: “apaga la luz del living”.",
  },
]

const capacidades = [
  {
    icono: Palette,
    titulo: "Temperatura de color",
    texto:
      "De 2200K a 6500K. Cálida de noche para no cortar el sueño, fría de día para trabajar. Se cambia con un deslizador.",
  },
  {
    icono: Timer,
    titulo: "Horarios y escenas",
    texto:
      "Que se encienda al 20% a las 7 de la mañana y suba de a poco. Que a las 19:00 pase a luz cálida. Se configura una vez y se olvida.",
  },
  {
    icono: Users,
    titulo: "Varias personas",
    texto:
      "Puedes compartir el control con quien vive contigo, cada uno desde su celular, sin pasarte la clave del Wi-Fi.",
  },
]

export default function LuzInteligente() {
  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-2xl">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#5badde]">
            Domótica sin complicaciones
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Luz inteligente que no te hace estudiar un manual
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Todas las lámparas de The Lamp se controlan desde el celular y
            funcionan con Google Home y Alexa. No necesitas comprar nada más ni
            cambiar la instalación eléctrica de tu casa.
          </p>
        </header>

        <section className="mt-14">
          <h2 className="text-xl font-bold text-white">Cómo se configura</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {pasos.map((p) => (
              <div
                key={p.titulo}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <p.icono className="h-5 w-5 text-[#5badde]" />
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-bold text-white">Qué puedes hacer</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {capacidades.map((c) => (
              <div
                key={c.titulo}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <c.icono className="h-5 w-5 text-[#5badde]" />
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-base font-semibold text-white">
                  {c.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {c.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10">
          <h2 className="text-xl font-bold text-white">Lo que hay que saber</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-white">
                Necesitas Wi-Fi de 2,4 GHz
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                Casi todos los routers en Chile la tienen activa junto con la de
                5 GHz. Si el tuyo separa las redes, conecta la lámpara a la de
                2,4 GHz.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-white">
                Sin internet igual funciona
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                Pierdes el control por app y por voz, pero la lámpara enciende
                con su interruptor y conserva la última luz que le dejaste.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-white">
                El interruptor de muro manda
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                Si cortas la luz desde el interruptor, la lámpara queda sin
                energía y no responde por app. Es la única regla que hay que
                recordar.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-white">
                Consume casi nada en reposo
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                Menos de 0,5 W esperando órdenes. En un año eso es menos de lo
                que gasta el cargador del celular enchufado sin uso.
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-14 text-center">
          <CtaButton href="/tienda" size="lg" arrow>
            Ver las lámparas
          </CtaButton>
        </div>
      </div>
    </div>
  )
}
