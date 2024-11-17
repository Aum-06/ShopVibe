import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { createCheckoutSession,checkoutSuccess } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session",protectedRoute,createCheckoutSession);
paymentRouter.post("/checkout-success",protectedRoute,checkoutSuccess);


export default paymentRouter;