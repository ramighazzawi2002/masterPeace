import Header from "./header";
import Footer from "./footer";
import { useState, useRef } from "react";
import profileImage from "../img/profile-circle-icon-512x512-zxne30hp.png";
import { Rating, Textarea } from "@material-tailwind/react";
import cardImage from "../img/card-img.jpg";
function ArticleInfo() {
  const textArea = useRef();
  const [ratingValue, setRatingValue] = useState(0);

  const addComment = () => {
    // setComments(textArea.current.value);
    // console.log(comments);
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
      rating: 3,
    },
  ]);
  return (
    <>
      <Header />
      <div className="max-w-[80rem] my-28 mx-auto">
        <div className="rounded-lg p-4 sm:p-8">
          <h1 className="text-4xl font-bold text-customBrown mb-7">
            فن الفسيفساء في الأردن
          </h1>
          <img
            src={cardImage}
            alt="صورة المقال"
            className="h-[28rem] w-full object-cover rounded-lg mb-7"
          />
          <p className="text-xl text-right mb-7">
            الفن الفسيفسائي هو أحد أقدم الفنون التي عرفتها البشرية. يتمثل هذا
            الفن في تجميع قطع صغيرة من الحجارة أو الزجاج أو السيراميك لتشكيل صور
            فنية رائعة. في الأردن، يمتد تاريخ الفسيفساء إلى العصور القديمة حيث
            يمكن العثور على العديد من الأمثلة الجميلة في المواقع الأثرية مثل
            مادبا والبحر الميت. تعتمد تقنيات الفسيفساء على الدقة والصبر، حيث يجب
            على الفنان ترتيب كل قطعة صغيرة بعناية لتحقيق التصميم النهائي.
            تُستخدم الأدوات اليدوية البسيطة مثل الملاقط والمطارق الصغيرة،
            وأحيانًا يتم رسم التصميم المبدئي على السطح قبل بدء وضع القطع.
            الفسيفساء ليست فقط فناً جميلاً ولكنها تحمل أيضًا تاريخًا وثقافة، حيث
            تعكس التصاميم والأنماط المستخدمة في الفسيفساء الأردنية التراث
            الثقافي والديني للمنطقة.
          </p>
          <div>
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
      </div>
    </>
  );
}
export default ArticleInfo;
