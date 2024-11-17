import express from "express";
import { logoutUser, signupUser, loginUser, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout",logoutUser);
authRouter.post("/refresh-token",refreshToken)
authRouter.get("/profile",protectedRoute,getProfile)

export default authRouter;
