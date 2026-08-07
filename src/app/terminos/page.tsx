import type { Metadata } from "next"
import Link from "next/link"
import { site } from "@/data/site"
import { clp } from "@/lib/format"
import { zonas } from "@/data/shipping"

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de compra en The Lamp: precios, despacho, garantía, cambios y devoluciones.",
  alternates: { canonical: "/terminos" },
}

export default function Terminos() {
  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Términos y condiciones
        </h1>
        <p className="mt-3 text-xs text-white/40">
          Última actualización: 07-08-2026
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-white/60 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_p]:mt-2">
          <section>
            <h2>1. Quiénes somos</h2>
            <p>
              {site.nombre} es una marca de {site.empresa.matriz}, operada por{" "}
              {site.empresa.razonSocial}, RUT {site.empresa.rut}, con domicilio
              en {site.direccion.calle}, {site.direccion.comuna}, Región
              Metropolitana, Chile. Contacto: {site.email}.
            </p>
          </section>

          <section>
            <h2>2. Precios y pago</h2>
            <p>
              Todos los precios se expresan en pesos chilenos e incluyen IVA del
              19%. El desglose entre neto e IVA se muestra en el carrito, en el
              checkout y en la confirmación del pedido.
            </p>
            <p>
              Los pagos se procesan a través de Flow.cl, que acepta tarjetas de
              crédito, débito y transferencia electrónica. No almacenamos datos
              de tarjetas en este sitio: esa información viaja directo a la
              plataforma de pago.
            </p>
            <p>
              Un pedido se considera confirmado solo cuando Flow nos confirma el
              pago. Mientras eso no ocurra, no reservamos stock.
            </p>
          </section>

          <section>
            <h2>3. Boleta y factura</h2>
            <p>
              Emitimos boleta electrónica por cada compra y la enviamos al correo
              indicado en el pedido. Por eso pedimos el RUT en el checkout. Si
              necesitas factura, escríbenos a {site.email} con razón social, RUT
              y giro antes de que despachemos.
            </p>
          </section>

          <section>
            <h2>4. Disponibilidad</h2>
            <p>
              El stock publicado se actualiza manualmente. Si por un error un
              producto se vende sin existencia, te contactamos dentro de las 48
              horas hábiles siguientes para ofrecerte esperar la reposición o la
              devolución íntegra de lo pagado, a tu elección.
            </p>
          </section>

          <section>
            <h2>5. Despacho</h2>
            <p>
              Despachamos a todo Chile continental. El costo depende de la zona y
              se muestra antes de pagar. Sobre {clp(site.despachoGratisDesde)} el
              despacho va liberado.
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {zonas.map((z) => (
                <li key={z.id}>
                  · {z.nombre}: {z.costo === 0 ? "sin costo" : clp(z.costo)},{" "}
                  {z.plazo}.
                </li>
              ))}
            </ul>
            <p>
              Los plazos son estimados, se cuentan en días hábiles desde la
              confirmación del pago y dependen del operador logístico. Para Isla
              de Pascua y el archipiélago Juan Fernández se cotiza por separado.
            </p>
          </section>

          <section>
            <h2>6. Garantía legal</h2>
            <p>
              Se aplica la garantía legal de la Ley 19.496 sobre protección de
              los derechos de los consumidores. Además ofrecemos una garantía
              voluntaria de {site.garantiaMeses} meses por fallas de fabricación,
              contados desde la recepción del producto.
            </p>
            <p>
              La garantía no cubre daños por caída, exposición a humedad,
              manipulación de los componentes internos ni conexión a un voltaje
              distinto de 220V.
            </p>
          </section>

          <section>
            <h2>7. Cambios y devoluciones</h2>
            <p>
              Tienes 10 días corridos desde la recepción para solicitar cambio o
              devolución, siempre que el producto esté sin uso y en su embalaje
              original. Si el producto llegó fallado, incompleto o no corresponde
              al comprado, asumimos el costo del despacho de vuelta y repones o
              te devolvemos el total pagado. Si el retracto es por otra razón, el
              costo del envío de vuelta corre por tu cuenta.
            </p>
            <p>
              Las devoluciones de dinero se realizan por el mismo medio de pago
              usado en la compra, dentro de 10 días hábiles desde que recibimos
              el producto de vuelta y verificamos su estado.
            </p>
          </section>

          <section>
            <h2>8. Uso del sitio</h2>
            <p>
              Las fotografías, textos, diseños y nombres de producto de este
              sitio son de propiedad de {site.empresa.razonSocial} y no pueden
              reproducirse sin autorización escrita.
            </p>
          </section>

          <section>
            <h2>9. Datos personales</h2>
            <p>
              El tratamiento de tus datos se rige por nuestra{" "}
              <Link
                href="/privacidad"
                className="text-[#5badde] underline underline-offset-4"
              >
                política de privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2>10. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por la ley chilena. Cualquier controversia
              se somete a los tribunales ordinarios de justicia de Santiago de
              Chile, sin perjuicio de los derechos que la Ley 19.496 reconoce a
              los consumidores ante el SERNAC.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
