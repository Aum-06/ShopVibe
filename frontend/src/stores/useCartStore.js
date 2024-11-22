import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";


const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data.cart });
      console.log("Cart fetched successfully:", res.data.cart);
      get().calculateTotalAmount();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
    //   toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotalAmount();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  calculateTotalAmount: async () => {
    const { cart, coupon } = get();
    const subtotal = (cart || []).reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));

export default useCartStore;
