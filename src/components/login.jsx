import Header from "./header";
import Footer from "./footer";
import Input from "./login&&signup/input";
import LabelHeading from "./login&&signup/labelHeading";
import Button from "./login&&signup/button";
import Or from "./login&&signup/or";
import LoginByGoogle from "./login&&signup/loginbyGoogle";
import HyperLink from "./login&&signup/link";
function Login() {
  return (
    <>
      <Header />
      <form className="mx-auto max-w-[25rem]  sm:max-w-[30rem] text-center mt-36 mb-[5.1rem]  sm:mt-32 sm:mb-[6.95rem] p-4 bg-[#FFF8E1] rounded-sm ">
        <LabelHeading heading="تسجيل الدخول" />
        <Input type="email" name="البريد الالكتروني" />
        <Input type="password" name="كلمة المرور" />
        <Button text="تسجيل الدخول" />
        <Or />
        <LoginByGoogle text="سجل الدخول باستخدام جوجل" />
        <div className="text-right mt-4 pr-9 text-customGreen2">
          <span>نسيت كلمة المرور؟</span>
        </div>
        <HyperLink text="ليس لديك حساب؟" link="سجل الان" path="/signup" />
      </form>
      <Footer />
    </>
  );
}
export default Login;
