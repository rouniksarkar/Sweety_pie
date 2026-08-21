import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { Product } from "../models/products.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
// controllers/order.controller.js - createOrderController
// controllers/order.controller.js
export const createOrderController = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No items in order" 
      });
    }

    let totalOriginalAmount = 0;
    let totalDiscount = 0;

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          
          if (!product) {
            console.error("❌ Product not found:", item.productId);
            throw new Error(`Product ${item.productId} not found`);
          }

          const originalPrice = product.price;
          const discountedPrice = product.getDiscountedPrice ? product.getDiscountedPrice() : product.price;
          const discountAmount = originalPrice - discountedPrice;

          totalOriginalAmount += originalPrice * item.quantity;
          totalDiscount += discountAmount * item.quantity;

          return {
            productId: product._id,
            name: product.name,
            originalPrice,
            discountedPrice,
            discountAmount,
            quantity: item.quantity,
            image: product.productImage // ✅ Include product image
          };
        } catch (error) {
          console.error("❌ Error processing product:", item.productId, error);
          throw error;
        }
      })
    );

    const order = await Order.create({
      user: req.user._id,
      items: populatedItems,
      totalAmount,
      totalOriginalAmount,
      totalDiscount,
      paymentStatus: "pending",
      invoiceUrl: null,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    console.error("❌ Create Order Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error in creating order",
      error: error.message 
    });
  }
};

// controllers/payment.controller.js
export const createRazorpayOrderController = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount, // amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,  // will include order.id
    });
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};


// Verify Razorpay Payment & Save Order
// controllers/order.controller.js - verifyPaymentController
// controllers/order.controller.js
export const verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

    // Check secret
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Server misconfiguration: Razorpay secret missing" });
    }

    // Step 1: Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature ❌" });
    }

    // Step 2: Find existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Step 3: Update order
    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    order.paymentStatus = "paid";
    order.paymentInfo = {
      id: razorpay_payment_id,
      status: "success",
    };

    await order.save();

    res.json({
      success: true,
      message: "Payment verified & order updated successfully ✅",
      order,
    });
  } catch (error) {
    console.error("❌ Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};




// View user orders
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price productImage"); // ✅ Populate product details
    
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// Cancel an order
// Cancel an order
export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ❌ Prevent cancelling delivered orders
    if (order.paymentStatus === "delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    // ❌ Prevent cancelling already cancelled orders
    if (order.cancelled || order.paymentStatus === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled" });
    }

    // ✅ Mark as cancelled
    order.cancelled = true;
    order.paymentStatus = "cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error cancelling order" });
  }
};


// ADMIN ORDER CONTROLLERS
// Get all orders (admin only)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email") // show user details
      .populate("items.productId", "name price productImage");

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    return res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Update order status (admin only)
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "paid", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = status;
    if (status === "cancelled") {
      order.cancelled = true;
    }
    await order.save();

    return res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    return res.status(500).json({ success: false, message: "Error updating status" });
  }
};
