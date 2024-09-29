import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import Footer from "../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../components/context/productData";
const CartItem = ({ item, onRemove, onUpdateQuantity }) => (
  <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition duration-150">
    <div className="flex items-center flex-1 gap-10">
      <img
        src={`/api/placeholder/80/80`} // Placeholder image, replace with actual product image when available
        alt={item.product.name}
        className="w-20 h-20 object-cover mr-4 rounded-md shadow-sm"
      />
      <div>
        <h3 className="font-semibold text-lg">{item.product.name}</h3>
        <p className="text-gray-600">{item.product.price} دينار أردني</p>
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
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setProductId, setAmount, setQuantity } = useProductContext();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart/get", {
          withCredentials: true,
        });
        setCartItems(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeItem = async id => {
    try {
      await axios.delete(`http://localhost:5000/cart/remove/${id}`, {
        withCredentials: true,
      });
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/cart/update/${id}`,
        {
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        }
      );
      setCartItems(
        cartItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Handle error (e.g., show error message to user)
    }
  };
  const handlePayNow = () => {
    // Save product IDs, amount, and quantities to context
    const productIds = cartItems.map(item => item.product.id);
    const quantities = cartItems.map(item => item.quantity);
    setProductId(productIds);
    setAmount(total);
    setQuantity(quantities);
    // Navigate to payment page
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shipping = 5; // Fixed shipping cost
  const total = subtotal + shipping;

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl my-20 text-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-center text-gray-800">
          <ShoppingCart className="mr-2" /> سلة التسوق
        </h1>
        <div className="text-xl mt-10">سلة التسوق فارغة</div>
      </div>
    );
  }

  return (
    <>
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
            <div className="flex gap-3 items-center mb-4">
              <span className="font-semibold">المجموع الفرعي:</span>
              <span>{subtotal.toFixed(2)} دينار أردني</span>
            </div>
            <div className="flex gap-3 items-center mb-4">
              <span className="font-semibold">الشحن:</span>
              <span>{shipping.toFixed(2)} دينار أردني</span>
            </div>
            <div className="flex gap-3 items-center text-lg font-bold">
              <span>المجموع الكلي:</span>
              <span>{total.toFixed(2)} دينار أردني</span>
            </div>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg shadow-md flex items-center justify-center"
            onClick={handlePayNow}
          >
            ادفع الان
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCartPage;
