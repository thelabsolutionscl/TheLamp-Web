import "server-only"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { productos } from "@/data/products"

/**
 * INVENTARIO
 * ────────────────────────────────────────────────────────────────────────
 * El stock vive en Cloudflare D1 (SQLite), no en `products.ts`. El catálogo
 * solo aporta el stock INICIAL de cada producto nuevo.
 *
 * Por qué D1 y no KV, que ya usamos para los pedidos: bajar el stock es un
 * "leer, restar, guardar". En KV eso no es atómico y dos compras simultáneas
 * del último producto podrían quedar las dos aceptadas. En D1 se hace con un
 * solo UPDATE con guarda (`WHERE cantidad >= ?`), que SQLite resuelve de una
 * sola vez. De paso queda una tabla consultable para el panel de pedidos.
 *
 * El descuento ocurre cuando Flow confirma el pago, no antes. No reservamos
 * stock durante el checkout: reservar obliga a manejar vencimientos y
 * carritos abandonados, y al volumen de The Lamp el riesgo real es al revés
 * — que se venda de más porque nadie actualizó el catálogo a mano.
 */

/** Lo que este módulo usa de D1. Se tipa a mano para no arrastrar
 *  `@cloudflare/workers-types`, que pisa Request/Response del DOM. */
type Sentencia = {
  bind(...valores: unknown[]): Sentencia
  run(): Promise<{ meta: { changes: number } }>
  all<T>(): Promise<{ results: T[] }>
}
type BaseDatos = {
  prepare(sql: string): Sentencia
  batch(sentencias: Sentencia[]): Promise<unknown>
  exec(sql: string): Promise<unknown>
}

declare global {
  interface CloudflareEnv {
    DB?: BaseDatos
  }
}

export type ItemStock = { slug: string; cantidad: number }

async function db(): Promise<BaseDatos | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return env.DB ?? null
  } catch {
    return null
  }
}

// La tabla se crea y se siembra sola en la primera consulta de cada instancia
// del Worker. Así no hay una migración manual que alguien pueda olvidar, y un
// producto nuevo en el catálogo aparece con su stock inicial sin hacer nada.
let preparada = false

async function asegurarTabla(base: BaseDatos): Promise<void> {
  if (preparada) return
  await base.exec(
    "CREATE TABLE IF NOT EXISTS stock (slug TEXT PRIMARY KEY, cantidad INTEGER NOT NULL, actualizado TEXT NOT NULL)"
  )
  // INSERT OR IGNORE: siembra los productos nuevos y no toca los que ya
  // tienen un stock real distinto del que dice el catálogo.
  const ahora = new Date().toISOString()
  await base.batch(
    productos.map((p) =>
      base
        .prepare(
          "INSERT OR IGNORE INTO stock (slug, cantidad, actualizado) VALUES (?, ?, ?)"
        )
        .bind(p.slug, p.stock, ahora)
    )
  )
  preparada = true
}

/**
 * Stock real de cada producto. Si D1 no está disponible (por ejemplo en un
 * `npm run dev` sin Cloudflare) cae al stock del catálogo: la tienda sigue
 * navegable en vez de mostrar todo agotado.
 */
export async function stockActual(): Promise<Map<string, number>> {
  const delCatalogo = new Map(productos.map((p) => [p.slug, p.stock]))

  const base = await db()
  if (!base) return delCatalogo

  try {
    await asegurarTabla(base)
    const { results } = await base
      .prepare("SELECT slug, cantidad FROM stock")
      .all<{ slug: string; cantidad: number }>()
    const real = new Map(delCatalogo)
    for (const fila of results) {
      if (real.has(fila.slug)) real.set(fila.slug, fila.cantidad)
    }
    return real
  } catch (err) {
    console.error("[inventario] no se pudo leer el stock, se usa el catálogo:", err)
    return delCatalogo
  }
}

export async function stockDe(slug: string): Promise<number> {
  return (await stockActual()).get(slug) ?? 0
}

export type ResultadoDescuento =
  | { ok: true }
  /** `faltantes` trae los slugs que no alcanzaron. */
  | { ok: false; faltantes: string[]; motivo: string }

/**
 * Descuenta el stock de un pedido pagado.
 *
 * El `WHERE cantidad >= ?` es la guarda: si otro pago se adelantó y dejó el
 * stock corto, el UPDATE no toca ninguna fila (`changes === 0`) y se reporta
 * como faltante en vez de dejar el stock en negativo.
 *
 * Si un item falla después de que otros ya se descontaron, se devuelve lo
 * descontado. Es una compensación, no una transacción real, pero deja el
 * inventario consistente y el pedido se marca para revisión.
 */
export async function descontar(items: ItemStock[]): Promise<ResultadoDescuento> {
  const base = await db()
  if (!base) {
    console.error("[inventario] sin D1: el stock no se descontó")
    return { ok: false, faltantes: [], motivo: "El inventario no está configurado." }
  }

  try {
    await asegurarTabla(base)
    const ahora = new Date().toISOString()
    const descontados: ItemStock[] = []
    const faltantes: string[] = []

    for (const item of items) {
      const { meta } = await base
        .prepare(
          "UPDATE stock SET cantidad = cantidad - ?, actualizado = ? WHERE slug = ? AND cantidad >= ?"
        )
        .bind(item.cantidad, ahora, item.slug, item.cantidad)
        .run()

      if (meta.changes === 1) descontados.push(item)
      else faltantes.push(item.slug)
    }

    if (faltantes.length > 0) {
      if (descontados.length > 0) await reponer(descontados)
      return {
        ok: false,
        faltantes,
        motivo: "No había stock suficiente al momento de confirmar el pago.",
      }
    }

    return { ok: true }
  } catch (err) {
    console.error("[inventario] falló el descuento de stock:", err)
    return { ok: false, faltantes: [], motivo: "Error al actualizar el inventario." }
  }
}

/** Devuelve unidades al inventario: pago rechazado, anulado o devolución. */
export async function reponer(items: ItemStock[]): Promise<void> {
  const base = await db()
  if (!base) return

  try {
    await asegurarTabla(base)
    const ahora = new Date().toISOString()
    await base.batch(
      items.map((i) =>
        base
          .prepare(
            "UPDATE stock SET cantidad = cantidad + ?, actualizado = ? WHERE slug = ?"
          )
          .bind(i.cantidad, ahora, i.slug)
      )
    )
  } catch (err) {
    console.error("[inventario] falló la reposición de stock:", err)
  }
}
