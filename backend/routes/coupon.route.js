import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";    

const couponRouter = express.Router();

couponRouter.get("/",protectedRoute, getCoupon);
couponRouter.post("/validate",protectedRoute, validateCoupon); 

export default couponRouter;