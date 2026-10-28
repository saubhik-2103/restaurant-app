import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import testRoute from "./routes/testRoute.js";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import restaurantRoute from "./routes/restaurantRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import foodRouter from "./routes/foodRoute.js";

//config dotenv
dotenv.config();

//db connection
connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", testRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/food", foodRouter);


app.get("/", (req, res) => {
    return res.status(200).send("<h1>Welcome to the restaurant app</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});