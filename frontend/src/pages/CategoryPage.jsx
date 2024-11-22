import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const { fetchProductsByCategory, products } = useProductStore();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Title */}
        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-center sm:text-5xl md:text-6xl py-8 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products?.length === 0 ? (
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white col-span-full">
              No Products Found
            </h2>
          ) : (
            products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
