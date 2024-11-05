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
import AdminDashboard from "./pages/adminDashboard";
import HomePage from "./pages/homePage";
import CheckoutPage from "./pages/checkOutPage";
import Footer from "./components/footer";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

function App() {
  return (
    <Router basename="masterPiece">
      <UserProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const admin = location.pathname.includes("admin");
  return (
    <WorkshopProvider>
      <ProductProvider>
        {!admin && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workshops" element={<WorkShops />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/workshopinfo/:id" element={<WorkShopInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articleinfo/:id" element={<ArticleInfo />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/shoppingcart" element={<ShoppingCartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/add-content" element={<AddContentPage />} />
        </Routes>
        {!admin && <Footer />}
        {!admin && <HeritageChat />}
      </ProductProvider>
    </WorkshopProvider>
  );
}

export default App;
