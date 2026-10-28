import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

//Register Controller
const registerController = async (req, res) => {
    try {
        const {username, email, password, address, phone} = req.body;
        //validation
        if(!username || !email || !password || !address || !phone) {
            //Bad request
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        //check user
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        //hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //register user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            address,
            phone
        })
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while registering user",
            error
        });
    }
}

//Login Controller

const loginController = async (req, res) => {
    const {email, password} = req.body;
    // Validation for missing login fields
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Please provide email and password",
            data: null
        });
    }
    try {
        //Chech if user exists
        const user = await User.findOne({email}).select("+password")
        if(!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
                data: null
            })
        }
        //Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid password",
                data: null
            })
        }
        //Access token generation after successful login
        const accessToken = JWT.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: "1h"});

        //return userinfo except password
        const {password: dbPassword, ...userInfo} = user._doc;

        //if password is correct, return success response
        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "none",
                //secure: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
            .json({
            status: true,
            message: "User logged in successfully",
            data: userInfo,
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error occurred while logging in user",
            error
        })
    }
}

export {registerController, loginController}