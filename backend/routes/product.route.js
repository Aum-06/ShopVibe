import express from "express";
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory,toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middlewares/auth.middleware.js";

const productRouter=express.Router();

productRouter.get("/",protectedRoute,adminRoute,getAllProducts);
productRouter.get("/featured",getFeaturedProducts);
productRouter.get("/category/:category",getProductsByCategory);
productRouter.get("/recommended",getRecommendedProducts);
productRouter.post("/",protectedRoute,adminRoute,createProduct);
productRouter.patch("/:id",protectedRoute,adminRoute,toggleFeaturedProduct);
productRouter.delete("/:id",protectedRoute,adminRoute,deleteProduct);

export default productRouter;