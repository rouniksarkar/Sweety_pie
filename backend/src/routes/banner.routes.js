import express from 'express'
import {upload} from "../middlewares/multer.middlewares.js"
import { createBanner, deleteBanner, getBanner, updateBanner } from '../controllers/banner.controller.js'
import { isAdmin } from '../middlewares/admin.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'

const router=express.Router()

router.post("/createBanner",verifyJWT,isAdmin,upload.single("image"),createBanner)
router.get("/getBanner",getBanner)
router.put("/updateBanner/:id",verifyJWT,isAdmin,upload.single("image"),updateBanner)
router.delete("/deleteBanner/:id",verifyJWT,isAdmin,deleteBanner)

export default router;