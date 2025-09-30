import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage.jsx";
import ProductDetailsPage from "./pages/user/ProductDetailsPage.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import WishlistPage from "./pages/user/WishlistPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import ConfirmationPage from "./pages/user/ConfirmationPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-[#07150f]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
