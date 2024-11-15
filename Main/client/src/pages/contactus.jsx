import { Input } from "@material-tailwind/react";
import { Textarea } from "@material-tailwind/react";
import { useState } from "react";
import axios from "axios";
import petra from "../img/petra.jpg";
import SEO from "../components/SEO";

function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.email ||
      !form.message
    ) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/message/add", {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone,
        email: form.email,
        message: form.message,
      });
      console.log(response.data);
      alert("Message sent successfully");
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
  return (
    <>
      <SEO
        title="اتصل بنا"
        description="تواصل معنا لأي استفسارات حول التراث الأردني والورش والمنتجات"
        keywords="اتصل بنا, تواصل, دعم العملاء, مساعدة, استفسارات"
      />
      <div className="flex flex-col lg:flex-row max-w-[95%] sm:max-w-[80%] mx-auto my-32">
        <div
          className="w-[100%] lg:w-[40%] h-[80vh] bg-cover"
          style={{
            backgroundImage: `linear-gradient(to right,rgb(93, 64, 55, .7), rgb(93, 64, 55,.7)),url(${petra})`,
          }}
        ></div>
        <div className="bg-customYellow w-[100%] lg:w-[60%] h-[80vh] p-7">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-10 my-10 flex-wrap md:flex-nowrap ">
              <Input
                variant="standard"
                label="الاسم الاول"
                placeholder="الاسم الاول"
                value={form.firstName}
                name="firstName"
                onChange={handleChange}
              />
              <Input
                variant="standard"
                label="الاسم الاخير"
                placeholder="الاسم الاخير"
                value={form.lastName}
                name="lastName"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap gap-10 my-10 md:flex-nowrap">
              <Input
                variant="standard"
                label="رقم الهاتف"
                placeholder="رقم الهاتف"
                value={form.phone}
                name="phone"
                onChange={handleChange}
              />
              <Input
                variant="standard"
                label="البريد الالكتروني"
                placeholder="البريد الالكتروني"
                value={form.email}
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="my-11">
              <Textarea
                variant="static"
                label="الرسالة"
                placeholder="اكتب رسالتك"
                value={form.message}
                name="message"
                onChange={handleChange}
              />

              <button className="bg-customGreen w-32 text-white px-4 py-2 rounded block mt-6">
                ارسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default ContactUs;
