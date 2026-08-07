import { consultarPago } from "@/lib/flow"
import { guardarPedido, obtenerPedido } from "@/lib/orders"
import { enviarConfirmacion } from "@/lib/email"

export const dynamic = "force-dynamic"

/**
 * Webhook de Flow (`urlConfirmation`).
 *
 * Flow lo llama servidor a servidor con el token del pago. Esta es la ÚNICA
 * ruta que puede marcar un pedido como pagado — la página de retorno la abre
 * el comprador y no se le cree nada.
 *
 * Reglas:
 *  - El monto que reporta Flow tiene que coincidir con el del pedido guardado.
 *    Si no coincide, el pedido NO se marca pagado y queda para revisión.
 *  - Es idempotente: Flow reintenta el webhook, así que un pedido ya pagado no
 *    vuelve a mandar correos.
 *  - Siempre responde 200 cuando el pago se procesó. Un error acá haría que
 *    Flow reintente en loop.
 */
export async function POST(req: Request) {
  let token: string | null = null
  try {
    const form = await req.formData()
    token = (form.get("token") as string | null) ?? null
  } catch {
    // Flow manda form-urlencoded; si viene otra cosa, no es una llamada válida.
  }

  if (!token) {
    return new Response("Falta el token", { status: 400 })
  }

  try {
    const pago = await consultarPago(token)
    const pedido = await obtenerPedido(pago.numeroPedido)

    if (!pedido) {
      console.error(
        `[pago] Flow confirmó ${pago.numeroPedido} pero no existe en KV`
      )
      // 200 igual: reintentar no va a hacer aparecer el pedido.
      return new Response("OK", { status: 200 })
    }

    if (pedido.estado === "pagado") {
      return new Response("OK", { status: 200 })
    }

    if (pago.estado !== "pagado") {
      pedido.estado = pago.estado
      await guardarPedido(pedido)
      return new Response("OK", { status: 200 })
    }

    // Control de monto. Si Flow cobró algo distinto a lo que dice el pedido,
    // algo se manipuló o se rompió: se deja pendiente y se avisa en los logs.
    if (Math.round(pago.monto) !== Math.round(pedido.totales.total)) {
      console.error(
        `[pago] descuadre en ${pedido.numero}: Flow dice ${pago.monto}, el pedido dice ${pedido.totales.total}`
      )
      return new Response("OK", { status: 200 })
    }

    pedido.estado = "pagado"
    pedido.pago = {
      token,
      flowOrder: pedido.pago?.flowOrder ?? 0,
      medio: pago.medioPago,
      fecha: pago.fechaPago,
    }
    await guardarPedido(pedido)

    // El correo va después de guardar: si Resend falla, el pedido igual quedó
    // pagado y se puede reenviar la confirmación a mano.
    await enviarConfirmacion(pedido)

    return new Response("OK", { status: 200 })
  } catch (err) {
    console.error("[pago] falló la confirmación:", err)
    // 500 a propósito: acá sí queremos que Flow reintente, porque el problema
    // es nuestro (KV caído, Flow sin responder) y el pago sí existe.
    return new Response("Error", { status: 500 })
  }
}
