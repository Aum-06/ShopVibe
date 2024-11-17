import React from "react";
import Navbar from "../components/Navbar";
import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-black dark:text-white flex justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl py-8 text-center">
          <span className="block">Welcome to ShopVibe</span>
          <span className="block text-blue-600">Your Fashion Destination</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
