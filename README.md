# TheLamp-Web

Tienda online de **The Lamp**, la submarca de lámparas de The Lab Solutions.

Misma línea gráfica que thelab.solutions (negro `#0a0a0a`, Montserrat +
DM Sans) con un solo cambio: el acento es el celeste `#5badde` del logo, en
vez del teal de la marca madre. Los halos de luz del fondo se quedan cálidos
a propósito: representan luz de lámpara, no color de marca.

- **Stack:** Next.js 16 + React 19 + Tailwind 4, deploy en Cloudflare Workers
  vía `@opennextjs/cloudflare`.
- **Pagos:** Flow.cl (tarjetas, Webpay y transferencia).
- **Pedidos:** Cloudflare KV.
- **Inventario:** Cloudflare D1. El stock se descuenta solo con cada venta.
- **Emails:** Resend.

---

## 1. Levantarlo en tu computador

1. Abre la Terminal y entra a la carpeta del proyecto.
2. Escribe `npm install` y presiona Enter. Termina cuando aparece
   `added N packages`.
3. Escribe `npm run dev` y presiona Enter.
4. Abre `http://localhost:3000` en el navegador. Deberías ver la portada
   con el titular "Lámparas que saben cuándo bajar la luz".

Para apagarlo: en la Terminal aprieta `Ctrl` + `C`.

---

## 2. Cambiar precios, stock y textos

Todo el catálogo está en un solo archivo: **`src/data/products.ts`**.

1. Abre ese archivo.
2. Busca el producto por su `nombre`.
3. Cambia lo que necesites:
   - `precio`: en pesos, **con IVA incluido** y sin puntos. `89900` se
     muestra como `$89.900`.
   - `destacado: true`: lo muestra en la portada.
   - `stock`: **solo el stock inicial**, para productos nuevos. Ver el
     punto 2.1: una vez publicado, el stock se maneja con otro comando.
4. Guarda el archivo. Si tenías `npm run dev` corriendo, el cambio se ve al
   tiro en el navegador.
5. Para que quede publicado, haz deploy (paso 6).

### 2.1 Reponer stock

El stock se descuenta **solo** cada vez que Flow confirma un pago. Ya no hay
que editar nada a mano después de vender. Cuando llegue mercadería nueva:

1. Para ver cómo está el stock hoy:

   ```
   npm run stock
   ```

2. Para dejar un producto en una cantidad determinada:

   ```
   npm run stock -- aura 20
   ```

   Deja la Aura en 20 unidades. El nombre es el `slug` que aparece en
   `src/data/products.ts` (`aura`, `nimbo`, `halo`, `duna`, `sereno`,
   `vertice`).

3. El cambio se ve en la web dentro de un minuto. No hace falta deploy.

Cambiar el número `stock` en `products.ts` **no** repone nada: ese valor solo
se usa la primera vez, para sembrar un producto nuevo.

Otros archivos de datos:

| Archivo                  | Qué contiene                                  |
| ------------------------ | --------------------------------------------- |
| `src/data/site.ts`       | Correo, teléfono, dirección, monto de despacho liberado, meses de garantía |
| `src/data/shipping.ts`   | Zonas de despacho, costos y plazos             |
| `src/data/faq.ts`        | Preguntas frecuentes                           |

---

## 3. Poner el logo

Hoy el sitio dibuja la ampolleta del logo en vectores y pone **THE LAMP** al
lado en Montserrat. Se hizo así porque el logo original es apilado (THE
arriba, LAMP abajo) y en la barra superior, a 22 px de alto, cada línea
quedaría en 9 px: ilegible.

Si consigues una **versión horizontal de una sola línea**:

1. Guárdala como **`public/logo.png`** (PNG con fondo transparente,
   1200 px de ancho o más).
2. Abre `src/components/layout/Logo.tsx`.
3. Cambia la línea `const LOGO_SRC = ""` por `const LOGO_SRC = "/logo.png"`.
4. En la línea siguiente, ajusta `LOGO_RATIO` al ancho ÷ alto real de tu
   archivo. Si el logo mide 1200 × 260, escribe `4.6`.
