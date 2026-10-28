import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        //Read token from cookies
        const token = req.cookies.accessToken;

        //Check if token exists
        if(!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized, no token provided" });
        }

        //verify token
        const decoded = JWT.verify(token, process.env.TOKEN_SECRET);

        //Find user
        const user = await User.findById(decoded.id);

        if(!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        //Attach user to request object
        req.user = user;

        next();

    } catch (error) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Invalid or expired token"
            })
    }
}

export default authMiddleware;