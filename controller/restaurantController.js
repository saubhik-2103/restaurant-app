import Restaurant from "../models/restaurantModel.js";

const createRestaurantController = async(req, res) => {
    try {
        const {
            name,
            description,
            address,
            location,
            image,
            phone,
            email,
            openingTime,
            closingTime,
            rating,
            numReviews,
            owner,
            deliveryAvailable
        } = req.body;

        // Validate required fields
        if(!name || !address || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, address and phone are required fields"
            })
        }

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({name: name.trim()})

        if(existingRestaurant) {
            return res.status(409).json({
                success: false,
                message: "Restaurant already exists"
            })
        }

        // Create new restaurant
        const restaurant = await Restaurant.create({
            name: name.trim(),
            description,
            address,
            location,
            image,
            phone,
            email,
            openingTime,
            closingTime,
            rating,
            numReviews,
            owner,
            deliveryAvailable
        })

        return res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            restaurant
        })
        
    } catch (error) {
        console.error("Error creating restaurant:", error);
        res.status(500).json({
            success: false,
            message: "Error while creating restaurant",
            error: error.message
        })
    }
}

//Get all restaurants
const getAllRestaurantsController = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully",
            totalCount: restaurants.length,
            restaurants
        })
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({
            success: false
        })
    }
}

// Get restaurant by id
const getRestaurantByIdController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId);
        if(!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Restaurant fetched successfully",
            restaurant
        })
    } catch (error) {
        console.error("Error fetching restaurant by id:", error);
        res.status(500).json({
            success: false
        })
    }
}

//Delete restaurant by id
const deleteRestaurantController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

        if(!deletedRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
            deletedRestaurant
        })
        
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        res.status(500).json({
            success: false,
            message: "Error while deleting restaurant",
            error: error.message
        })
    }
}
export {createRestaurantController,
        getAllRestaurantsController,
        getRestaurantByIdController,
        deleteRestaurantController
    }