import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../components/footer";
import Input from "../components/login&&signup/input";
import LabelHeading from "../components/login&&signup/labelHeading";
import Button from "../components/login&&signup/button";
import Or from "../components/login&&signup/or";
import LoginByGoogle from "../components/login&&signup/loginbyGoogle";
import HyperLink from "../components/login&&signup/link";
import { useUserContext } from "@/components/context/userData";
axios.defaults.withCredentials = true;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isGoogle, setIsGoogle] = useState(false);
  const { setIsLoggedIn, setIsGoogle: setIsGoogleContext } = useUserContext();
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صالح";
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleGoogleLogin = () => {
    setIsGoogle(true);
    axios
      .get("http://localhost:5000/auth/google", {
        withCredentials: true, // This ensures that cookies are sent
      })
      .then(response => {
        // Handle response after redirect, if needed
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
    window.location.href = "http://localhost:5000/auth/google"; // Backend route to trigger OAuth flow
    // The backend will handle the redirect, so we don't need to do anything here
    setIsGoogleContext(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isGoogle) {
      return;
    }
    if (validateForm()) {
      try {
        await axios.post("http://localhost:5000/user/login", formData, {
          withCredentials: true,
        });
        setIsLoggedIn(true);
        Swal.fire({
          title: "تم بنجاح!",
          text: "تم تسجيل الدخول بنجاح.",
          icon: "success",
          confirmButtonText: "حسنا",
        }).then(result => {
          if (result.isConfirmed) {
            // Navigate to dashboard or home page
            navigate("/");
          }
        });
      } catch (err) {
        Swal.fire({
          title: "خطأ!",
          text: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          icon: "error",
          confirmButtonText: "حسنا",
        });
      }
    } else {
      Swal.fire({
        title: "خطأ!",
        text: "يرجى تصحيح الأخطاء في النموذج",
        icon: "error",
        confirmButtonText: "حسنا",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-40 sm:mb-[4.8rem] p-4 bg-customYellow rounded-sm"
      >
        <LabelHeading heading="تسجيل الدخول" />
        <Input
          type="email"
          name="البريد الالكتروني"
          value={formData.email}
          onChange={value => handleInputChange("email", value)}
          error={errors.email}
        />
        <Input
          type="password"
          name="كلمة المرور"
          value={formData.password}
          onChange={value => handleInputChange("password", value)}
          error={errors.password}
        />
        <Button text="تسجيل الدخول" type="submit" />
        <Or />
        <LoginByGoogle
          text="سجل الدخول باستخدام جوجل"
          onClick={() => {
            handleGoogleLogin();
          }}
        />
        <HyperLink link="نسيت كلمة المرور؟" path="/forget-password" />
        <HyperLink text="ليس لديك حساب؟" link="سجل الان" path="/signup" />
      </form>
      <Footer />
    </>
  );
}

export default Login;
