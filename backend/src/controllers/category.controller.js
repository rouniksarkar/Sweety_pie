import { Category } from "../models/category.model.js"
import { apiError } from "../utils/apiError.js"
import slugify from "slugify"

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            throw new apiError(401, "Name is required")
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            throw new apiError(200, "Category exists already")
        }
        const category = await Category.create({
            name,
            slug: slugify(name)
        });

        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        throw new apiError(500, "error in category")
    }
}
//update
export const updateCategoryController= async(req,res)=>{
    try {
        const {name}=req.body
        const {id}=req.params
        const category=await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

        res.status(201).send({
            success: true,
            message: "category updated",
            category
        })
    } catch (error) {
        throw new apiError(500,"Erron in upadting Category")
    }
}
//read
export const readCategoryController= async(req,res)=>{
    try {
        const category=await Category.find({});
        res.status(201).send({
            success: true,
            message: "All category get",
            category
        })
    } catch (error) {
        throw new apiError(500,"Error of getting")
    }
}

//delete
export const singleCategoryController=async(req,res)=>{
    try {
        const category=await Category.findOne({slug:req.params.slug})
        res.status(201).send({
            success: true,
            message: "single category ",
            category
        })
    } catch (error) {
        throw new apiError(500,"Error in single category")
    }
}
//delete
export const deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params
        const category=await Category.findByIdAndDelete(id)
        res.status(201).send({
            success: true,
            message: "delete single category ",
            category
        })
    } catch (error) {
        throw new apiError(500,"Error in single category")
    }
}