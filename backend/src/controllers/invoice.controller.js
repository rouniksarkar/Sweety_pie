import { Order } from "../models/order.model.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";

export const generateInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.invoiceUrl) {
      return res.json({
        success: true,
        message: "Invoice already generated ✅",
        invoiceUrl: order.invoiceUrl,
      });
    }

    const invoiceUrl = await generateInvoice(order);
    const fullInvoiceUrl = `${req.protocol}://${req.get("host")}${invoiceUrl}`;

    order.invoiceUrl = fullInvoiceUrl;
    await order.save();

    res.json({
      success: true,
      message: "Invoice generated successfully ✅",
      invoiceUrl: fullInvoiceUrl,
    });
  } catch (error) {
    console.error("❌ Invoice Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
};
