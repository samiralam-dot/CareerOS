import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJob
} from "../controller/jobcontroller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
 
const router = express.Router();


router.post("/create",authMiddleware,createJob);


router.get("/", getAllJobs);
router.put("/:id",authMiddleware,updateJob);


router.get("/:id", getJobById);



router.delete("/:id", authMiddleware,deleteJob);

export default router;