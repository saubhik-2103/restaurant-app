import express from "express";
import { testUserController } from "../controller/testUserController.js";

// Router object
const router = express.Router();

// Router
router.get("/test-user", testUserController)

export default router;