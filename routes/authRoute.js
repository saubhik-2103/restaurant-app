import express from "express";
import { registerController, loginController } from "../controller/authController.js";

// Router object
const router = express.Router();

// Router
router.post("/register", registerController);
router.post("/login", loginController);

export default router;