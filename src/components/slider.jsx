import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImprovedSwiper = ({ images }) => {
  return (
    <div className="relative w-full h-screen">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-prev",
          prevEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <button className="swiper-button-prev absolute z-10 bg-white bg-opacity-50 p-2 rounded-full w-16 h-16"></button> */}
      {/* <button className="swiper-button-next absolute top-1/2 right-4 z-10 bg-white bg-opacity-50 p-2 rounded-full"></button> */}
      <button className="swiper-button-next absolute z-10 bg-white bg-opacity-50 p-2 rounded-full w-16 h-16"></button>
      <button className="swiper-button-prev absolute z-10 bg-white bg-opacity-50 p-2 rounded-full w-16 h-16"></button>
    </div>
  );
};

export default ImprovedSwiper;
