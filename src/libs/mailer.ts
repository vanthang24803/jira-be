import "dotenv/config";
import nodemailer from "nodemailer";

const mailerOptions = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASSWORD || "",
  },
};

const transporter = nodemailer.createTransport(mailerOptions, {
  logger: true,
});

export const sendMail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: {
      name: "Jira Administrator",
      address: process.env.MAIL_USER || "",
    },
    to,
    subject,
    html: body,
  });
};
