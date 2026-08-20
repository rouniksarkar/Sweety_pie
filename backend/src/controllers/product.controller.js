import slugify from "slugify";
import { Product } from "../models/products.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ----------------- CREATE PRODUCT -----------------
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      discountType,
      discountValue,
      category,
      owner,
    } = req.body;

    // Validation
    if (
      [name, description, price, stock, category].some(
        (field) => !field || field.toString().trim() === ""
      )
    ) {
      throw new apiError(400, "All required product fields must be filled");
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      throw new apiError(409, "Product already exists");
    }

    // Upload image to Cloudinary
    let productImageUrl = "";
    if (req.file?.buffer) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);
      if (!cloudinaryResult) {
        throw new apiError(500, "Image upload failed");
      }
      productImageUrl = cloudinaryResult.secure_url;
    }

    // Create product
    const newProduct = await Product.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      price,
      stock,
      category,
      owner,
      discountType: discountType || null,
      discountValue: discountValue || 0,
      productImage: productImageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        ...newProduct._doc,
        finalPrice: newProduct.getDiscountedPrice(),
      },
    });
  } catch (error) {
    console.log(error);
    throw error instanceof apiError
      ? error
      : new apiError(500, "Error in product creation");
  }
};

// ----------------- GET ALL PRODUCTS -----------------
export const getProductController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate("owner");

    const updatedProducts = products.map((p) => ({
      ...p._doc,
      finalPrice: p.getDiscountedPrice(),
    }));

    res.status(200).send({
      success: true,
      message: "All products",
      products: updatedProducts,
    });
  } catch (error) {
    throw new apiError(500, "Error getting products");
  }
};

// ----------------- GET SINGLE PRODUCT -----------------
export const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
      .populate("category")
      .populate("owner");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found for slug: ${slug}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Single product fetched successfully",
      product: {
        ...product._doc,
        finalPrice: product.getDiscountedPrice(),
      },
    });
  } catch (error) {
    console.error(error);
    throw new apiError(500, "Error fetching single product");
  }
};

// ----------------- DELETE PRODUCT -----------------
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    throw new apiError(500, "Error deleting product");
  }
};

// ----------------- UPDATE PRODUCT -----------------
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      owner,
      discountType,
      discountValue,
    } = req.body;
    const { id } = req.params;

    // Validation
    if (
      !name?.toString().trim() ||
      !description?.toString().trim() ||
      price === undefined ||
      isNaN(price) ||
      stock === undefined ||
      isNaN(stock) ||
      !category?.toString().trim()
    ) {
      throw new apiError(400, "All fields are required in products");
    }

    // Check if another product with same name exists
    const existingProduct = await Product.findOne({ name, _id: { $ne: id } });
    if (existingProduct) {
      throw new apiError(409, "Another product with this name already exists");
    }

    // Upload image if provided
    let productImageUrl;
    if (req.file?.buffer) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);
      if (!cloudinaryResult) {
        throw new apiError(500, "Image upload failed");
      }
      productImageUrl = cloudinaryResult.secure_url;
    }

    // Build update object
    const updateData = {
      name,
      slug: slugify(name, { lower: true }),
      description,
      price,
      stock,
      category,
      owner,
      discountType: discountType || null,
      discountValue: discountValue || 0,
    };

    if (productImageUrl) {
      updateData.productImage = productImageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        ...updatedProduct._doc,
        finalPrice: updatedProduct.getDiscountedPrice(),
      },
    });
  } catch (error) {
    console.log(error);
    throw new apiError(500, "Error updating product");
  }
};

// ----------------- SEARCH PRODUCTS -----------------
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-image");

    const updatedResult = result.map((p) => ({
      ...p._doc,
      finalPrice: p.getDiscountedPrice(),
    }));

    res.json(updatedResult);
  } catch (error) {
    throw new apiError(400, "Error in search");
  }
};

// ----------------- RELATED PRODUCTS -----------------
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-image")
      .limit(6);

    const updatedProducts = products.map((p) => ({
      ...p._doc,
      finalPrice: p.getDiscountedPrice(),
    }));

    res.status(200).json({
      success: true,
      products: updatedProducts,
    });
  } catch (error) {
    throw new apiError(401, "Error fetching related products");
  }
};
