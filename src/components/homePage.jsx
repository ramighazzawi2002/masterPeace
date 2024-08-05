import Header from "./header";
import petra from "../img/petra.jpg";
import ImprovedSwiper from "./slider";
import Card from "./card";
import cardImage from "../img/card-img.jpg";
import Footer from "./footer";
function HomePage() {
  return (
    <>
      <Header />
      <ImprovedSwiper images={[petra, petra, petra, petra]} />
      <section className="mb-20">
        <div className="bg-customYellow p-20">
          <h1 className="text-4xl font-bold text-center">التراث الاردني</h1>
          <p className="text-xl mt-10 text-customBrown">
            التراث الأردني هو مزيج غني من التقاليد والثقافة والصمود عبر القرون.
            من أسواق عمّان النابضة بالحياة إلى المناظر الطبيعية الساحرة في
            البتراء، يعكس التراث الأردني ارتباطاً عميقاً بتاريخه وشعبه. استكشاف
            فن التطريز الأردني، الذي يزين الملابس التقليدية بأنماط رمزية ارتقلت
            بها الأجيال. تذوق الأطباق اللذيذة من المطبخ الأردني، حيث تجتمع
            العائلات حول وجبات مشتركة غنية بالتاريخ. اكتشاف فن صناعة الفسيفساء،
            الذي يبرز مهارات الأردنيين في رسم أنماط معقدة تزين المباني القديمة
            والفنون الحديثة على حد سواء. انضم إلينا في الاحتفال بالتراث الأردني،
            حيث كل غرزة، كل نكهة، وكل قصة تروي قصة الأرض التي شكلتها الزمن
            وحُبّستها في قلوب شعبها.
          </p>
        </div>
        <div>
          <h2 className="text-5xl font-bold text-center mt-24 mb-11 text-[#D7CCC8]">
            ورشات مميزة
          </h2>
          <div className="grid grid-cols-[1fr] md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] gap-y-12  justify-items-center max-w-[85rem] mx-auto">
            <Card
              btnColor="customGreen"
              btnText="تعرف أكثر"
              cardColor="#FFFFFF"
              title="المأكولات الأردنية التقليدية"
              description="انضم إلينا لتجربة عملية في إعداد الأطباق الأردنية الأصيلة. من المنسف إلى المقلوبة، انغمس في نكهات الأردن."
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/workshopinfo"
            />
            <Card
              btnColor="customGreen"
              btnText="تعرف أكثر"
              cardColor="#FFFFFF"
              title="المأكولات الأردنية التقليدية"
              description="انضم إلينا لتجربة عملية في إعداد الأطباق الأردنية الأصيلة. من المنسف إلى المقلوبة، انغمس في نكهات الأردن."
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/workshopinfo"
            />
            <Card
              btnColor="customGreen"
              btnText="تعرف أكثر"
              cardColor="#FFFFFF"
              title="المأكولات الأردنية التقليدية"
              description="انضم إلينا لتجربة عملية في إعداد الأطباق الأردنية الأصيلة. من المنسف إلى المقلوبة، انغمس في نكهات الأردن."
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/workshopinfo"
            />
          </div>
        </div>
        <div>
          <h2 className="text-5xl font-bold text-center mt-24 mb-11 text-[#D7CCC8]">
            أشهر المنتجات
          </h2>
          <div className="grid grid-cols-[1fr] md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] gap-y-12  justify-items-center max-w-[85rem] mx-auto">
            <Card
              btnColor="customRed"
              btnText="اشتري الآن"
              cardColor="#FFFFFF"
              title="فسيفساء أردنية"
              description="السعر: 20 د.أ"
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/productinfo"
            />
            <Card
              btnColor="customRed"
              btnText="اشتري الآن"
              cardColor="#FFFFFF"
              title="فسيفساء أردنية"
              description="السعر: 20 د.أ"
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/productinfo"
            />
            <Card
              btnColor="customRed"
              btnText="اشتري الآن"
              cardColor="#FFFFFF"
              title="فسيفساء أردنية"
              description="السعر: 20 د.أ"
              imgSrc={cardImage}
              alt="صورة المقال"
              btnLink="/productinfo"
            />
          </div>
        </div>
        <div>
          <h2 className="text-5xl font-bold text-center mt-24 mb-11 text-[#D7CCC8]">
            ورشات مميزة
          </h2>
          <div className="grid grid-cols-[1fr] md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] gap-y-12  justify-items-center max-w-[85rem] mx-auto">
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
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default HomePage;
