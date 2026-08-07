#!/usr/bin/env node
/**
 * Ver y ajustar el stock sin escribir SQL.
 *
 *   npm run stock                  → lista el stock de producción
 *   npm run stock -- aura 20       → deja la Aura en 20 unidades
 *   npm run stock -- --local       → lista el stock del entorno local
 *   npm run stock -- --local aura 5
 *
 * Es el reemplazo del "editar products.ts a mano": una vez publicado un
 * producto, el stock vive en D1 y se descuenta solo con cada venta. Este
 * script es para cuando llega mercadería nueva.
 */
import { spawnSync } from "node:child_process"

const BASE = "thelamp-web"

const args = process.argv.slice(2)
const local = args.includes("--local")
const [slug, cantidadCruda] = args.filter((a) => !a.startsWith("--"))

function ejecutar(sql) {
  const resultado = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      BASE,
      local ? "--local" : "--remote",
      "--command",
      sql,
    ],
    { stdio: "inherit" }
  )
  if (resultado.status !== 0) process.exit(resultado.status ?? 1)
}

if (!slug) {
  console.log(`\nStock ${local ? "local" : "de producción"}:\n`)
  ejecutar("SELECT slug, cantidad, actualizado FROM stock ORDER BY slug")
  console.log("\nPara cambiarlo:  npm run stock -- <producto> <cantidad>")
  console.log("Por ejemplo:     npm run stock -- aura 20\n")
  process.exit(0)
}

const cantidad = Number(cantidadCruda)
if (!Number.isInteger(cantidad) || cantidad < 0) {
  console.error(
    `\nLa cantidad tiene que ser un número entero de 0 para arriba. Recibí: "${cantidadCruda ?? ""}"\n` +
      "Ejemplo correcto:  npm run stock -- aura 20\n"
  )
  process.exit(1)
}

// El slug se valida contra una lista blanca de caracteres antes de meterlo en
// el SQL. Es un script local, pero un slug con comillas rompería la consulta.
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`\nEl nombre de producto "${slug}" no es válido.`)
  console.error("Usa el slug tal como aparece en src/data/products.ts, por ejemplo: aura\n")
  process.exit(1)
}

console.log(`\nDejando ${slug} en ${cantidad} unidades${local ? " (local)" : ""}…\n`)
ejecutar(
  `UPDATE stock SET cantidad = ${cantidad}, actualizado = '${new Date().toISOString()}' WHERE slug = '${slug}'`
)
console.log("\nStock actualizado:\n")
ejecutar(`SELECT slug, cantidad FROM stock WHERE slug = '${slug}'`)