5. Guarda. El logo se actualiza de una vez en el header, el menú móvil y el
   footer.

Para el favicon: borra `src/app/icon.tsx` y deja tu isotipo como
`src/app/icon.png` (cuadrado, mínimo 512 × 512).

---

## 4. Poner las fotos de producto

1. Guarda las fotos en `public/images/productos/`, con nombres claros:
   `aura-1.jpg`, `aura-2.jpg`, etc.
2. Abre `src/data/products.ts`.
3. En el producto correspondiente, cambia `imagenes: []` por:

   ```ts
   imagenes: [
     { src: "/images/productos/aura-1.jpg", alt: "Lámpara Aura encendida sobre un velador" },
     { src: "/images/productos/aura-2.jpg", alt: "Detalle de la pantalla estriada de la Aura" },
   ],
   ```

4. El texto de `alt` describe la foto para quien no puede verla y para
   Google. Escríbelo en serio, no repitas el nombre del producto.

Mientras `imagenes` esté vacío, el sitio dibuja una silueta de la lámpara
con su halo de luz y la leyenda "Foto próximamente".

---

## 5. Configurar los pagos con Flow

### 5.1 Sacar las credenciales

1. Entra a `https://www.flow.cl` e inicia sesión con la cuenta de la
   empresa.
2. En el menú de la izquierda haz clic en **Configuración**.
3. Haz clic en **Datos para integración**.
4. Vas a ver dos valores: **API Key** y **Secret Key**. Cópialos.

### 5.2 Probar en modo sandbox

1. En la carpeta del proyecto, copia el archivo `.env.example` y llámalo
   `.env.local`.
2. Ábrelo y rellena:

   ```
   FLOW_API_KEY=<tu API Key>
   FLOW_SECRET_KEY=<tu Secret Key>
   FLOW_ENTORNO=sandbox
   ```

3. Para que Flow pueda devolverte el resultado del pago necesita alcanzar tu
   computador desde internet. En otra Terminal, ejecuta:

   ```
   npx cloudflared tunnel --url http://localhost:3000
   ```

4. Copia la dirección que te entrega (algo como
   `https://xxxx.trycloudflare.com`) y pégala en `.env.local`:

   ```
   NEXT_PUBLIC_SITE_URL=https://xxxx.trycloudflare.com
   ```

5. Reinicia `npm run dev` para que tome las variables nuevas.
6. Entra a la dirección del túnel, agrega una lámpara al carrito y llega
   hasta **Pagar**. Te debería llevar a la pasarela de Flow en modo prueba.

### 5.3 Pasar a producción

Cuando ya probaste, cambia `FLOW_ENTORNO` a `produccion` en los secrets del
Worker (paso 6.4).

---

## 6. Publicar el sitio

### 6.1 Crear el espacio para los pedidos (una sola vez)

1. En la Terminal, dentro de la carpeta del proyecto, escribe:

   ```
   npx wrangler kv namespace create PEDIDOS
   ```

2. Te va a responder con un bloque que incluye un `id` largo. Cópialo.
3. Abre `wrangler.jsonc`.
4. Busca `"id": "REEMPLAZAR_CON_EL_ID_QUE_ENTREGA_WRANGLER"` y pega el id
   que copiaste, entre las comillas.
5. Guarda el archivo.

### 6.2 Crear la base del inventario (una sola vez)

1. En la Terminal escribe:

   ```
   npx wrangler d1 create thelamp-web
   ```

2. Te va a responder con un bloque que incluye un `database_id`. Cópialo.
3. Abre `wrangler.jsonc`.
4. Busca `"database_id": "REEMPLAZAR_CON_EL_ID_QUE_ENTREGA_WRANGLER"` y pega
   el id que copiaste, entre las comillas.
5. Guarda el archivo.

La tabla de stock se crea y se llena sola con los valores de `products.ts`
la primera vez que alguien entre a la tienda. No hay migración que correr.

### 6.3 Crear el bucket de caché (una sola vez)

