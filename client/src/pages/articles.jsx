import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import SearchBar from "../components/searchBar";
import InfiniteScroll from "react-infinite-scroll-component";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/article/get?page=${page}&limit=6&search=${search}`
      );
      const newArticles = response.data.data;
      setArticles(prevArticles =>
        page === 1 ? newArticles : [...prevArticles, ...newArticles]
      );
      setCurrentPage(Number(response.data.page));
      setTotalPages(response.data.totalPages);
      setHasMore(page < response.data.totalPages);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles(1, searchTerm);
  }, [fetchArticles, searchTerm]);

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchArticles(1, term);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchArticles(currentPage + 1, searchTerm);
    }
  };

  return (
    <div className="bg-sand-100 min-h-screen">
      <SearchBar pageType="المقالات" onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-customBrown">
          مقالات عن التراث
        </h1>
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customBrown"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-2xl text-gray-600">
            لم يتم العثور على مقالات مطابقة لبحثك.
          </div>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-customBrown"></div>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <img
                    src={`http://localhost:5000/uploads/${article.image}`}
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-customBrown">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.breif}
                    </p>
                    <div className="flex justify-end">
                      <Link
                        to={`/articleinfo/${article.id}`}
                        className="bg-customGreen text-white px-4 py-2 rounded-full flex items-center hover:bg-customBrown transition duration-300"
                      >
                        <BookOpen className="mr-2" size={18} />
                        اقرأ المزيد
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Articles;
