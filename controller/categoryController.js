import categoryModel from "../models/catagoryModel.js";

const createCategoryController = async (req, res) => {
  try {
    const { title, imageURL, isActive } = req.body;

    //validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    //Create category
    const category = await categoryModel.create({
      title,
      imageURL,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//Get all categories
const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      totalCategories: categories.length,
      categories
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

// Update category by ID
const updateCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { title, imageURL, isActive } = req.body;

        // Find the category by ID and update it
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            { title, imageURL, isActive },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            success: false,
            message: "Error while updating category",
            error: error.message
        });
    }
}

//Delete category by ID
const deleteCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

        if(!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category: deletedCategory
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Error while deleting category",
            error: error.message
        });
    }
}
export { createCategoryController,
        getAllCategoriesController,
        updateCategoryController,
        deleteCategoryController
    };
