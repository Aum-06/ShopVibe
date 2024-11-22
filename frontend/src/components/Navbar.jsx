import React from "react";
import {
  Sun,
  Moon,
  ShoppingCart,
  UserPlus,
  Lock,
  LogOut,
  LogIn,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useThemeStore from "../stores/useThemeStore"; // Import the theme store
import useUserStore from "../stores/useUserStore";
import { useEffect } from "react";
import useCartStore from "../stores/useCartStore";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore(); // Access dark mode state and toggle function
  const navigate = useNavigate();
  const { user, logout, checkingAuth, checkAuth } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  //  // More detailed debugging
  //  console.log({
  //   userObject: user,
  //   roleValue: user?.role,
  //   roleType: user?.role ? typeof user.role : 'no role',
  //   isAdminValue: isAdmin,
  //   checkingAuth
  // });
  useEffect(() => {
    checkAuth();
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white"
            >
              ShopVibe
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode} // Use the toggle function from the theme store
              className="p-2 rounded-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:opacity-80"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Home Link */}
            <Link
              to="/"
              className="transition-colors duration-300 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>

            {/* Cart Link */}
            {user && (
              <Link
                to={"/cart"}
                className="flex items-center justify-center px-3 py-2 rounded-md transition-colors duration-300 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group"
              >
                <ShoppingCart size={18} />
                {cart?.length > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-red-600 text-xs text-white flex items-center justify-center group-hover:bg-red-700 dark:group-hover:bg-red-800">
                    {cart.length}
                  </span>
                )}
                <span className="dark:text-white font-medium ml-2">Cart</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/secret-dashboard"}
                className="items-center justify-center px-3 py-2 rounded-md transition-colors duration-300 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group flex "
              >
                <Lock size={18} />
                <span className="ml-2 dark:text-white font-medium">
                  Dashboard
                </span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-inherit px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center"
              >
                <LogOut size={18} />
                Log Out
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex gap-2 items-center"
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>

                <Link
                  to={"/login"}
                  className="transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-inherit px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
