// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      originalPrice: Number,    // ✅ Store original price
      discountedPrice: Number,  // ✅ Store discounted price (what customer paid)
      discountAmount: Number,   // ✅ How much discount was applied per item
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: Number,
  totalOriginalAmount: Number,  // ✅ Total before discount
  totalDiscount: Number,        // ✅ Total discount across all items
  paymentId: String,
   paymentInfo: {
      id: { type: String },
      status: { type: String, enum: ["success", "failed"], default: null },
    },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "cancelled","processing", "shipped", "delivered"],
    default: "pending",
  },
  razorpayOrderId: String,
  invoiceUrl: String,
  cancelled: { type: Boolean, default: false },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);