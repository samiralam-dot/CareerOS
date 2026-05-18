import express from "express";

import {
    createNotification,
    updateNotification
} from "../controller/notificationController.js";

const router = express.Router();

router.post("/create", createNotification);

router.put("/:id", updateNotification);

export default router;