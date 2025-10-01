import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage.jsx";
import ProductDetailsPage from "./pages/user/ProductDetailsPage.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import WishlistPage from "./pages/user/WishlistPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import ConfirmationPage from "./pages/user/ConfirmationPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgetPass from "./pages/auth/ForgetPass.jsx";
import AdminDashboardLayout from "./components/admin/common/AdminDashboardLayout.jsx";
import Dashboard from "./components/admin/dashboard.jsx";
import Orders from "./components/admin/orders/Orders.jsx";
import Products from "./components/admin/products/Products.jsx";
import Customers from "./components/admin/customers/Customers.jsx";
import Reports from "./components/admin/reports/Reports.jsx";
import Users from "./components/admin/users/Users.jsx";

function App() {
  const isLoggedIn = !!localStorage.getItem("User1");
  
  return (
    <div className="min-h-screen bg-[#07150f]">
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/products/:productId" element={<ProductDetailsPage isLoggedIn={isLoggedIn} />} />
        <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />
        <Route path="/wishlist" element={<WishlistPage isLoggedIn={isLoggedIn} />} />
        <Route path="/checkout" element={<CheckoutPage isLoggedIn={isLoggedIn} />} />
        <Route path="/confirmation" element={<ConfirmationPage isLoggedIn={isLoggedIn} />} />

        
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Register/>} />
        <Route path="/forget-password" element={<ForgetPass/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
