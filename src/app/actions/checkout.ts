"use server"

import { redirect } from "next/navigation"
import { crearPago } from "@/lib/flow"
import {
  calcularPedido,
  generarNumeroPedido,
  guardarPedido,
  type ItemPedido,
  type Pedido,
} from "@/lib/orders"
import { normalizarRut, rutValido } from "@/lib/rut"
import { regiones } from "@/data/shipping"
import { site } from "@/data/site"

export type EstadoCheckout = {
  estado: "inicial" | "error"
  mensaje?: string
  /** Nombre del campo con problema, para enfocarlo en el formulario. */
  campo?: string
}

const texto = (fd: FormData, clave: string, max: number) =>
  ((fd.get(clave) as string | null) ?? "").trim().slice(0, max)

/** El carrito viaja como JSON en un campo oculto. Solo se confía en slug,
 *  color y cantidad; cualquier otra cosa que venga se descarta. */
function leerItems(crudo: string): ItemPedido[] {
  try {
    const datos: unknown = JSON.parse(crudo)
    if (!Array.isArray(datos)) return []
    return datos.flatMap((i): ItemPedido[] => {
      if (typeof i !== "object" || i === null) return []
      const item = i as Record<string, unknown>
      if (typeof item.slug !== "string" || typeof item.cantidad !== "number") {
        return []
      }
      return [
        {
          slug: item.slug,
          color: typeof item.color === "string" ? item.color : "",
          cantidad: Math.trunc(item.cantidad),
        },
      ]
    })
  } catch {
    return []
  }
}

export async function iniciarPago(
  _anterior: EstadoCheckout,
  formData: FormData
): Promise<EstadoCheckout> {
  // Honeypot: campo invisible que solo rellenan los bots. Se corta sin ruido.
  if (texto(formData, "empresa_web", 200)) {
    return { estado: "error", mensaje: "No pudimos procesar el pedido." }
  }

  const nombre = texto(formData, "nombre", 120)
  const email = texto(formData, "email", 160).toLowerCase()
  const telefono = texto(formData, "telefono", 30)
  const rut = normalizarRut(texto(formData, "rut", 20))
  const region = texto(formData, "region", 80)
  const comuna = texto(formData, "comuna", 80)
  const direccion = texto(formData, "direccion", 200)
  const referencia = texto(formData, "referencia", 200)
  const zonaId = texto(formData, "zonaId", 20)

  if (!nombre) {
    return { estado: "error", mensaje: "Falta tu nombre.", campo: "nombre" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { estado: "error", mensaje: "El correo no es válido.", campo: "email" }
  }
  if (telefono.replace(/\D/g, "").length < 8) {
    return {
      estado: "error",
      mensaje: "El teléfono no es válido.",
      campo: "telefono",
    }
  }
  if (!rutValido(rut)) {
    return {
      estado: "error",
      mensaje: "El RUT no es válido. Lo necesitamos para la boleta.",
      campo: "rut",
    }
  }

  const esRetiro = zonaId === "retiro"
  if (!esRetiro) {
    const regionConocida = regiones.find((r) => r.nombre === region)
    if (!regionConocida || regionConocida.zonaId !== zonaId) {
      return {
        estado: "error",
        mensaje: "Elige tu región.",
        campo: "region",
      }
    }
    if (!comuna) {
      return { estado: "error", mensaje: "Falta la comuna.", campo: "comuna" }
    }
    if (direccion.length < 5) {
      return {
        estado: "error",
        mensaje: "Falta la dirección de despacho.",
        campo: "direccion",
      }
    }
  }

  const items = leerItems(texto(formData, "items", 5000))
  // Acá se ignora por completo cualquier precio del navegador: el total sale
  // del catálogo del servidor.
  const { lineas, totales, zona, error } = calcularPedido(items, zonaId)
  if (error || !zona) {
    return { estado: "error", mensaje: error ?? "No pudimos calcular el pedido." }
  }
  if (totales.total <= 0) {
    return { estado: "error", mensaje: "El total del pedido es inválido." }
  }

  const pedido: Pedido = {
    numero: generarNumeroPedido(),
    creado: new Date().toISOString(),
    estado: "pendiente",
    items: lineas,
    cliente: { nombre, email, telefono, rut },
    despacho: {
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      plazo: zona.plazo,
      region: esRetiro ? "Región Metropolitana" : region,
      comuna: esRetiro ? site.direccion.comuna : comuna,
      direccion: esRetiro ? `Retiro en ${site.direccion.calle}` : direccion,
      referencia,
      costo: totales.despacho,
    },
    totales,
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url
  let urlPago: string
  try {
    const pago = await crearPago({
      numeroPedido: pedido.numero,
      concepto: `${site.nombre} · pedido ${pedido.numero}`,
      monto: totales.total,
      email,
      urlConfirmacion: `${base}/api/pago/confirmar`,
      urlRetorno: `${base}/api/pago/retorno`,
    })
    pedido.pago = { token: pago.token, flowOrder: pago.flowOrder }
    urlPago = pago.urlPago
  } catch (err) {
    console.error("[checkout] Flow no pudo crear el pago:", err)
    return {
      estado: "error",
      mensaje:
        "No pudimos conectar con el medio de pago. Intenta de nuevo en un minuto o escríbenos por WhatsApp.",
    }
  }

  // Se guarda ANTES de mandar al comprador a pagar. Si se guardara después, un
  // pago exitoso podría llegar al webhook sin pedido que actualizar.
  try {
    await guardarPedido(pedido)
  } catch (err) {
    console.error("[checkout] no se pudo guardar el pedido:", err)
    return {
      estado: "error",
      mensaje: "No pudimos registrar el pedido. Escríbenos por WhatsApp y lo tomamos a mano.",
    }
  }

  // redirect lanza una excepción de control de flujo: nada de acá para abajo
  // se ejecuta, y por eso no hay estado de éxito que devolver.
  redirect(urlPago)
}
