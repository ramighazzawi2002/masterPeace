import React, { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import cardImage from "../img/card-img.jpg";
import Header from "./header";
import Footer from "./footer";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => (
  <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition duration-150">
    <div className="flex items-center flex-1 gap-10">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover mr-4 rounded-md shadow-sm"
      />
      <div>
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">{item.price} دينار أردني</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="flex items-center border rounded-md mr-4">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-2 hover:bg-gray-100"
        >
          <Minus size={16} />
        </button>
        <span className="px-4">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-2 hover:bg-gray-100"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-150"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "فسيفساء أردنية",
      price: 50,
      image: cardImage,
      quantity: 1,
    },
    {
      id: 2,
      name: "لوحة فنية تقليدية",
      price: 75,
      image: cardImage,
      quantity: 1,
    },
    {
      id: 3,
      name: "حرف يدوية",
      price: 30,
      image: cardImage,
      quantity: 2,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("visa");

  const removeItem = id => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-4xl my-20">
        <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
          <ShoppingCart className="mr-2" /> سلة التسوق
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">المجموع الفرعي:</span>
              <span>{subtotal} دينار أردني</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">الشحن:</span>
              <span>{shipping} دينار أردني</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>المجموع الكلي:</span>
              <span>{total} دينار أردني</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">طريقة الدفع</h2>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="visa"
                  checked={paymentMethod === "visa"}
                  onChange={() => setPaymentMethod("visa")}
                  className="form-radio text-blue-600"
                />
                <span>Visa</span>
                <CreditCard className="text-blue-600" size={24} />
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="form-radio text-blue-500"
                />
                <span>PayPal</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#0070ba"
                >
                  <path d="M20.1 6.13c.08.81.01 1.74-.44 2.81-.57 1.36-1.61 2.44-2.99 3.07-1.19.54-2.67.81-4.37.81h-.57l-.67 4.24h-2.43l-.17 1.07h-2.3L7.7 13.5h1.44l1.05-6.62h3.17c1.43 0 2.62.16 3.56.48 1.59.53 2.62 1.61 3.18 3.32zM7.33 17.13h2.28l.67-4.24h2.46c1.68 0 3.14-.27 4.32-.8 1.37-.63 2.4-1.7 2.97-3.05.45-1.07.52-2 .44-2.81-.56-1.71-1.59-2.79-3.18-3.32-.94-.32-2.13-.48-3.56-.48H9.78l-2.45 15.4z" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg shadow-md flex items-center justify-center">
          {paymentMethod === "visa" ? (
            <>
              <CreditCard className="mr-2" size={24} />
              الدفع باستخدام Visa
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="mr-2"
              >
                <path d="M20.1 6.13c.08.81.01 1.74-.44 2.81-.57 1.36-1.61 2.44-2.99 3.07-1.19.54-2.67.81-4.37.81h-.57l-.67 4.24h-2.43l-.17 1.07h-2.3L7.7 13.5h1.44l1.05-6.62h3.17c1.43 0 2.62.16 3.56.48 1.59.53 2.62 1.61 3.18 3.32zM7.33 17.13h2.28l.67-4.24h2.46c1.68 0 3.14-.27 4.32-.8 1.37-.63 2.4-1.7 2.97-3.05.45-1.07.52-2 .44-2.81-.56-1.71-1.59-2.79-3.18-3.32-.94-.32-2.13-.48-3.56-.48H9.78l-2.45 15.4z" />
              </svg>
              الدفع باستخدام PayPal
            </>
          )}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCartPage;
