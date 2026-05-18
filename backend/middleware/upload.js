
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const ext = path.extname(file.originalname)
      .replace(".", "")
      .toLowerCase();

    const name = path
      .basename(file.originalname, "." + ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");

    let resourceType = "raw";
    let folder = "files";

    // Images
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
      folder = "images";
    }

    // Videos
    else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "videos";
    }

    // PDFs
    else if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      folder = "pdfs";
    }

    // Docs / Zip / Others
    else {
      resourceType = "raw";
      folder = "files";
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${name}`,

      // IMPORTANT: keep extension for raw files
      format: resourceType === "raw" ? ext : undefined,
    };
  },
});

export const fileUpload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024, 
  },

  fileFilter: (req, file, cb) => {
    cb(null, true); // allow all file types
  },
});