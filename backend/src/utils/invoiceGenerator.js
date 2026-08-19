import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";

export const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = "public/invoices";
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const fileName = `invoice_${order._id}.pdf`;
      const filePath = path.join(invoiceDir, fileName);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ----- HEADER -----
      doc
        .fontSize(20)
        .fillColor("#333333")
        .text("MyShop Pvt. Ltd.", { align: "center" })
        .moveDown(0.5);
      doc
        .fontSize(12)
        .fillColor("gray")
        .text("123 Business Street, Kolkata, India", { align: "center" })
        .text("support@myshop.com | +91-9876543210", { align: "center" })
        .moveDown(2);

      // ----- INVOICE TITLE -----
      doc
        .fontSize(16)
        .fillColor("#000000")
        .text("INVOICE", { align: "center", underline: true })
        .moveDown(2);

      // ----- CUSTOMER INFO -----
      doc.fontSize(12).fillColor("#000000");
      doc.text(`Invoice ID: ${order._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`);
      doc.text(`Customer: ${order.user?.name || "N/A"}`);
      doc.text(`Email: ${order.user?.email || "N/A"}`);
      doc.moveDown(2);

      // ----- TABLE HEADER -----
      doc.fontSize(12).fillColor("#333333").text("Items", 50, doc.y, {
        continued: true,
      });
      doc.text("Qty", 250, doc.y, { continued: true });
      doc.text("Price", 320, doc.y, { continued: true });
      doc.text("Subtotal", 400, doc.y);

      doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
      doc.moveDown(0.5);

      // ----- ITEMS -----
      order.items.forEach((item, index) => {
        const price =
          item.discountedPrice || item.finalPrice || item.price || 0;
        const subtotal = price * item.quantity;

        doc.fillColor("#000000").fontSize(11);
        doc.text(`${item.name}`, 50, doc.y, { continued: true });
        doc.text(`${item.quantity}`, 250, doc.y, { continued: true });
        doc.text(`₹${price.toLocaleString()}`, 320, doc.y, { continued: true });
        doc.text(`₹${subtotal.toLocaleString()}`, 400, doc.y);

        doc.moveDown(0.3);
      });

      doc.moveDown(2);

      // ----- TOTALS -----
      doc.fontSize(12).fillColor("#000000");
      doc.text(`Original Total: ₹${order.totalOriginalAmount?.toLocaleString() || 0}`, {
        align: "right",
      });
      doc.text(`Discount: -₹${order.totalDiscount?.toLocaleString() || 0}`, {
        align: "right",
      });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor("#006400").text(
        `Final Paid: ₹${order.totalAmount?.toLocaleString() || 0}`,
        { align: "right", underline: true }
      );

      // ----- FOOTER -----
      doc.moveDown(4);
      doc
        .fontSize(12)
        .fillColor("gray")
        .text("Thank you for shopping with us!", { align: "center" })
        .text("For support, contact support@myshop.com", { align: "center" });

      // END DOC
      doc.end();

      stream.on("finish", () => resolve(`/invoices/${fileName}`));
    } catch (err) {
      reject(err);
    }
  });
};
