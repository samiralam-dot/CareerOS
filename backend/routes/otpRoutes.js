import express from "express";

import { sendOtpMail } from "../controller/mailcontroller.js";

const router = express.Router();

// send otp
router.post("/send-mail", sendOtpMail);
// router.post("/send-mail",)

export default router;