/**
 * CATÁLOGO DE THE LAMP
 * ────────────────────────────────────────────────────────────────────────
 * Este archivo es el catálogo completo. Para cambiar precios, stock, textos
 * o fotos se edita acá y se hace deploy — no hay panel ni base de datos que
 * administrar.
 *
 * REGLAS IMPORTANTES
 *
 * 1. `precio` va en pesos chilenos, CON IVA INCLUIDO y sin puntos ni
 *    símbolos. 89900 se muestra como $89.900. El desglose de IVA lo calcula
 *    el sitio solo.
 *
 * 2. El servidor recalcula SIEMPRE el precio desde este archivo al momento
 *    de cobrar. Nunca confía en el precio que manda el navegador. Por eso
 *    cambiar un precio acá es suficiente y es seguro.
 *
 * 3. `stock` es el stock INICIAL, nada más. Una vez publicado el producto, el
 *    stock real vive en la base de inventario (D1) y se descuenta solo cada
 *    vez que Flow confirma un pago. Cambiar este número acá NO repone stock;
 *    para eso está el comando del README ("Reponer stock"). El valor de acá
 *    solo se usa para sembrar productos nuevos.
 *
 * 4. NUNCA mencionar impresión 3D ni PLA en los textos. Lo que se vende es
 *    diseño, calidad de luz y domótica.
 *
 * 5. Las fotos van en `public/images/productos/`. Mientras `imagenes` esté
 *    vacío el sitio muestra un marcador de posición elegante, no una imagen
 *    rota.
 */

export type Coleccion = "mesa" | "colgante" | "muro" | "pie"

export const colecciones: { id: Coleccion; nombre: string; descripcion: string }[] = [
  { id: "mesa", nombre: "De mesa", descripcion: "Para velador, escritorio y repisa" },
  { id: "colgante", nombre: "Colgantes", descripcion: "Sobre la mesa, la isla o la escalera" },
  { id: "muro", nombre: "De muro", descripcion: "Apliques que liberan superficie" },
  { id: "pie", nombre: "De pie", descripcion: "Luz de ambiente para el living" },
]

export type Imagen = { src: string; alt: string }

export type Producto = {
  /** Va en la URL: /producto/<slug>. No cambiarlo después de publicar. */
  slug: string
  nombre: string
  /** Una línea, aparece bajo el nombre en la ficha y en la tarjeta. */
  tagline: string
  /** Dos o tres frases. Se usa también como meta description. */
  descripcion: string
  coleccion: Coleccion
  /** CLP con IVA incluido. */
  precio: number
  /** Precio anterior, solo si está en oferta real. */
  precioAntes?: number
  /** Stock inicial. Siembra el inventario la primera vez; después manda D1. */
  stock: number
  /** Aparece en la portada. */
  destacado?: boolean
  /** Luz inteligente: app, Google Home y Alexa. */
  domotica: boolean
  imagenes: Imagen[]
  /** Centímetros. Se muestran en la ficha. */
  medidas: { alto: number; ancho: number; profundidad: number }
  /** Kilos, con embalaje. Se usa para el cálculo de despacho. */
  pesoKg: number
  colores: string[]
  /** Bullets cortos, lo que el comprador necesita saber en 5 segundos. */
  caracteristicas: string[]
  /** Tabla de especificaciones de la ficha. */
  especificaciones: { label: string; valor: string }[]
}

