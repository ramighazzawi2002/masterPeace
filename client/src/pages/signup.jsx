import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../components/footer";
import Input from "../components/login&&signup/input";
import LabelHeading from "../components/login&&signup/labelHeading";
import Button from "../components/login&&signup/button";
import Or from "../components/login&&signup/or";
import LoginByGoogle from "../components/login&&signup/loginbyGoogle";
import HyperLink from "../components/login&&signup/link";
import axios from "axios";
import { useUserContext } from "@/components/context/userData";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { setEmail, setUserName, setPassword } = useUserContext();
  const [isGoogle, setIsGoogle] = useState(false);
  const { setIsGoogle: setIsGoogleContext } = useUserContext();
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "اسم المستخدم مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صالح";
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";

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
        await axios.post("http://localhost:5000/user/send-otp", {
          email: formData.email,
        });

        setEmail(formData.email);
        setUserName(formData.username);
        setPassword(formData.password);
        Swal.fire({
          title: "تم بنجاح!",
          text: "لقد تم إرسال رمز التحقق إلى بريدك الإلكتروني.",
          icon: "success",
          confirmButtonText: "حسنا",
        }).then(result => {
          if (result.isConfirmed) {
            navigate("/otp"); // Navigate to OTP page
          }
        });
      } catch (err) {
        Swal.fire({
          title: "البريد الإلكتروني مسجل مسبقاً",
          text: "هذا البريد الإلكتروني مرتبط بحساب موجود. هل تريد تسجيل الدخول بدلاً من ذلك؟",
          icon: "warning",
          confirmButtonText: "تسجيل الدخول",
          cancelButtonText: "إلغاء",
          showCancelButton: true,
        }).then(result => {
          if (result.isConfirmed) {
            navigate("/login");
          }
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
        className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-32 sm:mb-[4.8rem] p-4 bg-customYellow rounded-sm"
      >
        <LabelHeading heading="إنشاء حساب جديد" />
        <Input
          type="text"
          name="اسم المستخدم"
          value={formData.username}
          onChange={value => handleInputChange("username", value)}
          error={errors.username}
        />
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
        <Input
          type="password"
          name="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={value => handleInputChange("confirmPassword", value)}
          error={errors.confirmPassword}
        />
        <Button text="إنشاء حساب" type="submit" />
        <Or />
        <LoginByGoogle
          text="إنشاء حساب باستخدام جوجل"
          onClick={() => {
            handleGoogleLogin();
          }}
        />
        <HyperLink
          text="هل لديك حساب بالفعل؟"
          link="تسجيل الدخول"
          path="/login"
        />
      </form>
      <Footer />
    </>
  );
}

export default Signup;
