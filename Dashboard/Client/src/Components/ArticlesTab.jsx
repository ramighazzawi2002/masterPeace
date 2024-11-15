import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { BASE_URL, IMAGE_URL } from "../config";
import Swal from "sweetalert2";

const ArticlesTab = ({
  articles,
  onAddArticle,
  onDeleteArticle,
  onEditArticle,
}) => {
  const [editingArticle, setEditingArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [breif, setBreif] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleEdit = article => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setBreif(article.breif);
    setPreviewImage(`${IMAGE_URL}/uploads/${article.image}`);
  };

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async e => {
    e.preventDefault();

    try {
      if (!title || !content || !breif) {
        Swal.fire("خطأ", "جميع الحقول مطلوبة", "error");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("breif", breif);
      if (image) {
        formData.append("image", image);
      }

      await onEditArticle(editingArticle.id, formData);
      resetForm();
      Swal.fire("نجاح", "تم تحديث المقالة بنجاح", "success");
    } catch (error) {
      console.error("Error updating article:", error);
      Swal.fire(
        "خطأ",
        error.response?.data?.message || "فشل تحديث المقالة",
        "error"
      );
    }
  };

  const handleAdd = async e => {
    e.preventDefault();

    try {
      if (!title || !content || !breif) {
        Swal.fire("خطأ", "جميع الحقول مطلوبة", "error");
        return;
      }

      if (!image) {
        Swal.fire("خطأ", "الرجاء اختيار صورة", "error");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("breif", breif);
      formData.append("image", image);

      await onAddArticle(formData);
      resetForm();
      Swal.fire("نجاح", "تمت إضافة المقالة بنجاح", "success");
    } catch (error) {
      console.error("Error adding article:", error);
      Swal.fire(
        "خطأ",
        error.response?.data?.message || "فشل إضافة المقالة",
        "error"
      );
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setTitle("");
    setContent("");
    setBreif("");
    setImage(null);
    setPreviewImage("");
  };

  const handleImageClick = imageSrc => {
    setZoomedImage(imageSrc);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">المقالات</h2>
          <button
            onClick={() => setEditingArticle({})}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FiPlus className="mr-2" />
            إضافة مقالة جديدة
          </button>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="responsive-table-wrapper">
            <table className="responsive-table">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    الصورة
                  </th>
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
                {articles.map((article, index) => (
                  <tr
                    key={article.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={`${IMAGE_URL}/uploads/${article.image}`}
                        alt={article.title}
                        className="h-12 w-12 rounded-full object-cover cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            `${IMAGE_URL}/uploads/${article.image}`
                          )
                        }
                        onError={e => {
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800">{article.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {article.author ? article.author.username : "غير معروف"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(article.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-500 hover:text-blue-700 ml-3"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => onDeleteArticle(article.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center bg-customBrown text-white p-4">
              <h3 className="text-xl font-semibold">
                {editingArticle.id ? "تعديل المقالة" : "إضافة مقالة جديدة"}
              </h3>
              <button
                onClick={resetForm}
                className="text-white hover:text-gray-200 transition duration-300"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  editingArticle.id ? handleSave(e) : handleAdd(e);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    العنوان
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل عنوان المقالة"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    المحتوى
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown h-32"
                    placeholder="أدخل محتوى المقالة"
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="breif"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ملخص قصير
                  </label>
                  <input
                    id="breif"
                    type="text"
                    value={breif}
                    onChange={e => setBreif(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل ملخصًا قصيرًا للمقالة"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الصورة
                  </label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                  />
                </div>
                {previewImage && (
                  <div>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  </div>
                )}
                <div className="flex justify-start gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-customBrown text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    {editingArticle.id ? "حفظ التغييرات" : "إضافة المقالة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative">
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition duration-300"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesTab;
