import Food from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
//Create food controller
const createFoodController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurant,
      image,
      isAvailable,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category || !restaurant) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category and restaurant are required fields",
      });
    }

    // Create new food item
    const food = await Food.create({
      name: name.trim(),
      description,
      price,
      category,
      restaurant,
      image,
      isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all foods controller
const getAllFoodsController = async (req, res) => {
  try {
    const foods = await Food.find({});

    if (!foods || foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No food items found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Foods fetched successfully",
      totalCount: foods.length,
      foods,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get food by ID controller
const getFoodByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item fetched successfully",
      food,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get food by restaurant ID controller
const getFoodByRestaurantIdController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foods = await Food.find({ restaurant: restaurantId });

    if (!foods || foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No food items found for this restaurant",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      totalCount: foods.length,
      foods,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update food controller
const updateFoodContoller = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      restaurant,
      image,
      isAvailable,
    } = req.body;

    // Find the food item by ID and update it
    const updateFood = await Food.findByIdAndUpdate(
      id,
      { name, description, price, category, restaurant, image, isAvailable },
      { new: true }, // Return the updated document
    );

    if (!updateFood) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      food: updateFood,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete food controller
const deleteFoodController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// PLACE ORDER CONTROLLER
const placeOrderController = async (req, res) => {
  try {
    const { foods, user, paymentMethod } = req.body;

    if (
      !user ||
      !paymentMethod ||
      !Array.isArray(foods) ||
      foods.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "user, paymentMethod and at least one food item are required",
      });
    }

    const normalizedFoods = foods.map((item) => ({
      food: item.food,
      quantity: Number(item.quantity),
    }));

    const foodIds = normalizedFoods.map((item) => item.food);

    const foodDocuments = await Food.find({ _id: { $in: foodIds } });

    const foodById = new Map(
      foodDocuments.map((food) => [food._id.toString(), food]),
    );

    for (const item of normalizedFoods) {
      if (
        !foodById.has(item.food) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid food item or quantity: ${item.food}`,
        });
      }
    }

    const totalPrice = normalizedFoods.reduce((total, item) => {
      const food = foodById.get(item.food);
      return total + food.price * item.quantity;
    }, 0);

    const order = await orderModel.create({
      user,
      foods: normalizedFoods,
      totalPrice,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      totalAmount: totalPrice,
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Change order status controller
const changeOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if(!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            })
        }

        const order = await orderModel.findById(orderId, { status: 1 });

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};
export {
  createFoodController,
  getAllFoodsController,
  getFoodByIdController,
  getFoodByRestaurantIdController,
  updateFoodContoller,
  deleteFoodController,
  changeOrderStatusController,
  placeOrderController,
};
