import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillingAddressForm from "./billingAddress";
import { useWorkshopContext } from "../components/context/workShopAmount";
import { useProductContext } from "../components/context/productData";
import axios from "axios";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  Download,
  Check,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51PxQuo030SZfrflmKeYUViQnyoQCT5x4IXVdhjk1lRVJ9SD34ySedg8rGolP0ZK4CkCHM22wdggfkX84Sh01ny4z00jursh6mz"
);

const StripeCheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("Stripe payment successful!", paymentMethod);
      onSuccess(paymentMethod);
    } else {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="p-2 border border-gray-300 rounded-md" />
      <Button
        type="submit"
        disabled={!stripe}
        className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Pay with Stripe
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const [step, setStep] = useState("billing");
  const [billingAddress, setBillingAddress] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { workshopAmount, workshopId } = useWorkshopContext();
  const { productId, amount, quantity } = useProductContext();
  const [workshopDetails, setWorkshopDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [paymentSuccess]);

  useEffect(() => {
    if (paymentSuccess && workshopId) {
      // Fetch workshop details
      axios
        .get(`http://localhost:5000/workshop/get/${workshopId}`)
        .then(response => {
          setWorkshopDetails(response.data);
        })
        .catch(error => {
          console.error("Error fetching workshop details:", error);
        });
    }
  }, [paymentSuccess, workshopId]);

  useEffect(() => {
    if (paymentSuccess && productId) {
      // Fetch product details
      axios
        .get(`http://localhost:5000/product/${productId}`)
        .then(response => {
          setProductDetails(response.data);
        })
        .catch(error => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [paymentSuccess, productId]);

  const handleBillingSubmit = formData => {
    setBillingAddress(formData);
    setStep("payment");
  };

  const handlePayPalSuccess = async (details, data) => {
    console.log("PayPal Success!", details, data);
    if (amount) {
      await createOrderItem("paypal");
    } else {
      await createWorkshopRegistration("paypal");
    }
    setPaymentSuccess(true);
  };

  const handleStripeSuccess = async paymentMethod => {
    console.log("Stripe Success!", paymentMethod);
    if (amount) {
      await createOrderItem("stripe");
    } else {
      await createWorkshopRegistration("stripe");
    }
    setPaymentSuccess(true);
  };

  const createOrderItem = async paymentMethod => {
    console.log("billingAddress", billingAddress);
    await axios.post(
      "http://localhost:5000/orderitem/add",
      {
        productId,
        quantity,
        full_name: billingAddress.fullName,
        address: billingAddress.address,
        city: billingAddress.city,
        phone_number: billingAddress.phoneNumber,
        payment_method: paymentMethod,
        amount_paid: amount,
      },
      {
        withCredentials: true,
      }
    );
    await axios.delete("http://localhost:5000/cart/clear", {
      withCredentials: true,
    });
  };

  const createWorkshopRegistration = async paymentMethod => {
    await axios.post("http://localhost:5000/workshopregistration/create", {
      workshop_id: workshopId,
      full_name: billingAddress.fullName,
      address: billingAddress.address,
      city: billingAddress.city,
      phone_number: billingAddress.phoneNumber,
      payment_method: paymentMethod,
      amount_paid: workshopAmount,
    });
  };

  const translateText = async text => {
    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text,
        from: "ar",
        to: "en",
      });
      return response.data.responseData.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    // Helper function to translate text
    const translate = async text => {
      try {
        const response = await axios.post("http://localhost:5000/translate", {
          text,
          from: "ar",
          to: "en",
        });
        return response.data.responseData.translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return text; // Return original text if translation fails
      }
    };

    if (workshopDetails) {
      // Workshop registration invoice
      doc.text("Workshop Registration Invoice", 14, 15);
      const translatedTitle = await translate(workshopDetails.title);
      const translatedLocation = await translate(workshopDetails.location);
      doc.autoTable({
        startY: 20,
        head: [["Item", "Details"]],
        body: [
          ["Workshop", translatedTitle],
          ["Date", new Date(workshopDetails.date).toLocaleDateString()],
          [
            "Time",
            `${workshopDetails.start_time} - ${workshopDetails.end_time}`,
          ],
          ["Location", translatedLocation],
          ["Price", `${workshopAmount} JOD`],
        ],
      });
    } else if (productDetails) {
      // Product order invoice
      doc.text("Order Invoice", 14, 15);
      const translatedProductName = await translate(productDetails.name);
      doc.autoTable({
        startY: 20,
        head: [["Product", "Quantity", "Price", "Total"]],
        body: [
          [
            translatedProductName,
            quantity,
            `${amount / quantity} JOD`,
            `${amount} JOD`,
          ],
        ],
      });
    } else {
      // Handle case where neither workshop nor product details are available
      doc.text("Invoice", 14, 15);
      doc.text("No details available", 14, 25);
    }

    // Add billing address with improved layout
    doc.text("Billing Address", 14, doc.lastAutoTable.finalY + 10);
    const translatedFullName = await translate(billingAddress.fullName);
    const translatedAddress = await translate(billingAddress.address);
    const translatedCity = await translate(billingAddress.city);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: { 0: { fontStyle: "bold" } },
      body: [
        ["Name:", translatedFullName],
        ["Address:", translatedAddress],
        ["City:", translatedCity],
        ["Phone:", billingAddress.phoneNumber],
      ],
    });

    doc.save("invoice.pdf");
  };

  const handleReturnHome = () => {
    navigate("/"); // Navigate to the home page
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-customGreen/20 to-white flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <CardHeader className="bg-customGreen text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <Check className="text-customGreen w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              تم الدفع بنجاح!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {workshopDetails ? (
              <>
                <p className="text-xl text-gray-700 text-center mb-6">
                  شكراً لك على التسجيل في الورشة. نتطلع إلى رؤيتك قريباً!
                </p>
                <div className="bg-gray-100 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-customBrown">
                    تفاصيل الورشة:
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Calendar className="mr-2 text-customGreen" size={18} />
                      <span>
                        التاريخ:{" "}
                        {new Date(workshopDetails.date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="mr-2 text-customGreen" size={18} />
                      <span>
                        الوقت: {workshopDetails.start_time} -{" "}
                        {workshopDetails.end_time}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <MapPin className="mr-2 text-customGreen" size={18} />
                      <span>المكان: {workshopDetails.location}</span>
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full mt-4 bg-customBrown text-white py-3 px-4 rounded-md hover:bg-customBrown/90 transition duration-300 text-lg font-semibold shadow-md flex items-center justify-center"
                >
                  <Download className="mr-2" size={20} />
                  تحميل التفاصيل كـ PDF
                </Button>
              </>
            ) : (
              <p className="text-xl text-gray-700 text-center mb-6">
                شكراً لك على شرائك. سيتم شحن طلبك قريباً!
              </p>
            )}
            <Button
              onClick={handleReturnHome}
              className="w-full mt-4 bg-customGreen text-white py-3 px-4 rounded-md hover:bg-customGreen/90 transition duration-300 text-lg font-semibold shadow-md flex items-center justify-center"
            >
              العودة إلى الصفحة الرئيسية
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "billing") {
    return <BillingAddressForm onSubmit={handleBillingSubmit} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-customBrown">
          إتمام الشراء
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
              <CardHeader className="bg-customBrown text-white p-6">
                <CardTitle className="text-2xl font-bold">
                  تفاصيل الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-right">
                    عنوان الفواتير
                  </h3>
                  <p
                    className="text-sm text-gray-600 mb-4 text-right"
                    dir="rtl"
                  >
                    {billingAddress.fullName}
                    <br />
                    {billingAddress.address}
                    <br />
                    {billingAddress.city}
                    <br />
                    {billingAddress.phoneNumber}
                  </p>
                  <Button
                    onClick={() => setStep("billing")}
                    variant="outline"
                    className="text-customBrown border-customBrown hover:bg-customBrown hover:text-white"
                  >
                    تعديل العنوان
                  </Button>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    اختر طريقة الدفع
                  </h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:border-customGreen transition-colors">
                      <h4 className="font-semibold flex items-center">
                        <CreditCard className="mr-2" /> الدفع عبر Stripe
                      </h4>
                      <Elements stripe={stripePromise}>
                        <StripeCheckoutForm
                          amount={workshopAmount || amount}
                          onSuccess={handleStripeSuccess}
                        />
                      </Elements>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-customGreen transition-colors">
                      <h4 className="font-semibold flex items-center mb-4">
                        <img
                          src="/path-to-paypal-logo.png"
                          alt="PayPal"
                          className="w-6 h-6 mr-2"
                        />
                        الدفع عبر PayPal
                      </h4>
                      <PayPalButton
                        amount={workshopAmount || amount}
                        onSuccess={handlePayPalSuccess}
                        options={{
                          clientId:
                            "AYOHT_PiYHOYOEeBBFX6aJ2Qba1FNYaerPfuYMGdYNebFt8DowMGVOkpRONRk2hN_qaVgpVedHJU6Ywi",
                          currency: "USD",
                          disableFunding: "card",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:w-1/3">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden sticky top-4">
              <CardHeader className="bg-customGreen text-white p-6">
                <CardTitle className="text-xl font-bold">ملص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{workshopAmount || amount} دينار أردني</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الضريبة:</span>
                    <span>0.00 دينار أردني</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>الإجمالي:</span>
                      <span>{workshopAmount || amount} دينار أردني</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <ShieldCheck className="mr-2 text-customGreen" /> الدفع الآمن
              </h4>
              <p className="text-sm text-gray-600">
                جميع المعاملات مشفرة وآمنة. معلوماتك الشخصية محمية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
