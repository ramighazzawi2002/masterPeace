import Header from "./header";
import Footer from "./footer";
import { Input } from "@material-tailwind/react";
import { Textarea } from "@material-tailwind/react";

function ContactUs() {
  return (
    <>
      <Header />
      <div className="flex w-[80%] mx-auto my-32">
        <div
          className="w-[40%] h-[80h] bg-cover"
          style={{
            backgroundImage: `linear-gradient(to right,rgb(93, 64, 55, .7), rgb(93, 64, 55,.7)),url("./src/img/petra.jpg")`,
          }}
        ></div>
        <div className="bg-customYellow w-[60%] h-[80vh] p-7">
          <div className="flex gap-10 my-10">
            <Input
              variant="standard"
              label="الاسم الاول"
              placeholder="الاسم الاول"
            />
            <Input
              variant="standard"
              label="الاسم الاخير"
              placeholder="الاسم الاخير"
            />
          </div>
          <div className="flex gap-10 my-10">
            <Input
              variant="standard"
              label="رقم الهاتف"
              placeholder="رقم الهاتف"
            />
            <Input
              variant="standard"
              label="البريد الالكتروني"
              placeholder="البريد الالكتروني"
            />
          </div>
          <div className="my-11">
            <Textarea
              variant="static"
              label="الرسالة"
              placeholder="اكتب رسالتك"
            />

            <button className="bg-customGreen w-32 text-white px-4 py-2 rounded block mt-6">
              ارسال
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default ContactUs;
