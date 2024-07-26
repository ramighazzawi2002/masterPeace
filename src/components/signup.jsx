import Header from "./header";
import Footer from "./footer";
import Input from "./login&&signup/input";
import LabelHeading from "./login&&signup/labelHeading";
import Button from "./login&&signup/button";
import Or from "./login&&signup/or";
import LoginByGoogle from "./login&&signup/loginbyGoogle";
import HyperLink from "./login&&signup/link";
function Signup() {
  return (
    <>
      <Header />
      <form className="mx-auto max-w-[25rem] sm:max-w-[30rem] text-center mt-24 mb-[2.46rem] sm:mt-32 sm:mb-[4.8rem] p-4 bg-customYellow rounded-sm ">
        <LabelHeading heading="إنشاء حساب جديد" />
        <Input type="text" name="اسم المستخدم" />
        <Input type="email" name="البريد الالكتروني" />
        <Input type="password" name="كلمة المرور" />
        <Input type="password" name="تأكيد كلمة المرور" />
        <Button text="إنشاء حساب" />
        <Or />
        <LoginByGoogle text="إنشاء حساب باستخدام جوجل" />
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
