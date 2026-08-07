"use client"

import { useEffect } from "react"
import { useCarrito } from "./cart"

/**
 * Vacía el carrito al montar. Se usa en la página del pedido pagado: si no,
 * el comprador vuelve a la tienda y le aparecen sus lámparas ya compradas
 * todavía en el carrito.
 */
export function ClearCart() {
  const { vaciar, listo, unidades } = useCarrito()

  useEffect(() => {
    if (listo && unidades > 0) vaciar()
  }, [listo, unidades, vaciar])

  return null
}