```
npx wrangler r2 bucket create thelamp-web-cache
```

### 6.4 Cargar las claves secretas (una sola vez)

Ejecuta estos comandos uno por uno. Cada uno te va a pedir el valor y no lo
muestra en pantalla mientras lo escribes — es normal.

```
npx wrangler secret put FLOW_API_KEY
npx wrangler secret put FLOW_SECRET_KEY
npx wrangler secret put FLOW_ENTORNO
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NEXT_PUBLIC_SITE_URL
```

En `FLOW_ENTORNO` escribe `produccion`. En `NEXT_PUBLIC_SITE_URL` escribe la
dirección final del sitio, con `https://` y **sin** barra al final.

### 6.5 Deploy

```
npm run deploy
```

Termina mostrando la URL del Worker. Ábrela y revisa que la portada cargue.

### 6.6 Conectar el dominio

1. Entra al panel de Cloudflare y haz clic en **Workers & Pages**.
2. Haz clic en **thelamp-web**.
3. Anda a la pestaña **Settings** y luego a **Domains & Routes**.
4. Haz clic en **Add** → **Custom domain**.
5. Escribe el dominio que vas a usar y haz clic en **Add domain**.
6. Cloudflare crea el registro DNS solo. En un par de minutos el sitio
   responde en tu dominio.
7. **Vuelve a cargar el secret `NEXT_PUBLIC_SITE_URL`** con el dominio
   definitivo y haz `npm run deploy` de nuevo. Si no, Flow va a devolver a
   los compradores a la URL vieja.

---

## 7. Cómo funciona un pago, paso a paso

Sirve para saber dónde mirar cuando algo falle:

1. El comprador aprieta **Pagar** en `/checkout`.
2. El server action `src/app/actions/checkout.ts` **recalcula el total desde
   `src/data/products.ts`**. El precio que manda el navegador se ignora por
   completo — es el punto de seguridad más importante del sitio.
3. Se guarda el pedido en KV con estado `pendiente` y se crea el pago en
   Flow.
4. El comprador va a Flow y paga.
5. Flow llama servidor a servidor a `/api/pago/confirmar`. Esa ruta consulta
   el estado real del pago, **compara el monto contra el pedido guardado** y
   recién ahí lo marca como `pagado`.
6. Se descuenta el stock en D1 con un `UPDATE` que solo aplica si alcanza. Si
   no alcanzara (dos compras del último producto en el mismo segundo), el
   pedido queda marcado y el correo interno llega con el asunto
   "⚠ REVISAR" para que devuelvas el dinero o repongas.
7. Se mandan los correos: confirmación al comprador y copia interna.
8. El comprador vuelve por `/api/pago/retorno`, que solo lo redirige a
   `/pedido/<numero>`. Esa página no cambia nada: si el webhook todavía no
   llega, muestra "estamos confirmando tu pago".

Los errores quedan en los logs del Worker. Para verlos:

```
npx wrangler tail thelamp-web
```

---

## 8. Lo que falta (fase 2)

Cosas que se dejaron fuera a propósito y hay que resolver antes de escalar:

- **Boleta electrónica del SII.** Hoy se emite aparte. El pedido ya guarda
  el RUT, así que conectarlo al emisor es directo.
- **Panel de pedidos.** Los pedidos viven en KV y se consultan por URL o por
  el correo interno. Falta la vista dentro del dashboard de The Lab.
- **Seguimiento de envíos.** Hoy el número de seguimiento se manda a mano.
- **Revisión legal.** Los textos de `/terminos` y `/privacidad` están
  escritos según la Ley 19.496 y la 19.628, pero no los revisó un abogado.

---

## Comandos

| Comando          | Qué hace                                         |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Levanta el sitio en `localhost:3000`              |
| `npm run build`  | Compila y avisa si hay errores                    |
| `npm run lint`   | Revisa el código                                  |
| `npm run stock`  | Ve o ajusta el stock (ver 2.1)                    |
| `npm run preview`| Lo prueba tal como va a correr en Cloudflare      |
| `npm run deploy` | Publica                                           |
