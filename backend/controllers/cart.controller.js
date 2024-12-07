import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Check if the product is already in the cart
    let existingItem = user.cartItems.find((item) => item.product == productId);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity
      await user.save();
      return res.status(200).json({ message: "Item quantity updated", cartItems: user.cartItems });
    }

    // Add new product to the cart
    user.cartItems.push({ product: productId, quantity: 1 });
    await user.save();
    return res.status(200).json({ message: "Item added to cart", cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Remove specific item if productId is provided, otherwise clear the cart
    if (productId) {
      if (!user.cartItems.some((item) => item.product == productId)) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
      user.cartItems = user.cartItems.filter((item) => item.product != productId);
    } else {
      user.cartItems = []; // Clear the entire cart
    }

    await user.save();
    return res.status(200).json({ message: "Cart updated", cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in removeAllFromCart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // Find the product in the cart
    let existingItem = user.cartItems.find((item) => item.product == productId);
    if (existingItem) {
      if (quantity === 0) {
        // Remove item if quantity is set to 0
        user.cartItems = user.cartItems.filter((item) => item.product != productId);
        await user.save();
        return res.status(200).json({ message: "Item removed from cart", cartItems: user.cartItems });
      }

      // Update the quantity
      existingItem.quantity = quantity;
      await user.save();
      return res.status(200).json({ message: "Item quantity updated", cartItems: user.cartItems });
    }

    return res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getCartProducts = async (req, res) => {
  try {
    // Fetch all products in the user's cart
    const productIds = req.user.cartItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Map product details with their respective quantities
    const cartItems = products.map((product) => {
      const cartItem = req.user.cartItems.find((item) => item.product == product._id.toString());
      return { ...product.toObject(), quantity: cartItem.quantity };
    });

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { addToCart, removeAllFromCart, updateQuantity, getCartProducts };
