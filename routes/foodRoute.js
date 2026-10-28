import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  createFoodController,
  getAllFoodsController,
  getFoodByIdController,
  getFoodByRestaurantIdController,
  updateFoodContoller,
  deleteFoodController,
  placeOrderController,
  changeOrderStatusController
} from "../controller/foodController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

//routes
//CREATE FOOD || POST
router.post("/create-food", createFoodController);
// GET ALL FOODS || GET
router.get("/get-foods", getAllFoodsController);
// GET FOOD BY ID || GET
router.get("/get-food/:id", getFoodByIdController);
// GET FOOD BY RESTAURANT ID || GET
router.get("/get-foods-by-restaurant/:restaurantId",
    getFoodByRestaurantIdController
);
// UPDATE FOOD || PUT
router.put("/update-food/:id", updateFoodContoller);
// DELETE FOOD || DELETE
router.delete("/delete-food/:id", deleteFoodController);

// PLACE ORDER || POST
router.post("/place-order", placeOrderController);
// CHANGE ORDER STATUS || PUT
router.put("/change-order-status/:orderId",
    authMiddleware,
    
    changeOrderStatusController
)
export default router;
