import nodemailer from "nodemailer";

export const sendReleaseNoteEmail = async (
  buffer: Buffer,
  filename: string,
  recipients: string[]
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER!,
    to: recipients,
    subject: "Release Note Automático",
    text: "Adjunto encontrarás el release note del sprint actual.",
    attachments: [
      {
        filename,
        content: buffer,
      },
    ],
  });
};
