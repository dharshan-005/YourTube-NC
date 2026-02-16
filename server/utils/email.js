import nodemailer from "nodemailer";
import Auth from "../models/Auth.js";

export const sendInvoiceEmail = async (userId, invoicePath, plan) => {
  const user = await Auth.findById(userId);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("EMAIL:", process.env.EMAIL);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Payment Successful - Subscription Activated",
    text: `Your ${plan} plan is activated successfully.`,
    attachments: [
      {
        filename: "invoice.pdf",
        path: invoicePath,
      },
    ],
  });
};
