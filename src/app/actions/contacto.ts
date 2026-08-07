"use server"

import { site } from "@/data/site"

export type EstadoContacto = {
  estado: "inicial" | "ok" | "error"
  mensaje?: string
}

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

const texto = (fd: FormData, clave: string, max: number) =>
  ((fd.get(clave) as string | null) ?? "").trim().slice(0, max)

export async function enviarContacto(
  _anterior: EstadoContacto,
  formData: FormData
): Promise<EstadoContacto> {
  // Honeypot: si viene relleno es un bot. Se finge éxito para no darle pistas.
  if (texto(formData, "empresa_web", 200)) {
    return { estado: "ok", mensaje: "Mensaje enviado. Te respondemos pronto." }
  }

  const nombre = texto(formData, "nombre", 120)
  const email = texto(formData, "email", 160)
  const mensaje = texto(formData, "mensaje", 4000)

  if (!nombre || !mensaje) {
    return { estado: "error", mensaje: "Falta tu nombre o el mensaje." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { estado: "error", mensaje: "El correo no es válido." }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[contacto] RESEND_API_KEY no configurada")
    return {
      estado: "error",
      mensaje: `No pudimos enviar el mensaje. Escríbenos directo a ${site.email}.`,
    }
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: `${site.nombre} <${process.env.EMAIL_REMITENTE ?? site.email}>`,
      to: process.env.EMAIL_PEDIDOS ?? site.email,
      replyTo: email,
      subject: `Consulta de ${nombre} — The Lamp`,
      html: `
        <p><strong>Nombre:</strong> ${esc(nombre)}</p>
        <p><strong>Correo:</strong> ${esc(email)}</p>
        <p style="margin-top:16px"><strong>Mensaje:</strong></p>
        <p style="white-space:pre-line">${esc(mensaje)}</p>`,
      text: `Nombre: ${nombre}\nCorreo: ${email}\n\n${mensaje}`,
    })
  } catch (err) {
    // No se finge éxito: si el correo no salió, el visitante tiene que saberlo
    // para escribirnos por otra vía.
    console.error("[contacto] Resend falló:", err)
    return {
      estado: "error",
      mensaje: `No pudimos enviar el mensaje. Escríbenos directo a ${site.email} o por WhatsApp.`,
    }
  }

  return {
    estado: "ok",
    mensaje: "Mensaje enviado. Te respondemos el mismo día hábil.",
  }
}
