import express from "express";
import { generateInvoiceController } from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ✅ Generate or fetch invoice
router.get("/:orderId", verifyJWT, generateInvoiceController);

export default router;
