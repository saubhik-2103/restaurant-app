import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected successfully ${mongoose.connection.host}`);
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;