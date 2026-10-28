import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

//router.use(authMiddleware);

//routes
//Create CATEGORY || POST
router.post("/create-category", createCategoryController);

//Get all categoried || GET
router.get("/get-all-categories", getAllCategoriesController);

//Update category || PUT
router.put("/update-category/:id", updateCategoryController);

//Delete category || DELETE
router.delete("/delete-category/:id", deleteCategoryController);
export default router;
