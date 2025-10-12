import nodemailer from "nodemailer";

export async function sendContactEmail({ name, email, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // default true; set to false only for local testing/self-signed
      rejectUnauthorized: false,
    },
  });

  // Optional: verify connection config
  // await transporter.verify().catch(() => {});

  const mailOptions = {
    from: process.env.SMTP_USER, // default from address
    to: process.env.SMTP_USER, // default to your SMTP user
    subject: `New contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  };

  await transporter.sendMail(mailOptions);
}
