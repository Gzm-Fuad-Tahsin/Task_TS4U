import nodemailer from "nodemailer";

interface MailOptions {
    to: string;
    subject: string;
    message: string;
  }

const sendMail = async (options: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.message,
    importance: "high",
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
