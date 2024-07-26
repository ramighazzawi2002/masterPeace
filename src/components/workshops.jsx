import Header from "./header";
import Footer from "./footer";
import SearchBar from "./searchBar";
import Card from "./card";

function WorkShops() {
  return (
    <>
      <Header />
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {[...Array(10)].map(article => (
          <Card
            btnColor="customGreen"
            btnText="تعرف أكثر"
            cardColor="#FFFFFF"
            title="المأكولات الأردنية التقليدية"
            description="انضم إلينا لتجربة عملية في إعداد الأطباق الأردنية الأصيلة. من المنسف إلى المقلوبة، انغمس في نكهات الأردن."
            imgSrc="./src/img/card-img.jpg"
            alt="صورة المقال"
            btnLink="/workshopinfo"
          />
        ))}
      </div>
      <Footer />
    </>
  );
}
export default WorkShops;
