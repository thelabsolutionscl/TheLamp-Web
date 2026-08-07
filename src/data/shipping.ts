/**
 * DESPACHO
 * ────────────────────────────────────────────────────────────────────────
 * Tarifa plana por zona. No se cotiza contra Chilexpress ni Starken: para el
 * volumen actual, una tarifa fija por zona es más barata de mantener y no se
 * cae cuando la API del courier falla.
 *
 * Si una zona te queda cara de forma sistemática, sube el valor acá.
 * Los montos van en CLP con IVA incluido.
 */

export type Zona = {
  id: string
  nombre: string
  costo: number
  /** Días hábiles estimados, se muestra en el checkout. */
  plazo: string
  /** Regiones que caen en esta zona, en el orden del <select>. */
  regiones: string[]
}

export const zonas: Zona[] = [
  {
    id: "rm",
    nombre: "Región Metropolitana",
    costo: 4990,
    plazo: "2 a 3 días hábiles",
    regiones: ["Región Metropolitana de Santiago"],
  },
  {
    id: "centro",
    nombre: "Zona centro",
    costo: 6990,
    plazo: "3 a 5 días hábiles",
    regiones: [
      "Valparaíso",
      "Libertador General Bernardo O'Higgins",
      "Maule",
      "Ñuble",
      "Biobío",
    ],
  },
  {
    id: "norte",
    nombre: "Zona norte",
    costo: 9990,
    plazo: "4 a 7 días hábiles",
    regiones: [
      "Arica y Parinacota",
      "Tarapacá",
      "Antofagasta",
      "Atacama",
      "Coquimbo",
    ],
  },
  {
    id: "sur",
    nombre: "Zona sur",
    costo: 9990,
    plazo: "4 a 7 días hábiles",
    regiones: ["La Araucanía", "Los Ríos", "Los Lagos"],
  },
  {
    id: "austral",
    nombre: "Zona austral",
    costo: 14990,
    plazo: "7 a 12 días hábiles",
    regiones: ["Aysén del General Carlos Ibáñez del Campo", "Magallanes y la Antártica Chilena"],
  },
  {
    id: "retiro",
    nombre: "Retiro en taller (Las Condes)",
    costo: 0,
    plazo: "Coordinamos por WhatsApp, normalmente al día siguiente",
    regiones: [],
  },
]

/** Todas las regiones con su zona, para armar el <select> del checkout. */
export const regiones: { nombre: string; zonaId: string }[] = zonas
  .flatMap((z) => z.regiones.map((r) => ({ nombre: r, zonaId: z.id })))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))

export function obtenerZona(id: string): Zona | undefined {
  return zonas.find((z) => z.id === id)
}
