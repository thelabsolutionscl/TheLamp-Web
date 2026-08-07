import { consultarPago } from "@/lib/flow"
import { site } from "@/data/site"

export const dynamic = "force-dynamic"

/**
 * Retorno de Flow (`urlReturn`): acá vuelve el comprador después de pagar.
 *
 * Solo sirve para llevarlo a la página de su pedido. El pedido se marca como
 * pagado en /api/pago/confirmar, que es la llamada servidor a servidor. Un
 * comprador podría abrir esta URL a mano; por eso no escribe nada.
 */
async function manejar(req: Request) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url

  let token: string | null = null
  if (req.method === "POST") {
    try {
      const form = await req.formData()
      token = (form.get("token") as string | null) ?? null
    } catch {
      token = null
    }
  }
  // Flow normalmente postea, pero algunos flujos de pago vuelven por GET.
  token ??= new URL(req.url).searchParams.get("token")

  if (!token) {
    return Response.redirect(`${base}/pedido/no-encontrado`, 303)
  }

  try {
    const pago = await consultarPago(token)
    return Response.redirect(`${base}/pedido/${pago.numeroPedido}`, 303)
  } catch (err) {
    console.error("[pago] no se pudo resolver el retorno:", err)
    return Response.redirect(`${base}/pedido/no-encontrado`, 303)
  }
}

export const POST = manejar
export const GET = manejar
