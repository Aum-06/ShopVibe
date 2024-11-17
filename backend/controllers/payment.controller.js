import { stripe } from "../config/stripe.js";
import Coupon from "../models/coupon.model.js";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

const createStripeCoupon = async (discountPercentage) => {
  return await stripe.coupons.create({
    duration: "once",
    percent_off: discountPercentage,
  });
};

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

const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length == 0) {
      return res.status(400).json({ message: "Invalid products" });
    }
    let totalAmount = 0;

    let lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          current: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: req.user._id,
      });
      if (!coupon) {
        return res.status(400).json({ message: "Invalid Coupon" });
      } else {
        totalAmoutn -= Math.round(
          totalAmoutn * (coupon.discountPercentage / 100)
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user._id,
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            price: product.price,
            quantity: product.quantity,
          }))
        ),
      },
    });
    if (totalAmount > 20000) {
      await createCoupon(req.user._id);
    }
    res
      .status(200)
      .json({
        url: session.url,
        id: session.id,
        totalAmount: totalAmount / 100,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }
      const products = JSON.parse(session.metadata.products);
      const newOrder=new Order({
        user:session.metadata.userId,
        products:products.map(product=>({
          product:product.id,
          quantity:product.quantity,
          price:product.price
        })),
        totalAmount:session.amount_total/100,
        paymentIntent:session.payment_intent,
        stripeSessionId:sessionId
      })
      await newOrder.save();
      res.status(200).json({ message: "Order placed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { createCheckoutSession,checkoutSuccess };
