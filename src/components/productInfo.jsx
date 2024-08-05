import React, { useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import cardImage from "../img/card-img.jpg";
import Header from "./header";
import Footer from "./footer";
import { Rating, Textarea } from "@material-tailwind/react";
import profileImage from "../img/profile-circle-icon-512x512-zxne30hp.png";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const textArea = useRef();
  const [ratingValue, setRatingValue] = useState(0);
  const addComment = () => {
    setComments([
      ...comments,

      {
        id: comments.length + 1,
        text: textArea.current.querySelector("textarea").value,
        rating: ratingValue,
        author: `مستخدم ${comments.length + 1}`,
      },
    ]);
    console.log(comments);
  };
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "علي",
      text: "هذا مقال رائع حول الفسيفساء. أحببت التفاصيل المقدمة!",
      rating: 5,
    },
    {
      id: 2,
      author: "سارة",
      text: "شكراً للمعلومات المفيدة. الفسيفساء فن هي مذهل حقاً.",
      rating: 4,
    },
    {
      id: 3,
      author: "محمد رمضان",
      text: "أحببت الصور الموجودة في المقال. تجعلني أرغب في زيارة الأردن لرؤية الفسيفساء بنفسي.",
      rating: 5,
    },
    {
      id: 4,
      author: "عثمان",
      text: "الفسيفساء فن رائع. أتمنى أن أتعلم كيفية صنعها.",
      rating: 4,
    },
  ]);
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 my-20">
        <div className="flex flex-col md:flex-row-reverse">
          {/* Product Image */}
          <div className="md:w-1/2 md:pr-8">
            <img
              src={cardImage}
              alt="فسيفساء أردنية"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">فسيفساء أردنية</h1>
            <div className="flex items-center mt-2">
              <Rating
                value={Math.round(
                  comments.reduce(
                    (total, comment) => total + comment.rating,
                    0
                  ) / comments.length
                )}
                readonly
              />
              <span className="mr-2 text-gray-600">
                ({comments.length} تقييم)
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              20 دينار أردني
            </p>
            <p className="mt-4 text-gray-600">
              فسيفساء أردنية يدوية الصنع تتميز بتصاميم معقدة لأوراق الخريف. كل
              قطعة فريدة من نوعها وتم إنشاؤها بعناية من قبل حرفيين مهرة.
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center mt-6">
              <span className="ml-3 text-gray-700">الكمية:</span>
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Link to="/shoppingCart">
              <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <ShoppingCart className="ml-2" />
                أضف إلى السلة
              </button>
            </Link>
            {/* Additional Info */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800">
                تفاصيل المنتج
              </h3>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>المواد: بلاط من الحجر والزجاج</li>
                <li>الحجم: تقريبا 30 سم × 30 سم</li>
                <li>صناعة يدوية في الأردن</li>
                <li>مناسبة للديكور الجداري</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <h2 className="text-4xl">التعليقات</h2>
          {comments.map(comment => (
            <div className=" p-4 rounded-lg my-7">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={profileImage}
                  alt="صورة الملف الشخصي"
                  className="h-12 w-12 rounded-full"
                />
                <h3 className="text-2xl font-bold">{comment.author}</h3>
              </div>
              <div className="flex">
                <Rating value={comment.rating} readonly />
              </div>
              <p className="text-lg">{comment.text}</p>
            </div>
          ))}
          <Textarea
            label="اضف تعليقك هنا"
            className=" text-[20px]"
            ref={textArea}
          />

          <div className="flex items-center">
            <span className="ml-2 text-gray-600">التقييم:</span>
            <Rating
              value={ratingValue}
              onChange={value => setRatingValue(value)}
            />
          </div>
          <button
            className="bg-customGreen text-white py-2 px-4 rounded-lg mt-4"
            onClick={addComment}
          >
            إضافة تعليق
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
