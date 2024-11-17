import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import  {redis}  from "../config/redis.js";

dotenv.config();

const generateToken = (userID) => {
  const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userID, refreshToken) => {
  await redis.set(
    `refresh_token:${userID}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevents XSS attacks,cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attacks,cross site request forgery
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevents XSS attacks,cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attacks,cross site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const signupUser = async (req, res) => {
  console.log("Incoming request body", req.body);
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    //authenticate
    const { accessToken, refreshToken } = generateToken(user._id);
    console.log(accessToken, refreshToken);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    
    console.error("Error in creating user", error);
    return res.status(500).json({
      success: false,
      message: "Error in createing user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { accessToken, refreshToken } = generateToken(user._id);
      console.log(accessToken, refreshToken);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      return res.status(201).json({
        success: true,
        message: "user logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userID}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(201).json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logging out",
      error: error.message,
    });
  }
};

//this will refresh the access token after it is expired
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userID}`);
    if (storedToken != refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const accessToken = jwt.sign(
      { userID: decoded.userID },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevents XSS attacks,cross site scripting
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevents CSRF attacks,cross site request forgery
      maxAge: 15 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "token refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
};

const getProfile=(req,res)=>{
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export { signupUser, logoutUser, loginUser, refreshToken, getProfile };
