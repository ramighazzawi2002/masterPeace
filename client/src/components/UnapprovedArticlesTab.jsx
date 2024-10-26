import React, { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { BASE_URL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";

const UnapprovedArticlesTab = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchUnapprovedArticles();
  }, []);

  const fetchUnapprovedArticles = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/unapproved-articles`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching unapproved articles:", error);
      Swal.fire("خطأ", "فشل في جلب المقالات غير المعتمدة", "error");
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/approve-article/${id}`,
        { is_approved: isApproved },
        { withCredentials: true }
      );
      Swal.fire("نجاح", "تم تحديث حالة المقالة بنجاح", "success");
      fetchUnapprovedArticles();
    } catch (error) {
      console.error("Error updating article approval status:", error);
      Swal.fire("خطأ", "فشل في تحديث حالة المقالة", "error");
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          المقالات غير المعتمدة
        </h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  العنوان
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الكاتب
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b">
                  <td className="px-6 py-4 text-gray-800">{article.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {article.author.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(article.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(article.id, true)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => handleApproval(article.id, false)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                      >
                        <FiX />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnapprovedArticlesTab;
