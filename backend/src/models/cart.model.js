import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
  },
  quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
      customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          unique: true // One cart per user
      },
      items: {
          type:[cartItemSchema]
      },
      totalPrice: {
          type: Number,
          default: 0 // Calculated when adding/removing items
      }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
