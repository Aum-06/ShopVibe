import { motion } from "framer-motion";
import useCartStore from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51QLKJYFkceYw4zsVJTOJCRdp6HDQRh6smUrhjzwImjh77EvLiGMldUoFVvVt5XW2e62tQ1NXfOY1kxVr1cWUmi9o00k2j4WSSi"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, cart, isCouponApplied } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
  
      // Format the cart items properly for the backend
      const formattedProducts = cart.map(item => ({
        _id: item.id || item._id, // handle both cases
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image // if you have images
      }));
  
      // Make the POST request to your server
      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          products: formattedProducts,
          couponCode: coupon ? coupon.code : null, // changed from coupon to couponCode to match backend
        }
      );
  
      // The response structure should match what your backend sends
      const { url } = response.data;
  
      // Redirect to Stripe Checkout URL directly
      window.location.href = url;
  
    } catch (error) {
      console.error("Error during payment:", error);
      // Consider using a toast notification instead of alert
    //   alert("Payment failed. Please check the console for details.");
    }
  };
  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Summary
        </h3>
      </div>

      {/* Order Details */}
      <div className="px-5 py-4 space-y-4">
        {/* Original Price */}
        <dl className="flex items-center justify-between">
          <dt className="text-sm text-gray-600 dark:text-gray-400">
            Original Price
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-white">
            ${formattedSubtotal}
          </dd>
        </dl>

        {/* Savings */}
        {savings > 0 && (
          <dl className="flex items-center justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">
              Savings
            </dt>
            <dd className="text-sm font-medium text-blue-600 dark:text-blue-500">
              -${formattedSavings}
            </dd>
          </dl>
        )}

        {/* Total */}
        <dl className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
          <dt className="text-base font-bold text-gray-900 dark:text-white">
            Total
          </dt>
          <dd className="text-base font-bold text-gray-900 dark:text-white">
            ${formattedTotal}
          </dd>
        </dl>
      </div>

      {/* Buttons */}
      <div className="px-5 pb-5 space-y-4">
        {/* Checkout Button */}
        <motion.button
          className="flex w-full items-center justify-center gap-2 px-5 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        {/* Continue Shopping */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
