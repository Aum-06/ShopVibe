import { stripe } from "../config/stripe.js";
import Coupon from "../models/coupon.model.js";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

// Function to create a Stripe coupon
const createStripeCoupon = async (discountPercentage) => {
  try {
    const coupon = await stripe.coupons.create({
      duration: "once",
      percent_off: discountPercentage,
    });
    return coupon.id;
  } catch (error) {
    console.error("Error creating Stripe coupon:", error.message);
    throw new Error("Failed to create coupon");
  }
};

// Function to create a coupon in the database
const createCoupon = async (userId) => {
  const coupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await coupon.save();
  return coupon;
};

// Function to create the Stripe checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products" });
    }

    // Initialize total amount and prepare line items
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * (product.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [], // Handle missing images
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    // Handle coupon application
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: req.user?._id, // Add optional chaining
      });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid Coupon" });
      }

      totalAmount -= Math.round(totalAmount * (coupon.discountPercentage / 100));
    }

    // Ensure user exists
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create Stripe checkout session with properly stringified metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id?.toString() || product.id?.toString(), // Handle both _id and id
            price: product.price,
            quantity: product.quantity,
          }))
        ),
      },
    });

    // Generate a new user coupon if the total amount exceeds the threshold
    if (totalAmount > 20000) {
      await createCoupon(req.user._id);
    }

    res.status(200).json({
      url: session.url,
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// Function to handle the success of the checkout session
const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Retrieved session:", session);  // Debugging

    if (session.payment_status === "paid") {
      // Deactivate the coupon if used
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      // Save the order
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // Convert to dollars
        paymentIntent: session.payment_intent,
        stripeSessionId: sessionId,
      });
      await newOrder.save();

      res.status(200).json({ message: "Order placed successfully" });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error in checkoutSuccess:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { createCheckoutSession, checkoutSuccess };
