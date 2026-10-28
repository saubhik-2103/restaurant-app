import express from "express";
import { getUserController, updateUserController, updatePasswordController, deleteUserController, logoutController } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router object
const router = express.Router();

// Router
// Get user
router.get("/get-user", authMiddleware, getUserController);

//Update user profile
router.put("/update-user", authMiddleware, updateUserController);

//Update password
router.put("/update-password", authMiddleware, updatePasswordController)

// delete user
router.delete("/delete-user", authMiddleware, deleteUserController)

// logout user
router.post("/logout", authMiddleware, logoutController);

export default router;