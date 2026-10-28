import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

const getUserController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting user data",
            error
        })
    }
};

// Update user
const updateUserController = async (req, res) => {
    try {
        //Get user id from request object
        const userId = req.user._id;

        //Fields to update
        const {username, email, address, phone} = req.body;

        //Find user by id
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        //Update only provided fields
        if(username) user.username = username;
        if(email) user.email = email;
        if(address) user.address = address;
        if(phone) user.phone = phone;

        //Save updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user
        })
    } catch (error) {
       console.error(error);
       res.status(500).json({
        success: false,
        message: "Internal server error"
       }) 
    }
}

// Update password
const updatePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both old and new password"
            });
        }

        // Find user with password field included
        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        //send email notification about password change
        try {
            await sendEmail(
                user.email,
                "Password Changed Successfully",
                `
                    <h2>Password Updated</h2>

                    <p>Hello ${user.username},</p>

                    <p>Your account password was changed successfully.</p>

                    <p>If you did NOT make this change, please reset your password immediately.</p>

                    <br>

                    <p>Thank you.</p>
                `
            )
        } catch (error) {
            console.error("Error sending email notification:", error);
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while updating password"
        });
    }
};

//Delete user
const deleteUserController = async (req, res) => {
    try {
        const userId = req.user._id;

        //Permanently delete user from database
        await User.findByIdAndDelete(userId);

        //Clear the access token cookie
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            //secure: true
        })

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
        
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error while deleting user",
                error
            })
    }
};

//Logout controller

const logoutController = async (req, res) => {
    try {
        //Just clear the httpOnly cookie from browser
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            //secure: true
        })

        return res
            .status(200)
            .json({
                success: true,
                message: "Logged out successfully"
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Logout failed",
                error
            })
    }
}

export { getUserController, updateUserController, updatePasswordController, deleteUserController, logoutController };