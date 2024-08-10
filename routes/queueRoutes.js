// routes/queueRoutes.js
import express from "express";
import { enqueueRequest } from "../controllers/queueController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/enqueue", authenticateJWT, enqueueRequest);

export default router;
