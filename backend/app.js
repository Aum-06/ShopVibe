import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js";
import paymentRouter from "./routes/payment.route.js";
import analyticRouter from "./routes/analytic.route.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.config.PORT || 3000;
connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponRouter);
app.use("/api/payments",paymentRouter);
app.use("/api/analytics",analyticRouter);

app.listen(port, () => console.log(`app listening on port ${port}!`));