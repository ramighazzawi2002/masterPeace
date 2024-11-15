import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../components/login&&signup/input";
import LabelHeading from "../components/login&&signup/labelHeading";
import Button from "../components/login&&signup/button";
import { useUserContext } from "@/components/context/userData";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const { email } = useUserContext();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.password) newErrors.password = "كلمة المرور الجديدة مطلوبة";
    else if (formData.password.length < 8)
      newErrors.password = "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:5000/user/reset-password", {
          email,
          password: formData.password,
        });
        Swal.fire({
          title: "تم بنجاح!",
          text: "تم إعادة تعيين كلمة المرور بنجاح.",
          icon: "success",
          confirmButtonText: "حسنا",
        }).then(result => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } catch (err) {
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء إعادة تعيين كلمة المرور.",
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
        className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-40 sm:mb-[4.8rem] p-4 bg-customYellow rounded-sm"
      >
        <LabelHeading heading="إعادة تعيين كلمة المرور" />
        <Input
          type="password"
          name="كلمة المرور الجديدة"
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
        <Button text="إعادة تعيين كلمة المرور" type="submit" />
      </form>
    </>
  );
}

export default ResetPasswordForm;
