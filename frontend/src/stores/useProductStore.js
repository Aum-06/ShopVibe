// useProductStore.js
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

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    // Get the current product
    const currentProduct = useProductStore.getState().products.find(
      (product) => product._id === productId
    );
    
    // Optimistically update the UI
    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId
          ? { ...product, isFeatured: !product.isFeatured }
          : product
      ),
    }));
  
    try {
      const response = await axiosInstance.patch(`/products/${productId}`);
      
      if (response.data.success) {
        // Show success toast
        toast.success(response.data.message || "Product updated successfully");
      } else {
        // Revert the change if the server request failed
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId
              ? { ...product, isFeatured: currentProduct.isFeatured }
              : product
          ),
        }));
        toast.error("Failed to update featured status");
      }
    } catch (error) {
      // Revert the change on error
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: currentProduct.isFeatured }
            : product
        ),
      }));
      toast.error(error.response?.data?.message || "Failed to update featured status");
    }
  },

  deleteProduct: async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({error: "Failed to fetch products",loading: false});
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  }
}));

export default useProductStore;