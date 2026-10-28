import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Username is required"],
        minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false, // Don't return password in queries by default
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: "India"
        },
        pincode: {
            type: String,
            required: true
        }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
        /^\d{10}$/,
        'Please enter a valid 10-digit phone number'
        ]
    },
    userType: {
        type: String,
        enum: ['user', 'admin', 'driver'],
        default: 'user'
    },
    profile: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
    }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;

