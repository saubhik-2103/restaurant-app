import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        description: {
            type: String,
            required: true
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
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                //required: true
            }
        },
        image: {
            type: String,
            default: "null"
        },
        phone: {
            type: String,
            required: true,
            match: [
                /^\d{10}$/,
                'Please enter a valid 10-digit phone number'
            ]
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
        openingTime: {
            type: String,
            required: true
        },
        closingTime: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        numReviews: {
            type: Number,
            default: 0
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        deliveryAvailable: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

restaurantSchema.index({ location: "2dsphere"});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;