import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "Falta configurar las variables de entorno SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = getTransport();
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to,
    subject: "Recupera tu contraseña - Gestion Serviprac",
    text: `Recibimos una solicitud para restablecer tu contraseña. Abre este enlace para continuar (válido por 1 hora):\n\n${resetUrl}\n\nSi no solicitaste esto, ignora este correo.`,
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p><a href="${resetUrl}">Haz clic aquí para elegir una nueva contraseña</a> (el enlace vence en 1 hora).</p>
      <p>Si no solicitaste esto, puedes ignorar este correo.</p>
    `,
  });
}
