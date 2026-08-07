/** IVA chileno. Los precios del catálogo ya lo incluyen. */
export const IVA = 0.19

/**
 * Formatea un monto en pesos chilenos: $1.234.567, sin decimales.
 * Se fuerza `es-CL` porque el runtime del Worker no hereda el locale del
 * visitante y en `en-US` esto saldría como $1,234,567.
 */
export function clp(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(monto))
}

/**
 * Desglosa un precio con IVA incluido en neto + IVA.
 * El neto se redondea y el IVA se calcula como la diferencia, para que
 * `neto + iva` siempre dé exactamente el total y no aparezca un peso de más
 * en la boleta.
 */
export function desglosarIva(totalConIva: number): {
  neto: number
  iva: number
  total: number
} {
  const total = Math.round(totalConIva)
  const neto = Math.round(total / (1 + IVA))
  return { neto, iva: total - neto, total }
}

/** Fecha en DD-MM-AAAA, la convención del negocio. */
export function fechaCL(fecha: Date | string | number): string {
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}-${mm}-${d.getFullYear()}`
}
