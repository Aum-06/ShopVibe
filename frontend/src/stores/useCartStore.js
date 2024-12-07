import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";


const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponAplied: false,  

  
	getMyCoupon: async () => {
		try {
			const response = await axiosInstance.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axiosInstance.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

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
  clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
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
  removeFromCart: async (productId) => {
    try {
      // Send DELETE request to the server
      const response = await axiosInstance.delete('/cart', { data: { productId } });
      console.log('Delete response:', response);
  
      // Update the local state by removing the item
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
  
      // Recalculate totals after removal
      get().calculateTotalAmount();
  
      // Show success message
      toast.success("Product removed from cart");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
  
  updateQuantity: async (productId, quantity) => {
    try {
      // If quantity is 0 or less, remove the item from the cart
      if (quantity <= 0) {
        get().removeFromCart(productId);
        return;
      }
  
      // Send a request to update the quantity in the backend
      const response = await axiosInstance.put(`/cart/${productId}`, { quantity });
      console.log("Update Quantity Response:", response.data);
  
      // Update the local cart state
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
  
      // Recalculate totals
      get().calculateTotalAmount();
  
      // Notify the user
      toast.success("Product quantity updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
  
}));

export default useCartStore;
