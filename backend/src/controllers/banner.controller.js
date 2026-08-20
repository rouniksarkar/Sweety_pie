import { Banner } from "../models/banner.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Banner
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    if ([title, link].some((field) => !field || field.toString().trim() === "")) {
      throw new apiError(400, "Title and link are required!");
    }

    let BannerImageUrl = "";
    if (req.file?.buffer) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);

      if (!cloudinaryResult) {
        throw new apiError(500, "Image upload failed");
      }
      BannerImageUrl = cloudinaryResult.secure_url;
    }

    const banner = await Banner.create({
      title,
      subtitle,
      link,
      image: BannerImageUrl,
    });

    res.status(201).json({
      message: "✅ Banner created successfully!",
      banner,
    });
  } catch (error) {
    console.log("❌ Error in createBanner:", error);
    res.status(500).json(new apiError(500, "Error at banner creation"));
  }
};

// Get Banners
export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "✅ Banners fetched successfully!",
      banner,
    });
  } catch (error) {
    console.log("❌ Error in getBanner:", error);
    res.status(500).json(new apiError(500, "Error at showing banners"));
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link } = req.body;

    const updateData = { title, subtitle, link };

    if (req.file?.buffer) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);

      if (!cloudinaryResult) {
        throw new apiError(500, "Image upload failed");
      }
      updateData.image = cloudinaryResult.secure_url;
    }

    const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });

    if (!banner) {
      throw new apiError(404, "Banner not found!");
    }

    res.status(200).json({
      message: "✅ Banner updated successfully!",
      banner,
    });
  } catch (error) {
    console.log("❌ Error in updateBanner:", error);
    res.status(500).json(new apiError(500, "Error at banner updation"));
  }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const delBanner = await Banner.findByIdAndDelete(id);

    if (!delBanner) {
      throw new apiError(404, "Banner not found!");
    }

    res.status(200).json({
      message: "✅ Banner deleted successfully!",
      delBanner,
    });
  } catch (error) {
    console.log("❌ Error in deleteBanner:", error);
    res.status(500).json(new apiError(500, "Error at banner deletion"));
  }
};
