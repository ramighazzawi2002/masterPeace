import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:5000";

const SettingsTab = () => {
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/admin/settings`,
        { siteName, siteDescription },
        { withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        title: "تم الحفظ",
        text: "تم حفظ الإعدادات بنجاح",
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل في حفظ الإعدادات. يرجى المحاولة مرة أخرى.",
        confirmButtonText: "حسناً",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">الإعدادات</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="siteName"
          >
            اسم الموقع
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="siteName"
            type="text"
            placeholder="اسم الموقع"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="siteDescription"
          >
            وصف الموقع
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="siteDescription"
            placeholder="وصف الموقع"
            value={siteDescription}
            onChange={e => setSiteDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-brown-500 hover:bg-brown-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
