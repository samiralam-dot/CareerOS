// controller/uploadController.js
import cloudinary from "../config/cloudinary.js";

export const uploadFiles = (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const uploadedFiles = files.map((file) => ({
      url: file.path,          // Cloudinary direct URL
      public_id: file.filename,
      originalName: file.originalname,
      type: file.mimetype,
      size: file.size,
    }));

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const deleteFile = async (req, res) => {
  try {
    const { publicId, resourceType } = req.body;

    console.log("BODY:", req.body);

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "publicId is required",
      });
    }

    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "raw",
      invalidate: true,
    });

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
};