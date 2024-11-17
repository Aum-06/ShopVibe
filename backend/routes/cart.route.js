import express from "express";
import { getCartProducts, addToCart, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.get("/",protectedRoute,getCartProducts);
cartRouter.post("/",protectedRoute,addToCart);
cartRouter.delete("/",protectedRoute,removeAllFromCart);
cartRouter.put("/:id",protectedRoute,updateQuantity);

export default cartRouter;