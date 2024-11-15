import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LabelHeading from "../components/login&&signup/labelHeading";
import Button from "../components/login&&signup/button";
import axios from "axios";
import { useUserContext } from "@/components/context/userData";
function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const { email, password, userName, isForgotPaswsword } = useUserContext();
  const { setIsLoggedIn } = useUserContext();
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      // Here you would typically verify the OTP with your backend
      try {
        if (!isForgotPaswsword) {
          await axios.post(
            "http://localhost:5000/user/verify-otp",
            {
              email,
              otp: enteredOtp,
              username: userName,
              password,
            },
            {
              withCredentials: true,
            }
          );
        } else {
          await axios.post(
            "http://localhost:5000/user/verify-otp-forget-password",
            {
              email,
              otp: enteredOtp,
            },
            {
              withCredentials: true,
            }
          );
        }

        Swal.fire({
          title: "تم التحقق بنجاح!",
          text: "تم التحقق من حسابك بنجاح.",
          icon: "success",
          confirmButtonText: "حسنا",
        }).then(result => {
          if (result.isConfirmed) {
            navigate(`${isForgotPaswsword ? "/reset-password" : "/"}`);
            !isForgotPaswsword && setIsLoggedIn(true);
          }
        });
      } catch (err) {
        Swal.fire({
          title: "خطأ!",
          text: "رمز التحقق غير صالح",
          icon: "error",
          confirmButtonText: "حسنا",
        });
      }
    } else {
      Swal.fire({
        title: "خطأ!",
        text: "يرجى إدخال رمز التحقق كاملاً",
        icon: "error",
        confirmButtonText: "حسنا",
      });
    }
  };

  const handleResendOtp = () => {
    // Here you would typically call your API to resend the OTP
    console.log(email);
    if (!isForgotPaswsword) {
      axios.post("http://localhost:5000/user/send-otp", {
        email: email,
      });
    } else {
      axios.post("http://localhost:5000/user/forgot-password", {
        email: email,
      });
    }
    setTimer(60);
    Swal.fire({
      title: "تم إرسال الرمز",
      text: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.",
      icon: "success",
      confirmButtonText: "حسنا",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-48 sm:mb-56  p-4 bg-customYellow rounded-sm"
      >
        <LabelHeading heading="التحقق من الحساب" />
        <p className="text-gray-600 mb-4">
          الرجاء إدخال رمز التحقق المرسل إلى بريدك الإلكتروني
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded"
            />
          ))}
        </div>
        <Button text="تحقق" type="submit" />
        <div className="mt-4">
          {timer > 0 ? (
            <p className="text-gray-600">
              إعادة إرسال الرمز خلال {timer} ثانية
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:underline"
            >
              إعادة إرسال رمز التحقق
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default OTP;
