import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ImprovedSwiper from "../components/slider";
import Footer from "../components/footer";

// Import new images for the slider
import articlesImage from "../img/card-img.jpg";
import workshopsImage from "../img/card-img.jpg";
import productsImage from "../img/card-img.jpg";

// Import images for featured sections
import workshopImage from "../img/card-img.jpg";
import productImage from "../img/card-img.jpg";
import articleImage from "../img/card-img.jpg";

function HomePage() {
  const sliderItems = [
    {
      image: articlesImage,
      title: "مقالات مميزة",
      link: "/articles",
      description: "اكتشف أسرار التراث الأردني من خلال مقالاتنا الشيقة",
      cta: "اقرأ الآن",
    },
    {
      image: workshopsImage,
      title: "ورشات عمل",
      link: "/workshops",
      description: "شارك في ورشات عمل تفاعلية لتعلم الحرف التقليدية",
      cta: "احجز مكانك",
    },
    {
      image: productsImage,
      title: "منتجاتنا",
      link: "/products",
      description: "تسوق منتجات حرفية أصيلة صنعت بأيدي فنانين محليين",
      cta: "تسوق الآن",
    },
  ];

  return (
    <div className="bg-gray-50">
      <ImprovedSwiper items={sliderItems} />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-customYellow rounded-xl p-8 mb-16 shadow-lg">
          <h1 className="text-4xl font-bold text-center text-customBrown mb-6">
            التراث الأردني
          </h1>
          <p className="text-xl text-customBrown leading-relaxed text-justify">
            التراث الأردني هو مزيج غني من التقاليد والثقافة والصمود عبر القرون.
            من أسواق عمّان النابضة بالحياة إلى المناظر الطبيعية الساحرة في
            البتراء، يعكس التراث الأردني ارتباطاً عميقاً بتاريخه وشعبه. استكشف
            فن التطريز الأردني، وتذوق الأطباق اللذيذة من المطبخ الأردني، واكتشف
            فن صناعة الفسيفساء. انضم إلينا في الاحتفال بالتراث الأردني، حيث كل
            غرزة، كل نكهة، وكل قصة تروي حكاية الأرض التي شكلها الزمن وحفظتها في
            قلوب شعبها.
          </p>
        </div>

        <FeaturedSection
          title="ورشات مميزة"
          items={[
            {
              image: workshopImage,
              title: "فن الفسيفساء في الأردن",
              description:
                "استكشف فن صناعة الفسيفساء المعقد. صمم واصنع قطعتك الخاصة باستخدام تقنيات مستوحاة من الفسيفساء الأردنية القديمة.",
              link: "/workshopinfo",
              linkText: "تعرف أكثر",
            },
            // Add more workshop items here
          ]}
        />

        <FeaturedSection
          title="أشهر المنتجات"
          items={[
            {
              image: productImage,
              title: "فسيفساء أردنية",
              description: "قطعة فنية أصيلة مصنوعة يدويًا بتقنيات تقليدية.",
              link: "/productinfo",
              linkText: "اشتري الآن",
              price: "20 د.أ",
            },
            // Add more product items here
          ]}
        />

        <FeaturedSection
          title="مقالات مميزة"
          items={[
            {
              image: articleImage,
              title: "تاريخ الفسيفساء في الأردن",
              description:
                "اكتشف الجذور العميقة لفن الفسيفساء في الأردن وتأثيره على الثقافة المحلية.",
              link: "/articleinfo",
              linkText: "اقرأ المزيد",
            },
            // Add more article items here
          ]}
        />
      </section>
      <Footer />
    </div>
  );
}

function FeaturedSection({ title, items }) {
  return (
    <div className="mb-16">
      <h2 className="text-4xl font-bold text-center mb-8 text-customBrown">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-customBrown mb-2">
                {item.title}
              </h3>
              {item.price && (
                <p className="text-gray-600 mb-2">السعر: {item.price}</p>
              )}
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link
                to={item.link}
                className="inline-flex items-center text-customGreen hover:text-customBrown transition-colors duration-300"
              >
                {item.linkText}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
