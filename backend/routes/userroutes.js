import mongoose from "mongoose";
import express from "express";
import {signup,login,getAllUsers,getUserByEmail,updateUser,signout} from "../controller/usercontroller.js";   
import {authMiddleware} from "../middleware/authMiddleware.js";




const router = express.Router();
router.use("/signup", signup);
router.use("/login", login);
router.get("/:email", getUserByEmail);
router.get("/",getAllUsers)
router.put("/:id",updateUser);
router.post("/signout",authMiddleware, signout);
     
export default router;
