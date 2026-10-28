import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;