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
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import useCartStore from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
const App = () => {
  const {user,checkAuth}=useUserStore();
  const{getCartItems}=useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  
  useEffect(()=>{
     getCartItems();
  },[getCartItems])

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="relative z-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={!user?<SignupPage />:<Navigate to="/" />} />
          <Route path="/login" element={!user?<LoginPage />:<Navigate to="/" />} />
          <Route path="/secret-dashboard" element={user?.role==="admin"?<AdminPage />:<Navigate to="/login" />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
