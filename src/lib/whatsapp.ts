const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP ?? "56928785039"

/** Link de WhatsApp con mensaje prellenado. */
export function whatsappUrl(mensaje?: string): string {
  const texto =
    mensaje ?? "Hola, vi la web de The Lamp y quiero hacer una consulta."
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`
}

/** Consulta sobre un producto puntual, con el nombre ya escrito. */
export function whatsappProducto(nombre: string): string {
  return whatsappUrl(`Hola, quiero consultar por la lámpara ${nombre}.`)
}
