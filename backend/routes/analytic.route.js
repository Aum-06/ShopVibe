import express from "express";
import { adminRoute, protectedRoute } from "../middlewares/auth.middleware.js";
import { getAllAnalytics } from "../controllers/analytic.controller.js";

const analyticRouter = express.Router();

analyticRouter.get("/",protectedRoute,adminRoute,getAllAnalytics);

export default analyticRouter;