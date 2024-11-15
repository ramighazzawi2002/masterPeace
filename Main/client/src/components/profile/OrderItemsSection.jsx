import React, { useState, useEffect } from "react";
import {
  Package,
  Hash,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const OrderItemsSection = ({ orderItems, getOrderItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    getOrderItems();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orderItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-customBrown mb-6">الطلبات</h2>
      {orderItems && orderItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(orderItem => (
              <motion.div
                key={orderItem.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="font-bold text-2xl mb-4 text-customBrown">
                  {orderItem.Product.name}
                </h4>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center">
                    <Package className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">اسم المنتج:</span>{" "}
                    <span className="text-gray-800">
                      {orderItem.Product.name}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Hash className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">الكمية:</span>{" "}
                    <span className="text-gray-800">{orderItem.quantity}</span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Calendar className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">
                      تاريخ الطلب:
                    </span>{" "}
                    <span className="text-gray-800">
                      {new Date(orderItem.createdAt).toLocaleDateString(
                        "ar-EG"
                      )}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <DollarSign className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">السعر:</span>{" "}
                    <span className="text-gray-800">
                      {orderItem.Product.price} د.أ
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 rounded-full bg-customBrown text-white disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
            {Array.from({
              length: Math.ceil(orderItems.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-full ${
                  currentPage === index + 1
                    ? "bg-customBrown text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(orderItems.length / itemsPerPage)
              }
              className="mx-1 px-3 py-1 rounded-full bg-customBrown text-white disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">لا توجد طلبات حالياً</p>
      )}
    </div>
  );
};

export default OrderItemsSection;
