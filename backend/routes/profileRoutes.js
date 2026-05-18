import express from "express";
import { getProfile, createOrUpdateProfile, getProfileById } from "../controller/profilecontroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post("/create", authMiddleware, createOrUpdateProfile);


router.get("/:id",getProfileById)

export default router;