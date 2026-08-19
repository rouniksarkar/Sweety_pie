import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

// Add product to cart
router.post("/add-cart", verifyJWT, addToCart);

// Get user's cart
router.get("/get-cart", verifyJWT, getCart);

// Remove a product from cart
router.delete("/remove-cart/:productId", verifyJWT, removeFromCart);

// Update quantity of an item in cart
router.put("/update-cart/:productId", verifyJWT, updateQuantity);

router.delete("/clear-cart", verifyJWT, clearCart);

export default router;
