import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = async (userId, plan, amount, transactionId) => {
  const invoicesDir = path.join("invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const invoicePath = path.join(invoicesDir, `invoice-${transactionId}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(invoicePath));

  doc.fontSize(20).text("Subscription Invoice");
  doc.moveDown();
  doc.text(`User ID: ${userId}`);
  doc.text(`Plan: ${plan}`);
  doc.text(`Amount: ₹${amount}`);
  doc.text(`Transaction ID: ${transactionId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  return invoicePath;
};
