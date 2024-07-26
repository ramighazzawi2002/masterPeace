import Signup from "./components/signup";
import Login from "./components/login";
import Card from "./components/card";
import Footer from "./components/footer";
import Header from "./components/header";
import SearchBar from "./components/searchBar";
import Articles from "./components/articles";
import WorkShops from "./components/workshops";
import Products from "./components/products";
import ContactUs from "./components/contactus";
import WorkShopInfo from "./components/workshopinfo";
import ArticleInfo from "./components/articleinfo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/workshops" element={<WorkShops />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/workshopinfo" element={<WorkShopInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articleinfo" element={<ArticleInfo />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
