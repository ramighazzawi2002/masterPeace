import React, { useState, useEffect } from "react";
import {
  Book,
  User,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const WorkshopRegistrationsSection = ({ registrations, getRegistrations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    getRegistrations();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = registrations.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-customBrown mb-6">
        تسجيلات الورش
      </h2>
      {registrations && registrations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(registration => (
              <motion.div
                key={registration.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="font-bold text-2xl mb-4 text-customBrown">
                  {registration.workshop?.title || "عنوان الورشة غير متوفر"}
                </h4>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center">
                    <User className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">
                      الاسم الكامل:
                    </span>{" "}
                    <span className="text-gray-800">
                      {registration.full_name || "غير متوفر"}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <MapPin className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">العنوان:</span>{" "}
                    <span className="text-gray-800">
                      {registration.address && registration.city
                        ? `${registration.address}, ${registration.city}`
                        : "غير متوفر"}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Phone className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">رقم الهاتف:</span>{" "}
                    <span className="text-gray-800">
                      {registration.phone_number || "غير متوفر"}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Calendar className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">
                      تاريخ التسجيل:
                    </span>{" "}
                    <span className="text-gray-800">
                      {registration.createdAt
                        ? new Date(registration.createdAt).toLocaleDateString(
                            "ar-EG"
                          )
                        : "غير متوفر"}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <DollarSign className="ml-2 text-customBrown" size={18} />
                    <span className="font-semibold ml-2">
                      المبلغ المدفوع:
                    </span>{" "}
                    <span className="text-gray-800">
                      {registration.amount_paid
                        ? `${registration.amount_paid} د.أ`
                        : "غير متوفر"}
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
              length: Math.ceil(registrations.length / itemsPerPage),
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
                currentPage === Math.ceil(registrations.length / itemsPerPage)
              }
              className="mx-1 px-3 py-1 rounded-full bg-customBrown text-white disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">
          لا توجد تسجيلات للورش حالياً
        </p>
      )}
    </div>
  );
};

export default WorkshopRegistrationsSection;
