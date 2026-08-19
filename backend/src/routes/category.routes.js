import express from "express"

import {Router }from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { isAdmin } from "../middlewares/admin.middlewares.js"
import { createCategoryController, singleCategoryController, readCategoryController, updateCategoryController, deleteCategoryController } from "../controllers/category.controller.js"

const router=express.Router()

//create
router.post("/create-category",verifyJWT,isAdmin,createCategoryController)

//update
router.put("/update-category/:id",verifyJWT,isAdmin,updateCategoryController)

//getall-read
router.get("/read-category",readCategoryController)

//get one
router.get("/single-category/:id",singleCategoryController)

//delete
router.delete("/delete-category/:id",verifyJWT,isAdmin,deleteCategoryController)
export default router