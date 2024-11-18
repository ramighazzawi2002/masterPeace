import React, { useState } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Users,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const WorkshopCard = ({
  workshop,
  isEditing,
  setEditingItemId,
  setWorkshops,
}) => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.put(
        `http://localhost:5000/workshop/update/${workshop.id}`,
        {
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
          cost: formData.get("cost"),
          start_time: formData.get("start_time"),
          end_time: formData.get("end_time"),
          location: formData.get("location"),
          max_participants: formData.get("max_participants"),
        }
      );
      console.log(response.data);

      setWorkshops(prevWorkshops =>
        prevWorkshops.map(w =>
          w.id === workshop.id
            ? {
                ...w,
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                cost: formData.get("cost"),
                start_time: formData.get("start_time"),
                end_time: formData.get("end_time"),
                location: formData.get("location"),
                max_participants: formData.get("max_participants"),
                is_approved: false,
              }
            : w
        )
      );

      setEditingItemId(null);
      Swal.fire({
        icon: "success",
        title: "تم التحديث",
        text: "تم تحديث الورشة بنجاح",
      });
    } catch (error) {
      console.error("Error updating workshop:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تحديث الورشة",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذه الورشة!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذف!",
        cancelButtonText: "إلغاء",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:5000/workshop/delete/${workshop.id}`
        );
        setWorkshops(prevWorkshops =>
          prevWorkshops.filter(w => w.id !== workshop.id)
        );
        Swal.fire("تم الحذف!", "تم حذف الورشة بنجاح.", "success");
      }
    } catch (error) {
      console.error("Error deleting workshop:", error);
      Swal.fire("خطأ", "حدث خطأ أثناء حذف الورشة", "error");
    }
  };

  const formatDate = dateString => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/workshop/registrations/${workshop.id}`
      );
      setRegistrations(response.data);
      setShowRegistrations(true);
      console.log(response.data);

      // Calculate total earnings and platform fee
      const totalEarnings = response.data.reduce(
        (sum, reg) => sum + Number(reg.amount_paid),
        0
      );
      const platformFee = totalEarnings * 0.07; // 7% fee
      const netEarnings = totalEarnings - platformFee;

      Swal.fire({
        title: "المسجلين في الورشة",
        html: `
          <div dir="rtl" class="text-right">
            <p class="mb-4">عدد المسجلين: ${response.data.length}</p>
            <div class="mb-4 p-3 bg-gray-50 rounded">
              <p class="text-sm font-bold mb-2">التفاصيل المالية:</p>
              <p class="text-sm">إجمالي المبلغ: ${totalEarnings} دينار</p>
              <p class="text-sm text-red-600">رسوم المنصة (7%): ${platformFee.toFixed(
                2
              )} دينار</p>
              <p class="text-sm text-green-600 font-bold">صافي الربح: ${netEarnings.toFixed(
                2
              )} دينار</p>
            </div>
            <div class="max-h-60 overflow-y-auto">
              ${response.data
                .map(
                  reg => `
                <div class="border-b p-2">
                  <p class="font-bold">${reg.full_name}</p>
                  <p class="text-sm text-gray-600">${reg.user.email}</p>
                  <p class="text-sm text-gray-500">تاريخ التسجيل: ${new Date(
                    reg.createdAt
                  ).toLocaleDateString("ar-EG")}</p>
                  <p class="text-sm text-gray-500">${reg.phone_number}</p>
                  <p class="text-sm text-gray-500">${reg.address}</p>
                  <p class="text-sm text-gray-500">${reg.city}</p>
                  <p class="text-sm ${
                    reg.amount_paid ? "text-green-600" : "text-red-600"
                  }">
                    المبلغ المدفوع: ${reg.amount_paid} دينار
                  </p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `,
        confirmButtonText: "إغلاق",
        customClass: {
          container: "rtl",
        },
        footer:
          '<div class="text-xs text-gray-500">* يتم خصم 7% من قيمة كل تسجيل كرسوم للمنصة</div>',
      });
    } catch (error) {
      console.error("Error fetching registrations:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء جلب بيانات المسجلين",
      });
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="space-y-4">
          <input
            name="title"
            defaultValue={workshop.title}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
            required
          />
          <textarea
            name="description"
            defaultValue={workshop.description}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
            rows="3"
            required
          ></textarea>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              defaultValue={workshop.date?.split("T")[0]}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
            <input
              type="number"
              name="cost"
              defaultValue={workshop.cost}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
            <input
              type="time"
              name="start_time"
              defaultValue={workshop.start_time}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
            <input
              type="time"
              name="end_time"
              defaultValue={workshop.end_time}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
            <input
              type="text"
              name="location"
              defaultValue={workshop.location}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
            <input
              type="number"
              name="max_participants"
              defaultValue={workshop.max_participants}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end gap-x-2">
            <button
              type="submit"
              className="bg-customGreen text-white px-4 py-2 rounded-full hover:bg-customBrown transition duration-300"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={() => setEditingItemId(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200 relative">
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            workshop.is_approved
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {workshop.is_approved ? "معتمد" : "قيد المراجعة"}
        </span>
      </div>
      {workshop.image && (
        <img
          src={`http://localhost:5000/uploads/${workshop.image}`}
          alt={workshop.title}
          className="w-full h-32 object-cover rounded-t-lg mb-2"
        />
      )}
      <h4 className="font-bold text-lg mb-1 text-customBrown">
        {workshop.title}
      </h4>
      <p className="text-gray-600 mb-2 text-sm line-clamp-2">
        {workshop.description}
      </p>
      <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
        <div className="flex items-center text-gray-500">
          <Clock className="w-3 h-3 ml-1" />
          <span>
            {workshop.start_time} - {workshop.end_time}
          </span>
        </div>
        <div className="flex items-center text-gray-500">
          <Calendar className="w-3 h-3 ml-1" />
          <span>{formatDate(workshop.date)}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <DollarSign className="w-3 h-3 ml-1" />
          <span>{workshop.cost} دينار أردني</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="w-3 h-3 ml-1" />
          <span>{workshop.location}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          {workshop.is_approved && (
            <button
              onClick={() => navigate(`/workshopinfo/${workshop.id}`)}
              className="text-customGreen hover:text-customBrown transition duration-300 flex items-center text-sm"
            >
              <Eye className="w-4 h-4 ml-1" /> عرض التفاصيل
            </button>
          )}
          <button
            onClick={fetchRegistrations}
            className="text-blue-500 hover:text-blue-700 transition duration-300 flex items-center text-sm"
          >
            <Users className="w-4 h-4 ml-1" /> المسجلين
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingItemId(workshop.id)}
            className="text-customGreen hover:text-customBrown transition duration-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
