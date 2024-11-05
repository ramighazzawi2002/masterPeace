import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../config";
import HeritageChat from "../components/HeritageChat";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredWorkshops, setFeaturedWorkshops] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);

  const sliderItems = [
    {
      gradient:
        "bg-gradient-to-br from-customBrown via-customBrown/90 to-customBrown/80",
      pattern:
        "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)",
      icon: "📚",
      title: "مقالات مميزة",
      link: "/articles",
      description: "اكتشف أسرار التراث الأردني من خلال مقالاتنا الشيقة",
      cta: "اقرأ الآن",
      animation: "animate-float",
    },
    {
      gradient:
        "bg-gradient-to-br from-customBrown via-customBrown/85 to-customBrown/70",
      pattern:
        "repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)",
      icon: "🎯",
      title: "ورشات عمل",
      link: "/workshops",
      description: "شارك في ورشات عمل تفاعلية لتعلم الحرف التقليدية",
      cta: "احجز مكانك",
      animation: "animate-bounce-slow",
    },
    {
      gradient:
        "bg-gradient-to-br from-customBrown via-customBrown/80 to-customBrown/60",
      pattern:
        "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)",
      icon: "🛍️",
      title: "منتجاتنا",
      link: "/products",
      description: "تسوق منتجات حرفية أصيلة صنعت بأيدي فنانين محليين",
      cta: "تسوق الآن",
      animation: "animate-pulse-slow",
    },
  ];

  useEffect(() => {
    fetchHomePageData();
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
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

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % sliderItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + sliderItems.length) % sliderItems.length
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="relative h-screen overflow-hidden">
        {sliderItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className={`relative h-full w-full ${item.gradient}`}>
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: item.pattern }}
              />

              {/* Animated background shapes */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-10 top-1/4 w-40 h-40 bg-customBrown/20 rounded-full blur-3xl animate-float" />
                <div className="absolute right-1/4 top-1/3 w-60 h-60 bg-customBrown/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute left-1/3 bottom-1/4 w-48 h-48 bg-customBrown/20 rounded-full blur-3xl animate-bounce-slow" />
              </div>

              {/* Content remains the same but with updated border colors */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative text-center text-white p-8 max-w-3xl">
                  <div className={`text-6xl mb-6 ${item.animation}`}>
                    {item.icon}
                  </div>

                  {/* Traditional pattern border with customBrown */}
                  <div className="absolute inset-0 -m-8 border-2 border-customBrown/20 rounded-2xl">
                    <div className="absolute inset-0 scale-95 border border-customBrown/20 rounded-2xl" />
                  </div>

                  <h2 className="text-6xl font-bold mb-6 transform transition-all duration-700">
                    {item.title}
                  </h2>
                  <p className="text-xl mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <Link
                    to={item.link}
                    className="group relative inline-flex items-center px-8 py-3 overflow-hidden rounded-full bg-customBrown/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-customBrown/30"
                  >
                    <span className="relative group-hover:scale-105 transition-transform duration-300">
                      {item.cta}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation buttons with improved z-index and pointer-events */}
        <button
          onClick={nextSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-customBrown/20 backdrop-blur-md p-4 rounded-full hover:bg-customBrown/30 transition-all duration-300 group border border-customBrown/20 z-20 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button
          onClick={prevSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-customBrown/20 backdrop-blur-md p-4 rounded-full hover:bg-customBrown/30 transition-all duration-300 group border border-customBrown/20 z-20 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Slide indicators with improved z-index and pointer-events */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sliderItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 backdrop-blur-sm cursor-pointer
                ${
                  currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2 bg-customBrown/50 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

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
