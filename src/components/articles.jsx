import Header from "./header";
import Footer from "./footer";
import SearchBar from "./searchBar";
import Card from "./card";
import cardImage from "../img/card-img.jpg";
function Articles() {
  return (
    <>
      <Header />
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {[...Array(10)].map(article => (
          <Card
            btnColor="customGreen"
            btnText="اقرا المزيد"
            cardColor="customYellow"
            title="فن الفسيفساء في الأردن"
            description="استكشف فن صناعة الفسيفساء المعقد. صمم واصنع قطعتك الخاصة باستخدام تقنيات مستوحاة من الفسيفساء الأردنية القديمة."
            imgSrc={cardImage}
            alt="صورة المقال"
            btnLink="/articleinfo"
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default Articles;
