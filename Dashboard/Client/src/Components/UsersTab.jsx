import React from "react";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../config";

const UsersTab = ({ users, onToggleUserStatus }) => {
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/users/${userId}/toggle-status`,
        { is_active: !currentStatus },
        { withCredentials: true }
      );

      if (onToggleUserStatus) {
        onToggleUserStatus(userId, !currentStatus);
      }

      Swal.fire({
        title: "نجاح",
        text: `تم ${currentStatus ? "تعطيل" : "تفعيل"} المستخدم بنجاح`,
        icon: "success",
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      Swal.fire({
        title: "خطأ",
        text: "فشل في تحديث حالة المستخدم",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">المستخدمون</h2>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="responsive-table-wrapper">
            <table className="responsive-table">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    اسم المستخدم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleStatus(user.id, user.is_active)
                        }
                        className={`${
                          user.is_active
                            ? "text-red-500 hover:text-red-700"
                            : "text-green-500 hover:text-green-700"
                        } transition duration-300`}
                        title={
                          user.is_active ? "تعطيل المستخدم" : "تفعيل المستخدم"
                        }
                      >
                        {user.is_active ? (
                          <FiUserX size={20} />
                        ) : (
                          <FiUserCheck size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
