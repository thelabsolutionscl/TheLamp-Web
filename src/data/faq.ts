import { site } from "./site"

export const faq: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Necesito comprar algo más para que funcione la domótica?",
    respuesta:
      "No. La lámpara se conecta sola a tu Wi-Fi de 2,4 GHz y desde ahí la controlas con la app. Si además quieres prenderla por voz, la vinculas a Google Home o Alexa desde la misma app. No hace falta un hub ni un puente aparte.",
  },
  {
    pregunta: "¿Funciona si se me cae internet?",
    respuesta:
      "Sí. Sin internet pierdes el control por app y por voz, pero la lámpara sigue prendiendo y apagando con su interruptor y mantiene la última configuración de luz que le dejaste.",
  },
  {
    pregunta: "¿Se puede atenuar de verdad o solo tiene modos fijos?",
    respuesta:
      "Se atenúa de forma continua, de 1% a 100%, y sin parpadeo. También cambias la temperatura de color entre 2200K (muy cálida, de noche) y 6500K (fría, para trabajar).",
  },
  {
    pregunta: "¿Cuánto demora el despacho?",
    respuesta:
      "Entre 2 y 3 días hábiles en la Región Metropolitana y entre 3 y 12 días hábiles en regiones, según la zona. El costo exacto y el plazo te aparecen en el checkout antes de pagar. Sobre $150.000 el despacho va liberado.",
  },
  {
    pregunta: "¿Qué garantía tienen?",
    respuesta: `${site.garantiaMeses} meses de garantía por falla de fabricación. Si la lámpara falla en ese plazo, la retiramos, la revisamos y la reponemos o reparamos sin costo.`,
  },
  {
    pregunta: "¿Puedo cambiar o devolver una lámpara?",
    respuesta:
      "Sí. Tienes 10 días corridos desde que la recibes para pedir el cambio o la devolución, siempre que venga en su caja y sin uso. El costo del despacho de vuelta lo asumimos nosotros solo si el producto llegó fallado.",
  },
  {
    pregunta: "¿Emiten boleta o factura?",
    respuesta:
      "Las dos. La boleta electrónica te llega al correo junto con la confirmación del pedido. Si necesitas factura, escríbenos con tu razón social, RUT y giro y la emitimos.",
  },
  {
    pregunta: "¿Hacen diseños a pedido?",
    respuesta: `Sí, para proyectos de hotelería, restaurantes y oficinas. Escríbenos a ${site.email} con el proyecto y te cotizamos.`,
  },
]
