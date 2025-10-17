import "./App.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage.jsx";
import ProductDetailsPage from "./pages/user/ProductDetailsPage.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import WishlistPage from "./pages/user/WishlistPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
import ConfirmationPage from "./pages/user/ConfirmationPage.jsx";
import MyAccountPage from "./pages/user/MyAccountPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgetPass from "./pages/auth/ForgetPass.jsx";
import LoginSuccess from "./pages/auth/LoginSuccess.jsx";
import AdminDashboardLayout from "./components/admin/common/AdminDashboardLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Products from "./pages/admin/Products.jsx";
import Customers from "./pages/admin/Customers.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Reviews from "./pages/admin/Reviews.jsx";
import Coupons from "./pages/admin/Coupons.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import {
  AUTH_SESSION_EVENT,
  AUTH_STORAGE_KEYS,
  getStoredAuthSession,
} from "./utils/authStorage";
import Footer from "./components/user/common/Footer.jsx";
import GettingStarted from "./pages/user/GettingStarted.jsx";
import TrackOrder from "./components/user/common/helpAndSupport/TrackOrders.jsx";
import RefundPolicy from "./components/user/common/helpAndSupport/RefundPolicy.jsx";
import Faqs from "./components/user/common/helpAndSupport/Faqs.jsx";
import OurStory from "./components/user/common/Company/OurStory.jsx";
import Careers from "./components/user/common/Company/Careers.jsx";
import Contact from "./components/user/common/Company/Contact.jsx";
import Press from "./components/user/common/Company/Press.jsx";

function App() {
  const [authSession, setAuthSession] = useState(() => getStoredAuthSession());

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleSessionEvent = (event) => {
      const detail = event?.detail ?? {};
      setAuthSession({
        token: detail.token ?? null,
        user: detail.user ?? null,
      });
    };

    const handleStorage = (event) => {
      if (!event) {
        return;
      }

      const relevantKeys = [
        AUTH_STORAGE_KEYS.token,
        AUTH_STORAGE_KEYS.user,
        null,
      ];

      if (!relevantKeys.includes(event.key)) {
        return;
      }

      setAuthSession(getStoredAuthSession());
    };

    window.addEventListener(AUTH_SESSION_EVENT, handleSessionEvent);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, handleSessionEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isLoggedIn = !!authSession.token;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<GettingStarted />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/return-and-refund-policy" element={<RefundPolicy />} />
          <Route path="/FAQs" element={<Faqs />} />
          <Route path="/Our-Story" element={<OurStory />} />
          <Route path="/career-page" element={<Careers />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="press" element={<Press />} />
          <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route
            path="/products/:productId"
            element={<ProductDetailsPage isLoggedIn={isLoggedIn} />}
          />
          <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />
          <Route
            path="/wishlist"
            element={<WishlistPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/checkout"
            element={<CheckoutPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/confirmation"
            element={<ConfirmationPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute
                session={authSession}
                allowedRoles={["customer"]}
                forbiddenPath="/admin/dashboard"
              >
                <MyAccountPage isLoggedIn={isLoggedIn} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                session={authSession}
                allowedRoles={["admin"]}
                forbiddenPath="/account"
              >
                <AdminDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPass />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
