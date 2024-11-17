import React from "react";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import { Route, Routes,Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useUserStore from "./stores/useUserStore";
import { useEffect } from "react";
import AdminPage from "./pages/AdminPage";

const App = () => {
  const {user,checkAuth}=useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="relative z-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={!user?<SignupPage />:<Navigate to="/" />} />
          <Route path="/login" element={!user?<LoginPage />:<Navigate to="/" />} />
          <Route path="/secret-dashboard" element={user?.role==="admin"?<AdminPage />:<Navigate to="/login" />} />

        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
