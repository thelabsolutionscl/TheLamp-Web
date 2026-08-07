"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { obtenerProducto, type Producto } from "@/data/products"

const CLAVE = "thelamp.carrito.v1"

/** Lo que se guarda en el navegador: solo qué y cuánto, nunca el precio. */
export type ItemCarrito = {
  slug: string
  cantidad: number
  color: string
}

/** Un item ya cruzado con el catálogo, listo para mostrar. */
export type LineaCarrito = ItemCarrito & {
  producto: Producto
  subtotal: number
}

/**
 * El carrito vive en localStorage, que es un sistema externo a React. Por eso
 * se modela con `useSyncExternalStore` en vez de useState + useEffect: React
 * lee el snapshot cuando lo necesita, sin renders en cascada al montar, y de
 * paso el carrito queda sincronizado entre pestañas gratis.
 */
const VACIO: ItemCarrito[] = []

let cache: ItemCarrito[] = VACIO
let leido = false
const oyentes = new Set<() => void>()

const mismaLinea = (a: ItemCarrito, slug: string, color: string) =>
  a.slug === slug && a.color === color

function leerDelNavegador(): ItemCarrito[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return VACIO
    const datos: unknown = JSON.parse(crudo)
    if (!Array.isArray(datos)) return VACIO
    // Se filtra contra el catálogo: si un producto se dio de baja o le
    // cambiaron el slug, un carrito viejo no puede romper la página.
    const limpio = datos
      .filter((i): i is ItemCarrito => {
        if (typeof i !== "object" || i === null) return false
        const item = i as Record<string, unknown>
        return typeof item.slug === "string" && typeof item.cantidad === "number"
      })
      .filter((i) => obtenerProducto(i.slug))
      .map((i) => ({
        slug: i.slug,
        color: typeof i.color === "string" ? i.color : "",
        cantidad: Math.min(Math.max(Math.trunc(i.cantidad), 1), 99),
      }))
    return limpio.length > 0 ? limpio : VACIO
  } catch {
    return VACIO
  }
}

function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar)
  // Si el visitante agrega algo en otra pestaña, esta se entera.
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key !== CLAVE) return
    leido = false
    cache = leerDelNavegador()
    leido = true
    oyentes.forEach((f) => f())
  }
  window.addEventListener("storage", alCambiarStorage)
  return () => {
    oyentes.delete(alCambiar)
    window.removeEventListener("storage", alCambiarStorage)
  }
}

/** Tiene que devolver SIEMPRE la misma referencia si nada cambió, o React
 *  entra en un bucle de renders. De ahí el cache. */
function snapshot(): ItemCarrito[] {
  if (!leido) {
    cache = leerDelNavegador()
    leido = true
  }
  return cache
}

/** En el servidor no hay localStorage: el carrito arranca vacío y React lo
 *  reconcilia solo después de hidratar. */
const snapshotServidor = (): ItemCarrito[] => VACIO

function escribir(nuevos: ItemCarrito[]): void {
  cache = nuevos
  leido = true
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(nuevos))
  } catch {
    // Modo incógnito con almacenamiento bloqueado: el carrito sigue
    // funcionando en memoria, solo no sobrevive al refresh.
  }
  oyentes.forEach((f) => f())
}

// Detector de hidratación: en el servidor es false, en el cliente true. Sirve
// para no mostrar "carrito vacío" durante el instante previo a leer el
// almacenamiento del navegador.
const sinSuscripcion = () => () => {}

export function useCarrito() {
  const items = useSyncExternalStore(suscribir, snapshot, snapshotServidor)
  const listo = useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false
  )

  const agregar = useCallback((slug: string, color: string, cantidad = 1) => {
    const producto = obtenerProducto(slug)
    if (!producto || producto.stock <= 0) return
    const tope = Math.min(producto.stock, 99)
    const actuales = snapshot()
    const existente = actuales.find((i) => mismaLinea(i, slug, color))
    escribir(
      existente
        ? actuales.map((i) =>
            mismaLinea(i, slug, color)
              ? { ...i, cantidad: Math.min(i.cantidad + cantidad, tope) }
              : i
          )
        : [...actuales, { slug, color, cantidad: Math.min(cantidad, tope) }]
    )
  }, [])

  const cambiarCantidad = useCallback(
    (slug: string, color: string, cantidad: number) => {
      const producto = obtenerProducto(slug)
      if (!producto) return
      const actuales = snapshot()
      if (cantidad <= 0) {
        escribir(actuales.filter((i) => !mismaLinea(i, slug, color)))
        return
      }
      const tope = Math.min(producto.stock, 99)
      escribir(
        actuales.map((i) =>
          mismaLinea(i, slug, color)
            ? { ...i, cantidad: Math.min(cantidad, tope) }
            : i
        )
      )
    },
    []
  )

  const quitar = useCallback((slug: string, color: string) => {
    escribir(snapshot().filter((i) => !mismaLinea(i, slug, color)))
  }, [])

  const vaciar = useCallback(() => escribir(VACIO), [])

  const derivados = useMemo(() => {
    const lineas = items.flatMap<LineaCarrito>((i) => {
      const producto = obtenerProducto(i.slug)
      if (!producto) return []
      return [{ ...i, producto, subtotal: producto.precio * i.cantidad }]
    })
    return {
      lineas,
      unidades: lineas.reduce((n, l) => n + l.cantidad, 0),
      subtotal: lineas.reduce((n, l) => n + l.subtotal, 0),
    }
  }, [items])

  return {
    items,
    ...derivados,
    listo,
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
  }
}
