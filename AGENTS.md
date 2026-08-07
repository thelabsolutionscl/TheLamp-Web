<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Contexto de negocio

- The Lamp (submarca de The Lab Solutions) vende lámparas de diseño
  minimalista con domótica: se controlan desde el celular y funcionan con
  Google Home y Alexa.
- **Nunca mencionar impresión 3D ni PLA en el sitio.** El material es un
  detalle de producción, no un argumento de venta. Lo que se destaca es el
  diseño, la calidad de la luz y la domótica.
- Operación chica, sin equipo de ingeniería. Optimiza para que una sola
  persona pueda mantener lo que construyas.

# Cómo responder

- Español chileno. Directo, sin preámbulo.
- Si algo es mala idea, dilo antes de implementarlo.
- Muestra el resultado funcionando antes de los pasos de deploy.
- Instrucciones siempre paso a paso, numeradas y click por click. Nombra el
  botón o menú exacto y qué debería verse después de cada paso.
- Antes de diagnosticar, pide los datos. No recomendar sobre supuestos.

# Stack de este repo

- Next.js 16 + React 19, deploy en Cloudflare Workers vía
  `@opennextjs/cloudflare` (`npm run deploy`), config en `wrangler.jsonc`.
- Pagos: Flow.cl (Webpay, tarjetas y transferencia). Firma HMAC-SHA256 con
  Web Crypto — nada de librerías de Node, el Worker corre en el edge.
- Pedidos: Cloudflare KV (binding `PEDIDOS`). Es el único estado del sitio.
- Email transaccional: Resend.
- Moneda: CLP sin decimales, formato $1.234.567. IVA 19% siempre explícito.
- Fechas: DD-MM-AAAA.

# Línea gráfica

Hereda de thelab.solutions y **no se desvía de eso**:

- Fondo `#0a0a0a`, superficies `#141414` / `#1a1a1a`, borde `#2a2a2a`.
- Títulos en Montserrat (600/700), texto en DM Sans (300/400/500).
- La diferencia con la marca madre es un solo token: el acento es ámbar
  cálido `#ffb454` en vez del teal `#00d4cc` de The Lab.

# Reglas de trabajo

- No crear archivos nuevos si se puede editar uno existente.
- Antes de un refactor grande, proponer el plan y esperar confirmación.
- Commits en español, imperativo, una línea.
- **El precio de un pedido se recalcula siempre en el servidor desde
  `src/data/products.ts`.** Nunca confiar en el precio que manda el
  navegador.
