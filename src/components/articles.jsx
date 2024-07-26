import Header from "./header";
import Footer from "./footer";
import SearchBar from "./searchBar";
import Card from "./card";
function Articles() {
  const articles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      <Header />
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {articles.map(article => (
          <Card
            btnColor="customGreen"
            btnText="اقرا المزيد"
            cardColor="customYellow"
            title="فن الفسيفساء في الأردن"
            description="استكشف فن صناعة الفسيفساء المعقد. صمم واصنع قطعتك الخاصة باستخدام تقنيات مستوحاة من الفسيفساء الأردنية القديمة."
            imgSrc="./src/img/card-img.jpg"
            alt="صورة المقال"
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default Articles;
