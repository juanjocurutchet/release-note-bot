import nodemailer from "nodemailer";

export const sendReleaseNoteEmail = async (
  buffer: Buffer,
  fileName: string,
  recipients: string[]
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(", "),
    subject: "Release Note generado",
    text: "Se adjunta el archivo generado automáticamente.",
    attachments: [
      {
        filename: fileName,
        content: buffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✉️  Email enviado:", info.response);
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
  }
};

