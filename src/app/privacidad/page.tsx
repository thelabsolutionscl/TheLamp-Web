import type { Metadata } from "next"
import { site } from "@/data/site"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos recolecta The Lamp, para qué los usa y cómo ejercer tus derechos sobre ellos.",
  alternates: { canonical: "/privacidad" },
}

export default function Privacidad() {
  return (
    <div className="px-6 py-14 lg:px-12 lg:py-20">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Política de privacidad
        </h1>
        <p className="mt-3 text-xs text-white/40">
          Última actualización: 07-08-2026
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-white/60 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_p]:mt-2">
          <section>
            <h2>1. Responsable</h2>
            <p>
              {site.empresa.razonSocial}, RUT {site.empresa.rut}, domiciliada en{" "}
              {site.direccion.calle}, {site.direccion.comuna}, Chile, es
              responsable del tratamiento de los datos recogidos en este sitio.
              Contacto: {site.email}.
            </p>
          </section>

          <section>
            <h2>2. Qué datos recolectamos</h2>
            <p>
              Solo lo necesario para venderte y despacharte una lámpara: nombre,
              correo, teléfono, RUT y dirección de despacho. El RUT lo pedimos
              exclusivamente para emitir la boleta electrónica que exige el SII.
            </p>
            <p>
              Si nos escribes por el formulario de contacto, guardamos tu nombre,
              correo y el mensaje.
            </p>
            <p>
              <strong className="text-white/80">
                No recibimos ni almacenamos datos de tarjetas.
              </strong>{" "}
              Los pagos los procesa Flow.cl en su propia plataforma; nosotros
              solo recibimos la confirmación de que el pago se hizo, el monto y
              el medio usado.
            </p>
          </section>

          <section>
            <h2>3. Para qué los usamos</h2>
            <p>
              Para procesar tu pedido, emitir la boleta, coordinar el despacho,
              responder tus consultas y cumplir con la garantía. No los usamos
              para nada más.
            </p>
          </section>

          <section>
            <h2>4. Con quién los compartimos</h2>
            <p>
              Con Flow.cl para procesar el pago, con la empresa de transporte
              para entregar el pedido, y con el proveedor de correo electrónico
              que despacha las confirmaciones. No vendemos ni cedemos tus datos a
              terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2>5. Cuánto tiempo los guardamos</h2>
            <p>
              Los datos de un pedido se conservan por un año, plazo que cubre la
              garantía y eventuales reclamos. Los mensajes del formulario de
              contacto se conservan mientras sean útiles para atenderte.
            </p>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              Este sitio no usa cookies de seguimiento ni de publicidad. Tu
              carrito se guarda en el almacenamiento local de tu propio
              navegador: esa información no sale de tu dispositivo hasta que
              decides pagar.
            </p>
          </section>

          <section>
            <h2>7. Tus derechos</h2>
            <p>
              Puedes pedirnos acceso, rectificación, eliminación o bloqueo de tus
              datos escribiendo a {site.email}. Respondemos dentro de los plazos
              que fija la Ley 19.628 sobre protección de la vida privada.
            </p>
          </section>

          <section>
            <h2>8. Seguridad</h2>
            <p>
              El sitio funciona íntegramente sobre HTTPS. Los datos de pedidos se
              almacenan cifrados en la infraestructura de Cloudflare y el acceso
              está restringido a quienes operan la tienda.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
