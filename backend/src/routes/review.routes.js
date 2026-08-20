import express from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { createReview, deleteReview, getProductReviews, getReview, updateReview } from "../controllers/review.controller.js"

const router = express.Router({ mergeParams: true })

router.post("/", verifyJWT, createReview)

router.get("/",getProductReviews)



router.get('/:id', getReview);

router.put('/:id',verifyJWT, updateReview);

router.delete('/:id',verifyJWT, deleteReview);

export default router;