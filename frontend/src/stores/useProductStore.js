import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {},
  deleteProduct: async (productId) => {},
  toggleFeaturedProduct: async (productId) => {},
}));

export default useProductStore;