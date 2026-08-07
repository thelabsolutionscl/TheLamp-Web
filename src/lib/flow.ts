/**
 * Cliente de Flow.cl.
 *
 * Se implementa a mano y no con el SDK oficial porque el SDK asume Node
 * (usa `crypto` nativo) y este sitio corre en un Worker de Cloudflare. Acá
 * todo va con `fetch` y Web Crypto, que sí existen en el edge.
 *
 * La firma de Flow: se ordenan los parámetros alfabéticamente por nombre, se
 * concatenan como nombre+valor sin separadores y se firma esa cadena con
 * HMAC-SHA256 usando la secretKey. El resultado en hexadecimal viaja como
 * parámetro `s`.
 *
 * Documentación: https://www.flow.cl/docs/api.html
 */

export type EstadoFlow = "pendiente" | "pagado" | "rechazado" | "anulado"

/** Códigos de estado que devuelve Flow en getStatus. */
const ESTADOS: Record<number, EstadoFlow> = {
  1: "pendiente",
  2: "pagado",
  3: "rechazado",
  4: "anulado",
}

type Config = {
  apiKey: string
  secretKey: string
  baseUrl: string
}

/** Lee la configuración desde el entorno. Lanza si falta algo: es preferible
 *  un error claro en el servidor a un checkout que falla en silencio. */
export function configFlow(): Config {
  const apiKey = process.env.FLOW_API_KEY
  const secretKey = process.env.FLOW_SECRET_KEY
  if (!apiKey || !secretKey) {
    throw new Error(
      "Faltan FLOW_API_KEY y/o FLOW_SECRET_KEY. Configúralas antes de cobrar."
    )
  }
  const baseUrl =
    process.env.FLOW_ENTORNO === "produccion"
      ? "https://www.flow.cl/api"
      : "https://sandbox.flow.cl/api"
  return { apiKey, secretKey, baseUrl }
}

async function firmar(params: Record<string, string>, secretKey: string) {
  const cadena = Object.keys(params)
    .sort()
    .map((k) => k + params[k])
    .join("")

  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const firma = await crypto.subtle.sign(
    "HMAC",
    clave,
    new TextEncoder().encode(cadena)
  )
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function llamar<T>(
  ruta: string,
  params: Record<string, string>,
  metodo: "GET" | "POST"
): Promise<T> {
  const { apiKey, secretKey, baseUrl } = configFlow()
  const conApiKey = { ...params, apiKey }
  const s = await firmar(conApiKey, secretKey)
  const cuerpo = new URLSearchParams({ ...conApiKey, s })

  const url =
    metodo === "GET" ? `${baseUrl}${ruta}?${cuerpo.toString()}` : `${baseUrl}${ruta}`

  const res = await fetch(url, {
    method: metodo,
    headers:
      metodo === "POST"
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : undefined,
    body: metodo === "POST" ? cuerpo.toString() : undefined,
    signal: AbortSignal.timeout(15000),
  })

  const texto = await res.text()
  if (!res.ok) {
    // El cuerpo de error de Flow trae el motivo real; sin esto el diagnóstico
    // se vuelve adivinanza.
    throw new Error(`Flow ${ruta} respondió ${res.status}: ${texto.slice(0, 300)}`)
  }

  try {
    return JSON.parse(texto) as T
  } catch {
    throw new Error(`Flow ${ruta} devolvió algo que no es JSON: ${texto.slice(0, 300)}`)
  }
}

/**
 * Crea la orden de pago y devuelve la URL a la que hay que mandar al comprador.
 * `monto` va en pesos enteros: Flow rechaza decimales en CLP.
 */
export async function crearPago(datos: {
  numeroPedido: string
  concepto: string
  monto: number
  email: string
  urlConfirmacion: string
  urlRetorno: string
}): Promise<{ urlPago: string; token: string; flowOrder: number }> {
  const respuesta = await llamar<{ url: string; token: string; flowOrder: number }>(
    "/payment/create",
    {
      commerceOrder: datos.numeroPedido,
      subject: datos.concepto.slice(0, 255),
      currency: "CLP",
      amount: String(Math.round(datos.monto)),
      email: datos.email,
      urlConfirmation: datos.urlConfirmacion,
      urlReturn: datos.urlRetorno,
    },
    "POST"
  )

  return {
    // Flow entrega la URL y el token por separado; hay que unirlos.
    urlPago: `${respuesta.url}?token=${respuesta.token}`,
    token: respuesta.token,
    flowOrder: respuesta.flowOrder,
  }
}

export type EstadoPago = {
  estado: EstadoFlow
  numeroPedido: string
  /** Monto que Flow dice haber cobrado. Se compara contra el pedido guardado. */
  monto: number
  medioPago?: string
  fechaPago?: string
  emailPagador?: string
}

/** Consulta el estado real de un pago. Es la única fuente de verdad: nunca se
 *  da por pagado un pedido por lo que diga el navegador del comprador. */
export async function consultarPago(token: string): Promise<EstadoPago> {
  const r = await llamar<{
    status: number
    commerceOrder: string
    amount: number | string
    payer?: string
    paymentData?: { media?: string; date?: string; amount?: number | string }
  }>("/payment/getStatus", { token }, "GET")

  return {
    estado: ESTADOS[r.status] ?? "pendiente",
    numeroPedido: r.commerceOrder,
    monto: Number(r.paymentData?.amount ?? r.amount),
    medioPago: r.paymentData?.media,
    fechaPago: r.paymentData?.date,
    emailPagador: r.payer,
  }
}
