import Signup from "./components/signup";
import Login from "./components/login";
import Articles from "./components/articles";
import WorkShops from "./components/workshops";
import Products from "./components/products";
import ContactUs from "./components/contactus";
import WorkShopInfo from "./components/workshopinfo";
import ArticleInfo from "./components/articleinfo";
import ProductInfo from "./components/productInfo";
import ShoppingCartPage from "./components/shoppingCart";
import ProfilePage from "./components/profile";
import AdminDashboard from "./components/adminDashboard";
import HomePage from "./components/homePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Router basename="/masterPiece/">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workshops" element={<WorkShops />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/workshopinfo" element={<WorkShopInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articleinfo" element={<ArticleInfo />} />
          <Route path="/productinfo" element={<ProductInfo />} />
          <Route path="/shoppingcart" element={<ShoppingCartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
