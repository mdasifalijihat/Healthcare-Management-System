import nodemailer from "nodemailer";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  subject,
  to,
  templateData,
  templateName,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Email sending Error:", error.message);
    }

    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
