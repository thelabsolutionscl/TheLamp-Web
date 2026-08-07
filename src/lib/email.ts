import "server-only"
import { clp, fechaCL } from "@/lib/format"
import { site } from "@/data/site"
import type { Pedido } from "@/lib/orders"

/** Escapa lo que escribió el comprador antes de meterlo en el HTML del email. */
function esc(valor: string): string {
  return valor.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;"
  )
}

function filas(pedido: Pedido): string {
  return pedido.items
    .map(
      (l) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee">
            ${esc(l.nombre)}${l.color ? ` · ${esc(l.color)}` : ""}<br>
            <span style="color:#888;font-size:13px">${l.cantidad} × ${clp(l.precioUnitario)}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
            ${clp(l.subtotal)}
          </td>
        </tr>`
    )
    .join("")
}

function cuerpoHtml(pedido: Pedido, paraCliente: boolean): string {
  const t = pedido.totales
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <h1 style="font-size:20px;margin:0 0 4px">
      ${paraCliente ? "¡Gracias por tu compra!" : "Nuevo pedido pagado"}
    </h1>
    <p style="color:#666;margin:0 0 24px;font-size:14px">
      Pedido <strong>${esc(pedido.numero)}</strong> · ${fechaCL(pedido.creado)}
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${filas(pedido)}
      <tr>
        <td style="padding:10px 0;color:#666">Despacho — ${esc(pedido.despacho.zonaNombre)}</td>
        <td style="padding:10px 0;text-align:right">
          ${t.despacho === 0 ? "Liberado" : clp(t.despacho)}
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#666">Neto</td>
        <td style="padding:4px 0;text-align:right;color:#666">${clp(t.neto)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0 12px;color:#666">IVA 19%</td>
        <td style="padding:4px 0 12px;text-align:right;color:#666">${clp(t.iva)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-top:2px solid #1a1a1a;font-weight:600">Total pagado</td>
        <td style="padding:12px 0;border-top:2px solid #1a1a1a;text-align:right;font-weight:600">
          ${clp(t.total)}
        </td>
      </tr>
    </table>

    <h2 style="font-size:15px;margin:28px 0 8px">Despacho</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#444">
      ${esc(pedido.cliente.nombre)}<br>
      ${esc(pedido.despacho.direccion)}<br>
      ${esc(pedido.despacho.comuna)}, ${esc(pedido.despacho.region)}<br>
      ${pedido.despacho.referencia ? `${esc(pedido.despacho.referencia)}<br>` : ""}
      ${esc(pedido.cliente.telefono)}
    </p>
    <p style="margin:12px 0 0;font-size:14px;color:#666">
      Plazo estimado: ${esc(pedido.despacho.plazo)}.
    </p>

    ${
      paraCliente
        ? `<p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#444">
             Te avisamos por correo apenas salga el envío. Si necesitas algo,
             responde este mensaje o escríbenos a
             <a href="mailto:${site.email}" style="color:#c07a1e">${site.email}</a>.
           </p>
           <p style="margin:24px 0 0;font-size:12px;color:#999">
             ${site.nombre} · una marca de ${site.empresa.matriz} ·
             ${site.empresa.razonSocial}, RUT ${site.empresa.rut}
           </p>`
        : `${
            pedido.revisar
              ? `<p style="margin:24px 0 0;padding:12px 14px;background:#fff4e5;border-left:3px solid #c07a1e;font-size:14px;line-height:1.6;color:#7a4a00">
                   <strong>Revisar este pedido.</strong><br>${esc(pedido.revisar)}
                 </p>`
              : ""
          }
           <p style="margin:28px 0 0;font-size:14px;color:#444">
             Correo del comprador: ${esc(pedido.cliente.email)}<br>
             RUT: ${esc(pedido.cliente.rut)}<br>
             Medio de pago: ${esc(pedido.pago?.medio ?? "—")}<br>
             Stock descontado: ${pedido.stockDescontado ? "sí" : "NO"}
           </p>`}
    }
  </div>`
}

function cuerpoTexto(pedido: Pedido): string {
  const t = pedido.totales
  return [
    `Pedido ${pedido.numero} — ${fechaCL(pedido.creado)}`,
    "",
    ...pedido.items.map(
      (l) =>
        `${l.cantidad} × ${l.nombre}${l.color ? ` (${l.color})` : ""} — ${clp(l.subtotal)}`
    ),
    `Despacho ${pedido.despacho.zonaNombre}: ${t.despacho === 0 ? "liberado" : clp(t.despacho)}`,
    `Neto ${clp(t.neto)} + IVA ${clp(t.iva)}`,
    `Total pagado: ${clp(t.total)}`,
    "",
    "Despacho a:",
    pedido.cliente.nombre,
    pedido.despacho.direccion,
    `${pedido.despacho.comuna}, ${pedido.despacho.region}`,
    pedido.cliente.telefono,
    `Plazo estimado: ${pedido.despacho.plazo}`,
  ].join("\n")
}

/**
 * Manda la confirmación al comprador y la copia interna.
 *
 * Nunca lanza: si Resend se cae, el pedido igual está pagado y guardado en KV,
 * y romper el webhook haría que Flow lo reintente en loop. El error queda en
 * los logs del Worker para revisarlo.
 */
export async function enviarConfirmacion(pedido: Pedido): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error(
      `[email] RESEND_API_KEY no configurada — pedido ${pedido.numero} sin confirmación`
    )
    return
  }

  const remitente = process.env.EMAIL_REMITENTE ?? site.email
  const interno = process.env.EMAIL_PEDIDOS ?? site.email

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: `${site.nombre} <${remitente}>`,
      to: pedido.cliente.email,
      replyTo: site.email,
      subject: `Pedido ${pedido.numero} confirmado`,
      html: cuerpoHtml(pedido, true),
      text: cuerpoTexto(pedido),
    })

    await resend.emails.send({
      from: `${site.nombre} <${remitente}>`,
      to: interno,
      replyTo: pedido.cliente.email,
      subject: pedido.revisar
        ? `⚠ REVISAR pedido ${pedido.numero} — ${clp(pedido.totales.total)}`
        : `Nuevo pedido ${pedido.numero} — ${clp(pedido.totales.total)}`,
      html: cuerpoHtml(pedido, false),
      text: cuerpoTexto(pedido),
    })
  } catch (err) {
    console.error(`[email] falló el envío del pedido ${pedido.numero}:`, err)
  }
}
