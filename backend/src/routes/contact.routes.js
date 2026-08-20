import express from "express";
import { createContactQuery, getContactQueries } from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/admin.middlewares.js";

const router = express.Router();

router.post("/", createContactQuery);
router.get("/", verifyJWT, isAdmin, getContactQueries);

export default router;
