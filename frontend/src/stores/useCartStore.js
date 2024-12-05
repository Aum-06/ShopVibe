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
  if (quantity === 0) {
    get().removeFromCart(productId);
    return;
  }

  await axios.put(`/cart/${productId}`, { quantity });
  set((prevState) => ({
    cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
  }));
  get().calculateTotals();
  toast.success("Product quantity updated");
} catch (error) {
  toast.error(error.response.data.message || "Something went wrong");
}
	},
}));

export default useCartStore;
