import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import SearchBar from "../components/searchBar";
import Pagination from "../components/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/product/all-products?page=${page}&limit=6&search=${search}`
      );
      setProducts(response.data.data);
      setCurrentPage(Number(response.data.page));
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts(1, searchTerm);
  }, [fetchProducts, searchTerm]);

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchProducts(1, term);
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
    fetchProducts(newPage, searchTerm);
  };

  return (
    <div className="bg-sand-100 min-h-screen overflow-hidden">
      <SearchBar pageType="المنتجات" onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-customBrown">
          تراثنا الحرفي
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customBrown"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-2xl text-gray-600">
            لم يتم العثور على منتجات مطابقة لبحثك.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-customBrown">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-customGreen">
                        {product.price} دينار
                      </span>
                      <Link
                        to={`/productinfo/${product.id}`}
                        className="bg-customGreen/90 text-white px-4 py-2 rounded-full flex items-center hover:bg-customGreen transition duration-300"
                      >
                        <ShoppingCart className="ml-2" size={18} />
                        اشتري الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
