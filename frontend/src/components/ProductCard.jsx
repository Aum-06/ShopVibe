import React from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import  useUserStore  from "../stores/useUserStore";

const ProductCard = ({ product }) => {
    const {user}=useUserStore();
    const handleAddToCart=()=>{
        if(!user){
            toast.error("Please login to add to cart");
            return;
        }else{
            toast.success("Product added to cart");
        }
    }
  return (
    <div className="flex flex-col overflow-hidden w-full rounded-xl border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-60 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-20 transition-opacity"></div>
      </div>

      {/* Product Details */}
      <div className="px-5 py-4">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h5>

        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          ${product.price?.toFixed(2) || "0.00"}
        </p>
      </div>

      {/* Add to Cart Button */}
      <button className="flex items-center justify-center gap-2 px-5 py-2 mx-5 mb-5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800" onClick={handleAddToCart}>
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
