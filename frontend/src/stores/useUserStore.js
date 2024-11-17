import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    
    // Client-side validations
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      set({ loading: false });
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      // Extract user data from response
      const userData = res.data.user;
      set({ user: userData, loading: false });
      return toast.success("User created successfully");
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message || "Something went wrong");
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      
      // Debug logs
      console.log("Login Response:", res.data);
      
      // Extract user data from response
      const userData = res.data.user;
      console.log("User Data:", userData);
      
      set({ user: userData, loading: false });
      
      // Debug log after setting state
      console.log("Store State After Login:", get());
      
      return toast.success("User logged in successfully");
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message || "Something went wrong");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      // Extract user data from response if needed
      const userData = res.data.user || res.data;
      set({ user: userData, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      // Don't show error toast here as this is a background check
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      return toast.success("User logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
}));

export default useUserStore;