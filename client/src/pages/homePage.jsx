import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ImprovedSwiper from "../components/slider";
import axios from "axios";
import { BASE_URL } from "../config";

// Import static images for the slider
import sliderImage1 from "../img/card-img.jpg";
import sliderImage2 from "../img/card-img.jpg";
import sliderImage3 from "../img/card-img.jpg";

function HomePage() {
  const [featuredWorkshops, setFeaturedWorkshops] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);

  const sliderItems = [
    {
      image: sliderImage1,
      title: "مقالات مميزة",
      link: "/articles",
      description: "اكتشف أسرار التراث الأردني من خلال مقالاتنا الشيقة",
      cta: "اقرأ الآن",
    },
    {
      image: sliderImage2,
      title: "ورشات عمل",
      link: "/workshops",
      description: "شارك في ورشات عمل تفاعلية لتعلم الحرف التقليدية",
      cta: "احجز مكانك",
    },
    {
      image: sliderImage3,
      title: "منتجاتنا",
      link: "/products",
      description: "تسوق منتجات حرفية أصيلة صنعت بأيدي فنانين محليين",
      cta: "تسوق الآن",
    },
  ];

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/home`);
      const { featuredWorkshops, featuredProducts, featuredArticles } =
        response.data;
      setFeaturedWorkshops(featuredWorkshops);
      setFeaturedProducts(featuredProducts);
      setFeaturedArticles(featuredArticles);
    } catch (error) {
      console.error("Error fetching home page data:", error);
    }
  };

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
          title="أخر الورشات"
          items={featuredWorkshops}
          linkPrefix="/workshopinfo"
        />

        <FeaturedSection
          title="أخر المنتجات"
          items={featuredProducts}
          linkPrefix="/productinfo"
        />

        <FeaturedSection
          title="أخر المقالات"
          items={featuredArticles}
          linkPrefix="/articleinfo"
        />
      </section>
    </div>
  );
}

function FeaturedSection({ title, items, linkPrefix, name }) {
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
              src={`${BASE_URL}/uploads/${item.image}`}
              alt={item.title || item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-customBrown mb-2">
                {item.title || item.name}
              </h3>
              {item.price && (
                <p className="text-gray-600 mb-2">السعر: {item.price} د.أ</p>
              )}
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link
                to={`${linkPrefix}/${item.id}`}
                className="inline-flex items-center text-customGreen hover:text-customBrown transition-colors duration-300"
              >
                {item.linkText || "اقرأ المزيد"}
                <ChevronLeft className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
