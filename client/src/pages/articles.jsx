import Footer from "../components/footer";
import SearchBar from "../components/searchBar";
import Card from "../components/card";
import cardImage from "../img/card-img.jpg";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
function Articles() {
  const [articles, setArticles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      const articleResponse = await axios.get(
        `http://localhost:5000/article/get?page=${currentPage}&limit=10`
      );
      console.log(articleResponse.data);
      setArticles(articleResponse.data.data);
      setCurrentPage(Number(articleResponse.data.page));
      setTotalPages(articleResponse.data.totalPages);
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
        {articles &&
          articles.map(article => (
            <Card
              btnColor="customGreen"
              btnText="اقرا المزيد"
              cardColor="customYellow"
              title={article.title}
              description={article.breif}
              imgSrc={`http://localhost:5000/uploads/${article.image}`}
              alt={article.title}
              btnLink={`/articleinfo/${article.id}`}
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

export default Articles;
