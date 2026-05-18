import express from "express";
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controller/interviewcontroller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",authMiddleware, createInterview);
router.get("/", authMiddleware,getAllInterviews);
router.get("/:id",authMiddleware, getInterviewById);
router.put("/update/:id", authMiddleware,updateInterview);
router.delete("/delete/:id",authMiddleware, deleteInterview);

export default router;