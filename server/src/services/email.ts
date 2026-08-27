import nodemailer from "nodemailer"
import { env, isEmailConfigured } from "../config/env.js"
import type { EnquiryDocument } from "../models/Enquiry.js"

function buildEnquiryEmailHtml(enquiry: EnquiryDocument): string {
  const rows = [
    ["Reference", enquiry.referenceId],
    ["Name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Email", enquiry.email || "—"],
    ["Company", enquiry.company || "—"],
    ["Product", enquiry.product],
    ["Project type", enquiry.projectType || "—"],
    ["Location", enquiry.projectLocation],
    ["Colour", enquiry.colour || "—"],
    ["Thickness", enquiry.thickness || "—"],
    ["Length", enquiry.length || "—"],
    ["Area", enquiry.area || "—"],
    ["Quantity", enquiry.quantity || "—"],
    ["Surface material", enquiry.surfaceMaterial || "—"],
    ["Application", enquiry.application || "—"],
    ["Delivery timeline", enquiry.deliveryTimeline || "—"],
    ["Message", enquiry.message || "—"],
    ["Source", enquiry.source],
  ]

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;background:#f5f7f8">${label}</td><td style="padding:8px 12px;border:1px solid #ddd">${value}</td></tr>`
    )
    .join("")

  return `
    <div style="font-family:Arial,sans-serif;color:#171a1f;max-width:640px">
      <h2 style="color:#102a43">New MountRoof Enquiry — ${enquiry.referenceId}</h2>
      <p>A new lead was submitted on the website.</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px">${tableRows}</table>
      ${
        enquiry.productUrl
          ? `<p style="margin-top:16px"><a href="${enquiry.productUrl}">View product page</a></p>`
          : ""
      }
    </div>
  `
}

export async function sendEnquiryNotificationEmail(
  enquiry: EnquiryDocument
): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    if (env.NODE_ENV === "development") {
      console.log("[email] SMTP not configured — enquiry saved but email skipped:", enquiry.referenceId)
    }
    return { sent: false, error: "SMTP not configured" }
  }

  const { getSalesEmail } = await import("./siteSettings.js")
  const to = (await getSalesEmail()) || env.ADMIN_EMAIL
  const from = env.MAIL_FROM || env.SMTP_USER || env.ADMIN_EMAIL

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"MountRoof Website" <${from}>`,
      to,
      subject: `New Enquiry ${enquiry.referenceId} — ${enquiry.product}`,
      text: [
        `New enquiry: ${enquiry.referenceId}`,
        `Name: ${enquiry.name}`,
        `Phone: ${enquiry.phone}`,
        `Email: ${enquiry.email || "—"}`,
        `Product: ${enquiry.product}`,
        `Location: ${enquiry.projectLocation}`,
        `Project type: ${enquiry.projectType}`,
        enquiry.message ? `Message: ${enquiry.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      html: buildEnquiryEmailHtml(enquiry),
    })
    return { sent: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed"
    console.error("[email] Failed to send enquiry notification:", message)
    return { sent: false, error: message }
  }
}
