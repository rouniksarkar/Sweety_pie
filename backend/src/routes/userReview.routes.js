import express from "express"
import { getUserReviews } from "../controllers/review.controller.js";
const router = express.Router({ mergeParams: true }); // mergeParams so we can read :userId


// GET /api/users/:userId/reviews  -> all reviews previously written by this user
router.get('/', getUserReviews);

export default router;