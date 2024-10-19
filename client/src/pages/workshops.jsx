import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import SearchBar from "../components/searchBar";
import InfiniteScroll from "react-infinite-scroll-component";

function WorkShops() {
  const [workShops, setWorkShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchWorkshops = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/workshop/get?page=${page}&limit=6&search=${search}`
      );
      const newWorkshops = response.data.data;
      setWorkShops(prevWorkshops =>
        page === 1 ? newWorkshops : [...prevWorkshops, ...newWorkshops]
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
    fetchWorkshops(1, searchTerm);
  }, [fetchWorkshops, searchTerm]);

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchWorkshops(1, term);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchWorkshops(currentPage + 1, searchTerm);
    }
  };

  return (
    <div className="bg-sand-100 min-h-screen">
      <SearchBar pageType="ورش العمل" onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-customBrown">
          ورش العمل التراثية
        </h1>
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-jordanian-red-600"></div>
          </div>
        ) : workShops.length === 0 ? (
          <div className="text-center text-2xl text-gray-600">
            لم يتم العثور على ورش عمل مطابقة لبحثك.
          </div>
        ) : (
          <InfiniteScroll
            dataLength={workShops.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-jordanian-red-600"></div>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workShops.map(workshop => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <img
                    src={`http://localhost:5000/uploads/${workshop.image}`}
                    alt={workshop.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-customBrown">
                      {workshop.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {workshop.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-customGreen">
                        {workshop.cost} دينار
                      </span>
                      <Link
                        to={`/workshopinfo/${workshop.id}`}
                        className="bg-customGreen text-white px-4 py-2 rounded-full flex items-center hover:bg-customBrown transition duration-300"
                      >
                        تفاصيل الورشة
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

export default WorkShops;
