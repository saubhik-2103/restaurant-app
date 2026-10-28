import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createRestaurantController,
  deleteRestaurantController,
  getAllRestaurantsController,
  getRestaurantByIdController,
} from "../controller/restaurantController.js";
import { get } from "mongoose";

const router = express.Router();

router.use(authMiddleware);
//routes
//CREATE RESTAURANT || POST
router.post("/create-restaurant", authMiddleware, createRestaurantController);

//Get all restaurants || GET
router.get("/get-all-restaurants", authMiddleware, getAllRestaurantsController);

//Get restaurant by id || GET
router.get("/get-restaurant/:id", authMiddleware, getRestaurantByIdController);

//Delete restaurant || DELETE
router.delete("/delete-restaurant/:id", authMiddleware, deleteRestaurantController);

export default router;
