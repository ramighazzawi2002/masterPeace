import Footer from "../components/footer";
import Card from "../components/card";
import SearchBar from "../components/searchBar";
import cardImage from "../img/card-img.jpg";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import axios from "axios";
function Products() {
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      try {
        const productsResponse = await axios.get(
          `http://localhost:5000/product/all-products?page=${currentPage}&limit=5`
        );
        setProducts(productsResponse.data);
        setCurrentPage(Number(productsResponse.data.page));
        setTotalPages(productsResponse.data.totalPages);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [currentPage]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {products && console.log(products)}
        {products &&
          products.data.map(product => (
            <Card
              key={product.id}
              title={product.name}
              description={product.description}
              price={product.price}
              imgSrc={`http://localhost:5000/${product.image}`}
              alt={product.name}
              btnLink={`/productinfo/${product.id}`}
              btnText="اشتري الآن"
              cardColor="#FFFFFF"
              btnColor="red-500"
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

export default Products;
