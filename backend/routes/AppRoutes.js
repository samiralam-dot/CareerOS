import express from "express";
import { createApplication ,getApplicationById, updateApplication} from "../controller/AppController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware,createApplication);
router.get("/:id", getApplicationById);
router.put("/:id",authMiddleware,updateApplication);

export default router;