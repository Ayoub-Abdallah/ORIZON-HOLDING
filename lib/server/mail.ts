import "server-only";
import nodemailer from "nodemailer";
import { site } from "@/lib/content";

// Sends a notification to the team inbox. Configure SMTP_* env vars
// (e.g. Gmail with an app password). Without them, notifications are logged only.

let transporter: nodemailer.Transporter | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  transporter =
    SMTP_HOST && SMTP_USER && SMTP_PASS
      ? nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT ?? 465),
          secure: Number(SMTP_PORT ?? 465) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        })
      : null;
  return transporter;
}

export async function notifyTeam(opts: { subject: string; fields: Record<string, unknown>; replyTo?: string }) {
  const lines = Object.entries(opts.fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
  const text = lines.join("\n");

  const t = getTransporter();
  if (!t) {
    console.info(`[notify] ${opts.subject}\n${text}`);
    return;
  }
  try {
    await t.sendMail({
      from: `"ORIZON Website" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL ?? site.email,
      replyTo: opts.replyTo,
      subject: `[ORIZON] ${opts.subject}`,
      text,
    });
  } catch (err) {
    // A failed email must never lose the submission — it is already stored.
    console.error("[notify] email failed", err);
  }
}
