import React, { useState } from "react";
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
const stripePromise = loadStripe(
  "pk_test_51PxQuo030SZfrflmKeYUViQnyoQCT5x4IXVdhjk1lRVJ9SD34ySedg8rGolP0ZK4CkCHM22wdggfkX84Sh01ny4z00jursh6mz"
);
import { useWorkshopContext } from "../components/context/workShopAmount";
import { useProductContext } from "../components/context/productData";

import axios from "axios";
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
  const { workshopAmount } = useWorkshopContext();
  const { workshopId } = useWorkshopContext();
  const { productId, amount, quantity } = useProductContext();

  const handleBillingSubmit = formData => {
    setBillingAddress(formData);
    setStep("payment");
  };

  const handlePayPalSuccess = async (details, data) => {
    console.log("PayPal Success!", details, data);
    if (amount) {
      await axios.post(
        "http://localhost:5000/orderitem/add",
        {
          productId,
          quantity,
        },
        {
          withCredentials: true,
        }
      );
      await axios.delete("http://localhost:5000/cart/clear", {
        withCredentials: true,
      });
    } else {
      await axios.post("http://localhost:5000/workshopregistration/create", {
        workshop_id: workshopId,
        full_name: billingAddress.fullName,
        address: billingAddress.address,
        city: billingAddress.city,
        phone_number: billingAddress.phoneNumber,
        payment_method: "paypal",
        amount_paid: workshopAmount,
      });
    }

    setPaymentSuccess(true);
  };

  const handleStripeSuccess = async paymentMethod => {
    console.log("Stripe Success!", paymentMethod);
    if (amount) {
      console.log("Product ID: ", productId);
    } else {
      await axios.post("http://localhost:5000/workshopregistration/create", {
        workshop_id: workshopId,
        full_name: billingAddress.fullName,
        address: billingAddress.address,
        city: billingAddress.city,
        phone_number: billingAddress.phoneNumber,
        payment_method: "stripe",
        amount_paid: workshopAmount,
      });
    }
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <Card className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-green-600 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">
            تم الدفع بنجاح!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 text-center">شكراً لك على الشراء.</p>
        </CardContent>
      </Card>
    );
  }

  if (step === "billing") {
    return <BillingAddressForm onSubmit={handleBillingSubmit} />;
  }

  return (
    <Card className="max-w-md mx-auto mt-32 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-600 text-white p-6">
        <CardTitle className="text-2xl font-bold text-center">الدفع</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-right">
            عنوان الفواتير
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-right" dir="rtl">
            {billingAddress.fullName}
            <br />
            {billingAddress.address}
            <br />
            {billingAddress.city}
            <br />
            {billingAddress.phoneNumber}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">الدفع عبر PayPal</h3>
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">الدفع عبر Stripe</h3>
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm
              amount={workshopAmount || amount}
              onSuccess={handleStripeSuccess}
            />
          </Elements>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutPage;
