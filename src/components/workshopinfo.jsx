import Header from "./header";
import Footer from "./footer";
import Button from "./login&&signup/button";
import cardImage from "../img/card-img.jpg";
function WorkShopInfo() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[50rem] mt-28 p-5 mb-16 shadow-lg">
        <img
          src={cardImage}
          alt="petra"
          className="block mx-auto w-[100%] mb-6"
        />
        <div className="px-8">
          <h1 className="text-4xl text-customBrown font-bold">
            صناعة الفسيفساء
          </h1>
          <p className="text-customGrey text-lg mt-4 mb-10">
            تعلم فن صناعة الفسيفساء المعقد. صمم وصنع قطع الفسيفساء الخاصة بك
            باستخدام تقنيات مستوحاة من الفسيفساء الأردنية القديمة. في هذه
            الورشة، ستتعرف على المواد والأدوات المستخدمة وستكتسب المهارات
            اللازمة لإنشاء أعمال فنية مذهلة.
          </p>
          <h2 className="text-2xl text-[#333] font-semibold">
            المواضيع التي سيتم تغطيتها
          </h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li>تاريخ الفسيفساء</li>
            <li>الأدوات والمواد الأساسية</li>
            <li>تقنيات التصميم</li>
            <li>إنشاء قطع الفسيفساء</li>
          </ul>
          <h2 className="text-2xl text-[#333] font-semibold">المتطلبات</h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li>
              لا توجد متطلبات مسبقة. الورشة مفتوحة لجميع المستويات، من المبتدئين
              إلى المتقدمين. شغف بالفن والإبداع.
            </li>
            <li>شغف بالفن والإبداع.</li>
          </ul>
          <h2 className="text-2xl text-[#333] font-semibold">المدة</h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li>الورشة تستمر لمدة يومين.</li>
            <li>الوقت: من الساعة 10 صباحاً حتى 4 مساءً.</li>
          </ul>
          <h2 className="text-2xl text-[#333] font-semibold">التكلفة</h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li className="text-lg text-customGrey">
              100 دينار أردني للشخص الواحد.
            </li>
          </ul>
          <h2 className="text-2xl text-[#333] font-semibold">الموقع</h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li>مركز التراث الأردني، عمان، الأردن</li>
          </ul>
          <h2 className="text-2xl text-[#333] font-semibold">المزايا</h2>
          <ul className="list-disc list-inside text-lg mt-4 mb-10 text-customGrey">
            <li>شهادة إتمام الورشة</li>
            <li>الحصول على جميع المواد والأدوات اللازمة.</li>
            <li>وجبة غداء خفيفة</li>
          </ul>
        </div>
        <button className="bg-customGreen text-white w-[90%] rounded-lg block mx-auto text-center transition-all px-4 py-2 hover:bg-[#7db043] cursor-pointer">
          سجل الان
        </button>
      </div>
      <Footer />
    </>
  );
}
export default WorkShopInfo;
