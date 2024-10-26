import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../components/login&&signup/input";
import LabelHeading from "../components/login&&signup/labelHeading";
import Button from "../components/login&&signup/button";
import HyperLink from "../components/login&&signup/link";
import { useUserContext } from "@/components/context/userData";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { setEmail: setUserEmail, setIsForgotPassword } = useUserContext();

  const handleInputChange = value => {
    setEmail(value);
    setError("");
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صالح");
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      setUserEmail(email);
      setIsForgotPassword(true);
      try {
        await axios.post("http://localhost:5000/user/forgot-password", {
          email,
        });
        Swal.fire({
          title: "تم بنجاح!",
          text: "لقد تم إرسال رمز التحقق إلى بريدك الإلكتروني.",
          icon: "success",
          confirmButtonText: "حسنا",
        }).then(result => {
          if (result.isConfirmed) {
            navigate("/otp");
          }
        });
      } catch (err) {
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور.",
          icon: "error",
          confirmButtonText: "حسنا",
        });
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-56 sm:mb-[14rem] p-4 bg-customYellow rounded-sm"
      >
        <LabelHeading heading="نسيت كلمة المرور" />
        <Input
          type="email"
          name="البريد الالكتروني"
          value={email}
          onChange={handleInputChange}
          error={error}
        />
        <Button text="ارسال رمز التحقق" type="submit" />
        <HyperLink text="العودة إلى" link="تسجيل الدخول" path="/login" />
      </form>
    </>
  );
}

export default ForgotPassword;
