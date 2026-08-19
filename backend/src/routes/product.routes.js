import { Router } from "express";
import express from 'express'
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/admin.middlewares.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, relatedProductController, searchProductController, updateProductController} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router= express.Router()

router.post("/create-product",verifyJWT,isAdmin,upload.single("image"),createProductController)

//get products
router.get("/get-product",getProductController)

//single product
router.get("/single-product/:slug",getSingleProductController)


//delete
router.delete("/delete-product/:id",verifyJWT,isAdmin,deleteProductController)

//update
router.put("/update-product/:id",verifyJWT,isAdmin,upload.single("image"),updateProductController)

//search bar
router.get("/search/:keyword",searchProductController)

//related product
router.get("/related-product/:pid/:cid",relatedProductController)

export default router