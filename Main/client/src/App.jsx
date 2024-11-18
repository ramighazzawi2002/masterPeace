import React from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Articles from "./pages/articles";
import WorkShops from "./pages/workshops";
import Products from "./pages/products";
import ContactUs from "./pages/contactus";
import WorkShopInfo from "./pages/workshopinfo";
import ArticleInfo from "./pages/articleinfo";
import ProductInfo from "./pages/productInfo";
import ShoppingCartPage from "./pages/shoppingCart";
import ProfilePage from "./pages/profile";
import HomePage from "./pages/homePage";
import CheckoutPage from "./pages/checkOutPage";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WorkshopProvider } from "./components/context/workShopAmount";
import { UserProvider } from "./components/context/userData";
import { ProductProvider } from "./components/context/productData";
import Otp from "./pages/otpPage";
import ForgotPassword from "./pages/forgetPassword";
import ResetPasswordForm from "./pages/resetPassword";
import Header from "./components/header";
import AddContentPage from "./pages/addContent";
import { CartProvider } from "@/components/context/CartContext";
import HeritageChat from "./components/HeritageChat";
import ProtectedRoute from "./components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Router basename="masterPiece">
        <UserProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </UserProvider>
      </Router>
    </HelmetProvider>
  );
}

function AppContent() {
  return (
    <WorkshopProvider>
      <ProductProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workshops" element={<WorkShops />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/workshopinfo/:id" element={<WorkShopInfo />} />
          <Route path="/articleinfo/:id" element={<ArticleInfo />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          {/* Protected Routes */}
          <Route
            path="/shoppingcart"
            element={
              <ProtectedRoute>
                <ShoppingCartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-content"
            element={
              <ProtectedRoute>
                <AddContentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <HeritageChat />
      </ProductProvider>
    </WorkshopProvider>
  );
}

export default App;
