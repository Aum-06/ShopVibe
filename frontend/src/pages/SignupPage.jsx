import { React, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  Lock,
  UserPlus,
  ArrowRight,
  LogIn,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {signup,loading}=useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    signup(formData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 pt-24 bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sm:mx-auto sm:w-full sm:max-w-md mb-6"
      >
        <h2 className="text-3xl mt-4 font-extrabold text-center text-gray-900 dark:text-white">
          Create Your Account
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full sm:w-1/2 lg:w-1/3"
      >
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="shadow-sm rounded-md mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 py-2 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-400 border-gray-300 rounded-md focus:blue-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 border-1 outline-none"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="shadow-sm rounded-md mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 py-2 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-400 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 border-1 outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="shadow-sm rounded-md mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 py-2 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-400 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 border-1 outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <div className="shadow-sm rounded-md mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="block w-full pl-10 py-2 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-400 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 border-1 outline-none"
                  placeholder="confirm password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150 ease-in-out disabled:opacity-50 "
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="animate-spin mr-2"
                    size={20}
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={20} aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>
          <div className="flex justify-center mt-4 ">
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
