/**
 * RUT chileno: normalización y validación con módulo 11.
 * Se valida en serio porque el RUT se usa para emitir la boleta; un RUT malo
 * significa una boleta que hay que anular a mano después.
 */

/** Deja el RUT como 12345678-9, sin puntos y con dígito verificador en mayúscula. */
export function normalizarRut(valor: string): string {
  const limpio = valor.replace(/[^0-9kK]/g, "").toUpperCase()
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

/** Formato de lectura: 12.345.678-9 */
export function formatearRut(valor: string): string {
  const normalizado = normalizarRut(valor)
  const [cuerpo, dv] = normalizado.split("-")
  if (!cuerpo || !dv) return normalizado
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`
}

export function rutValido(valor: string): boolean {
  const normalizado = normalizarRut(valor)
  const [cuerpo, dv] = normalizado.split("-")
  if (!cuerpo || !dv || !/^\d{7,8}$/.test(cuerpo)) return false

  // Módulo 11: se recorre el cuerpo de derecha a izquierda multiplicando por
  // la serie 2,3,4,5,6,7 que se repite.
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto)
  return dv === esperado
}
