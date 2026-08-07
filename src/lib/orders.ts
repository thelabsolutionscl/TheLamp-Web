import "server-only"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { obtenerProducto } from "@/data/products"
import { obtenerZona } from "@/data/shipping"
import { desglosarIva } from "@/lib/format"
import { site } from "@/data/site"

/**
 * Lo que este módulo necesita de KV, y nada más.
 *
 * Se define el tipo a mano en vez de traer `@cloudflare/workers-types`: esos
 * tipos redefinen `Request`, `Response` y `caches` globales y chocan con los
 * del DOM que usa el resto del sitio. Acá solo se lee y se escribe.
 */
type AlmacenPedidos = {
  get(clave: string): Promise<string | null>
  put(
    clave: string,
    valor: string,
    opciones?: { expirationTtl?: number }
  ): Promise<void>
}

declare global {
  interface CloudflareEnv {
    PEDIDOS?: AlmacenPedidos
  }
}

export type LineaPedido = {
  slug: string
  nombre: string
  color: string
  cantidad: number
  /** Precio unitario con IVA, tomado del catálogo en el servidor. */
  precioUnitario: number
  subtotal: number
}

export type Pedido = {
  numero: string
  creado: string
  estado: "pendiente" | "pagado" | "rechazado" | "anulado"
  items: LineaPedido[]
  cliente: {
    nombre: string
    email: string
    telefono: string
    rut: string
  }
  despacho: {
    zonaId: string
    zonaNombre: string
    plazo: string
    region: string
    comuna: string
    direccion: string
    referencia: string
    costo: number
  }
  totales: {
    productos: number
    despacho: number
    total: number
    neto: number
    iva: number
  }
  pago?: {
    token: string
    flowOrder: number
    medio?: string
    fecha?: string
  }
  /** true cuando el stock del pedido ya se descontó del inventario. */
  stockDescontado?: boolean
  /** Motivo por el que este pedido necesita que alguien lo mire a mano. */
  revisar?: string
}

/** Lo que manda el navegador. Solo qué y cuánto: el precio se ignora. */
export type ItemPedido = { slug: string; color: string; cantidad: number }

/**
 * Recalcula el pedido completo desde el catálogo del servidor.
 *
 * Este es el punto crítico de seguridad de todo el checkout: el navegador
 * puede mandar cualquier precio, así que acá no se lee ninguno. Se toma el
 * slug, se busca el producto real y se usa SU precio. Si un producto no
 * existe o está agotado, la línea se cae.
 *
 * `stock` viene del inventario en D1 (ver `lib/inventario.ts`), no del
 * catálogo: el campo `stock` de `products.ts` es solo el valor inicial.
 */
export function calcularPedido(
  items: ItemPedido[],
  zonaId: string,
  stock: Map<string, number>
): {
  lineas: LineaPedido[]
  totales: Pedido["totales"]
  zona: ReturnType<typeof obtenerZona>
  error?: string
} {
  const zona = obtenerZona(zonaId)
  const vacio = {
    lineas: [],
    totales: { productos: 0, despacho: 0, total: 0, neto: 0, iva: 0 },
    zona,
  }

  if (!zona) return { ...vacio, error: "La zona de despacho no es válida." }
  if (items.length === 0) return { ...vacio, error: "El carrito está vacío." }

  const lineas: LineaPedido[] = []
  for (const item of items) {
    const producto = obtenerProducto(item.slug)
    if (!producto) {
      return { ...vacio, error: "Uno de los productos ya no está disponible." }
    }
    const cantidad = Math.trunc(item.cantidad)
    if (!Number.isFinite(cantidad) || cantidad < 1) {
      return { ...vacio, error: "Hay una cantidad inválida en el carrito." }
    }
    const disponible = stock.get(producto.slug) ?? 0
    if (disponible < cantidad) {
      return {
        ...vacio,
        error:
          disponible === 0
            ? `${producto.nombre} se agotó mientras comprabas.`
            : `De ${producto.nombre} ${disponible === 1 ? "queda 1 unidad" : `quedan ${disponible} unidades`}.`,
      }
    }
    // El color también se valida: no se acepta uno que no esté en el catálogo.
    const color = producto.colores.includes(item.color)
      ? item.color
      : (producto.colores[0] ?? "Único")

    lineas.push({
      slug: producto.slug,
      nombre: producto.nombre,
      color,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cantidad,
    })
  }

  const productosTotal = lineas.reduce((n, l) => n + l.subtotal, 0)
  const despacho =
    productosTotal >= site.despachoGratisDesde ? 0 : zona.costo
  const total = productosTotal + despacho
  const { neto, iva } = desglosarIva(total)

  return {
    lineas,
    totales: { productos: productosTotal, despacho, total, neto, iva },
    zona,
  }
}

/**
 * Número de pedido: fecha + 6 caracteres aleatorios.
 * Lleva azar a propósito — la página de estado del pedido es pública, así que
 * un correlativo dejaría los pedidos de otros a un intento de distancia.
 * Se omiten I, O, 0 y 1 para que nadie los confunda al dictarlos por teléfono.
 */
export function generarNumeroPedido(): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const azar = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("")
  const hoy = new Date()
  const fecha = [
    String(hoy.getFullYear()).slice(2),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("")
  return `TL-${fecha}-${azar}`
}

/**
 * Acceso a KV. En `npm run dev` sin Cloudflare no hay binding, así que se cae
 * a un Map en memoria: el checkout se puede probar completo en local, solo que
 * los pedidos no sobreviven al reinicio del servidor.
 */
const enMemoria = new Map<string, string>()

async function kv(): Promise<AlmacenPedidos | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return env.PEDIDOS ?? null
  } catch {
    return null
  }
}

export async function guardarPedido(pedido: Pedido): Promise<void> {
  const datos = JSON.stringify(pedido)
  const store = await kv()
  if (store) {
    // Un año de retención: cubre de sobra la garantía y los reclamos.
    await store.put(`pedido:${pedido.numero}`, datos, {
      expirationTtl: 60 * 60 * 24 * 365,
    })
    return
  }
  enMemoria.set(pedido.numero, datos)
}

export async function obtenerPedido(numero: string): Promise<Pedido | null> {
  const store = await kv()
  const datos = store
    ? await store.get(`pedido:${numero}`)
    : (enMemoria.get(numero) ?? null)
  if (!datos) return null
  try {
    return JSON.parse(datos) as Pedido
  } catch {
    return null
  }
}
