import Footer from "../components/footer";
import SearchBar from "../components/searchBar";
import Card from "../components/card";
import cardImage from "../img/card-img.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function WorkShops() {
  const [workShops, setWorkShops] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      const workShopResponse = await axios.get(
        `http://localhost:5000/workshop/get?page=${currentPage}&limit=10`
      );
      console.log(workShopResponse.data);
      setWorkShops(workShopResponse.data.data);
      setCurrentPage(Number(workShopResponse.data.page));
      setTotalPages(workShopResponse.data.totalPages);
      setIsLoading(false);
    })();
  }, [currentPage]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {workShops &&
          workShops.map(workShop => (
            <Card
              btnColor="customGreen"
              btnText="تعرف أكثر"
              cardColor="#FFFFFF"
              title={workShop.title}
              description={workShop.description}
              imgSrc={`http://localhost:5000/uploads/${workShop.image}`}
              alt="صورة المقال"
              btnLink={`/workshopinfo/${workShop.id}`}
            />
          ))}
      </div>
      <div
        className="mt-6 mb-10 flex justify-center items-center space-x-4"
        style={{ direction: "ltr" }}
      >
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage == 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-700">
          الصفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage == totalPages}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <Footer />
    </>
  );
}
export default WorkShops;
