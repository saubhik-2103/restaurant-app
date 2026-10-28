import User from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // Get the user's email from the request
    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (!adminUser || adminUser.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default adminMiddleware;