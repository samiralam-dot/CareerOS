// routes/uploadRoutes.js

import express from "express";
import { fileUpload } from "../middleware/upload.js";
import { uploadFiles ,deleteFile} from "../controller/uploadController.js";

const router = express.Router();



router.post(
  "/upload",
  fileUpload.array("files", 10),
  uploadFiles
);

router.delete("/deletefile", deleteFile);

export default router;