export const productos: Producto[] = [
  {
    slug: "tokyo",
    nombre: "Tokyo",
    tagline: "Luz inteligente envuelta en movimiento",
    descripcion:
      "Tokyo transforma la luz en una pieza escultórica. Su silueta en torsión genera profundidad y movimiento incluso cuando está apagada, mientras su iluminación RGB permite cambiar la atmósfera desde la app The Lamp o mediante comandos de voz con Alexa y Google Home.",
    coleccion: "mesa",
    precio: 39990,
    stock: 99,
    destacado: true,
    domotica: true,
    imagenes: [],
    medidas: { alto: 22, ancho: 17, profundidad: 17 },
    pesoKg: 0.2,
    colores: ["Blanco"],
    caracteristicas: [
      "Bombilla RGB inteligente incluida",
      "Control desde la app The Lamp",
      "Compatible con Alexa y Google Home",
      "Tres tamaños disponibles: S, M y L",
      "Fabricación bajo pedido",
    ],
    especificaciones: [
      { label: "Colección", valor: "thelamp · Cities" },
      { label: "Tamaño S", valor: "14 × 14 × 18 cm · $39.990 IVA incluido" },
      { label: "Tamaño M", valor: "17 × 17 × 22 cm · $44.990 IVA incluido" },
      { label: "Tamaño L", valor: "21 × 21 × 27 cm · $59.990 IVA incluido" },
      { label: "Pack 2 × M", valor: "$80.000 IVA incluido" },
      { label: "Iluminación", valor: "RGB inteligente" },
      { label: "Control", valor: "App The Lamp" },
      { label: "Asistentes", valor: "Alexa y Google Home" },
      { label: "Peso aprox. M", valor: "200 g con soquete y bombilla" },
    ],
  },
  {
    slug: "aura",
    nombre: "Aura",
    tagline: "Luz difusa para el velador",
    descripcion:
      "Una lámpara de mesa que no encandila. La pantalla estriada reparte la luz en todas las direcciones y deja una penumbra pareja, ideal para leer antes de dormir. Se atenúa desde el celular sin levantarse.",
    coleccion: "mesa",
    precio: 69900,
    stock: 12,
    destacado: true,
    domotica: true,
    imagenes: [],
    medidas: { alto: 28, ancho: 14, profundidad: 14 },
    pesoKg: 1.1,
    colores: ["Blanco hueso", "Negro mate", "Arena"],
    caracteristicas: [
      "Regulable de 1% a 100% sin parpadeo",
      "Temperatura de color de 2200K a 6500K",
      "Compatible con Google Home y Alexa",
      "Enciende y apaga por voz o por horario",
    ],
    especificaciones: [
      { label: "Potencia", valor: "9W" },
      { label: "Flujo luminoso", valor: "800 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, cable textil de 1,8 m" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
  {
    slug: "nimbo",
    nombre: "Nimbo",
    tagline: "Colgante sobre la mesa del comedor",
    descripcion:
      "Un volumen liviano que baja sobre la mesa sin tapar la conversación. La luz cae dirigida al plato y el resto del comedor queda en un ambiente cálido. Altura del cable regulable en la instalación.",
    coleccion: "colgante",
    precio: 119900,
    stock: 7,
    destacado: true,
    domotica: true,
    imagenes: [],
    medidas: { alto: 32, ancho: 30, profundidad: 30 },
    pesoKg: 1.9,
    colores: ["Blanco hueso", "Negro mate"],
    caracteristicas: [
      "Cable de acero regulable hasta 1,5 m",
      "Luz cálida de 2700K para la mesa",
      "Escenas guardadas: comida, sobremesa, noche",
      "Compatible con Google Home y Alexa",
    ],
    especificaciones: [
      { label: "Potencia", valor: "12W" },
      { label: "Flujo luminoso", valor: "1.100 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, instalación a caja de techo" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
  {
    slug: "halo",
    nombre: "Halo",
    tagline: "Aplique de muro que libera el velador",
    descripcion:
      "Se instala al costado de la cama y deja el velador despejado. Proyecta un arco de luz hacia arriba y otro hacia abajo, así sirve igual para leer que para dejar una luz de ambiente encendida.",
    coleccion: "muro",
    precio: 54900,
    precioAntes: 64900,
    stock: 18,
    destacado: true,
    domotica: true,
    imagenes: [],
    medidas: { alto: 22, ancho: 9, profundidad: 11 },
    pesoKg: 0.8,
    colores: ["Blanco hueso", "Negro mate", "Arena"],
    caracteristicas: [
      "Doble haz: lectura abajo, ambiente arriba",
      "Se controla por app sin interruptor de muro",
      "Modo amanecer: sube de intensidad de a poco",
      "Compatible con Google Home y Alexa",
    ],
    especificaciones: [
      { label: "Potencia", valor: "7W" },
      { label: "Flujo luminoso", valor: "600 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, incluye kit de anclaje" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
  {
    slug: "duna",
    nombre: "Duna",
    tagline: "Luz de ambiente para el rincón del living",
    descripcion:
      "Una lámpara de pie de perfil delgado, pensada para el rincón que siempre queda oscuro. Ilumina hacia el techo y el reflejo baja suave, sin sombras duras sobre la gente.",
    coleccion: "pie",
    precio: 179900,
    stock: 4,
    domotica: true,
    imagenes: [],
    medidas: { alto: 148, ancho: 26, profundidad: 26 },
    pesoKg: 4.6,
    colores: ["Negro mate", "Arena"],
    caracteristicas: [
      "1,48 m de alto, base estable de 26 cm",
      "Luz indirecta al techo, sin encandilar",
      "Se sincroniza con el resto de las lámparas",
      "Compatible con Google Home y Alexa",
    ],
    especificaciones: [
      { label: "Potencia", valor: "18W" },
      { label: "Flujo luminoso", valor: "1.800 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, cable textil de 2,5 m" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
  {
    slug: "sereno",
    nombre: "Sereno",
    tagline: "Compacta, para el escritorio",
    descripcion:
      "Ocupa poco y alumbra donde se necesita. El brazo se inclina para dirigir la luz al teclado o al cuaderno, y a las 19:00 pasa sola a luz cálida para no cortar el sueño.",
    coleccion: "mesa",
    precio: 49900,
    stock: 21,
    domotica: true,
    imagenes: [],
    medidas: { alto: 38, ancho: 12, profundidad: 18 },
    pesoKg: 0.9,
    colores: ["Blanco hueso", "Negro mate"],
    caracteristicas: [
      "Brazo inclinable de 90°",
      "Horarios automáticos por app",
      "Luz fría para trabajar, cálida de noche",
      "Compatible con Google Home y Alexa",
    ],
    especificaciones: [
      { label: "Potencia", valor: "8W" },
      { label: "Flujo luminoso", valor: "700 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, cable textil de 1,8 m" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
  {
    slug: "vertice",
    nombre: "Vértice",
    tagline: "Colgante largo para la isla de cocina",
    descripcion:
      "Formato alargado para colgar sobre una isla o un mesón largo. Reparte la luz a lo ancho en vez de dejar un círculo en el centro, así se puede cocinar sin trabajar en tu propia sombra.",
    coleccion: "colgante",
    precio: 149900,
    stock: 0,
    domotica: true,
    imagenes: [],
    medidas: { alto: 18, ancho: 90, profundidad: 12 },
    pesoKg: 2.7,
    colores: ["Negro mate"],
    caracteristicas: [
      "90 cm de largo, luz pareja de punta a punta",
      "Altura regulable hasta 1,5 m",
      "Modo cocina de 4000K a plena intensidad",
      "Compatible con Google Home y Alexa",
    ],
    especificaciones: [
      { label: "Potencia", valor: "22W" },
      { label: "Flujo luminoso", valor: "2.000 lúmenes" },
      { label: "Temperatura de color", valor: "2200K – 6500K regulable" },
      { label: "Índice de reproducción cromática", valor: "CRI 90+" },
      { label: "Conectividad", valor: "Wi-Fi 2,4 GHz" },
      { label: "Alimentación", valor: "220V, instalación a caja de techo" },
      { label: "Vida útil", valor: "25.000 horas" },
    ],
  },
]

export function obtenerProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug)
}

export function productosDestacados(): Producto[] {
  return productos.filter((p) => p.destacado)
}

export function productosPorColeccion(coleccion: Coleccion): Producto[] {
  return productos.filter((p) => p.coleccion === coleccion)
}
