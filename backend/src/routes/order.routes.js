import express from "express"
import { Router } from "express"
import { cancelOrderController, createOrderController, createRazorpayOrderController, getAllOrdersController, getUserOrdersController, updateOrderStatusController, verifyPaymentController } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/admin.middlewares.js";

const router=express.Router();

router.post("/create-order",verifyJWT,createOrderController);

router.post("/create-razorpay-order", verifyJWT, createRazorpayOrderController);

router.post("/verify-payment",verifyJWT,verifyPaymentController);

router.get("/my-orders", verifyJWT, getUserOrdersController);

router.put("/cancel/:orderId", verifyJWT, cancelOrderController);

// admin 
router.get("/all", verifyJWT, isAdmin, getAllOrdersController);

router.put("/status/:orderId", verifyJWT, isAdmin, updateOrderStatusController);

export default router