import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

function ImprovedSwiper({ items }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="h-screen"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
            <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
            <p className="text-xl mb-6 max-w-2xl text-center">
              {item.description}
            </p>
            <Link
              to={item.link}
              className="bg-customGreen text-white px-6 py-3 rounded-full font-semibold hover:bg-customBrown transition-colors duration-300"
            >
              {item.cta}
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImprovedSwiper;
