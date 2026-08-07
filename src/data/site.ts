/**
 * Datos de la marca en un solo lugar. Si cambia el correo, el teléfono o la
 * dirección, se cambia acá y se actualiza en todo el sitio.
 */
export const site = {
  nombre: "The Lamp",
  nombreLargo: "The Lamp · Iluminación de diseño con domótica",
  descripcion:
    "Lámparas de diseño minimalista con luz inteligente. Se controlan desde el celular y funcionan con Google Home y Alexa. Envío a todo Chile.",
  // Se sobrescribe con NEXT_PUBLIC_SITE_URL en producción.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hola@thelab.solutions",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "56928785039",
  instagram: "https://www.instagram.com/thelab.solutions",
  direccion: {
    calle: "Zaragoza 8882",
    comuna: "Las Condes",
    region: "Región Metropolitana",
    pais: "CL",
  },
  horario: "Lun a Vie · 9:00–18:00",
  // The Lamp es una submarca: la empresa que factura sigue siendo la misma.
  empresa: {
    razonSocial: "Wast3d SpA",
    rut: "77.499.554-4",
    matriz: "The Lab Solutions",
    matrizUrl: "https://thelab.solutions",
  },
  /** Compras sobre este monto (con IVA) llevan despacho liberado. */
  despachoGratisDesde: 150000,
  garantiaMeses: 12,
} as const
