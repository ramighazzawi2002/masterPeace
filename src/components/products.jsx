import Header from "./header";
import Footer from "./footer";
import Card from "./card";
import SearchBar from "./searchBar";

function Products() {
  return (
    <>
      <Header />
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-0 justify-center max-w-[120rem] mb-28">
        {[...Array(10)].map(article => (
          <Card
            btnColor="customRed"
            btnText="اشتري الآن"
            cardColor="#FFFFFF"
            title="فسيفساء أردنية"
            description="السعر: 20 د.أ"
            imgSrc="./src/img/card-img.jpg"
            alt="صورة المقال"
            btnLink="/login"
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default Products;
