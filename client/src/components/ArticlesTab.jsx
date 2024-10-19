import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../config";
import Swal from "sweetalert2";
import placeholderImage from "../img/card-img.jpg";

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

  const handleEdit = article => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setBreif(article.breif);
    setPreviewImage(`${BASE_URL}/uploads/${article.image}`);
  };

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("breif", breif);
      if (image) {
        formData.append("image", image);
      }

      const updatedArticle = await onEditArticle(editingArticle.id, formData);
      // Make sure the response includes the updated image filename
      setEditingArticle(null);
      setImage(null);
      setPreviewImage("");
      Swal.fire("Success", "Article updated successfully", "success");
    } catch (error) {
      console.error("Error updating article:", error);
      Swal.fire("Error", "Failed to update article", "error");
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("breif", breif);
      if (image) {
        formData.append("image", image);
      }

      const newArticle = await onAddArticle(formData);
      // Make sure the response includes the new image filename
      setEditingArticle(null);
      setTitle("");
      setContent("");
      setBreif("");
      setImage(null);
      setPreviewImage("");
      Swal.fire("Success", "Article added successfully", "success");
    } catch (error) {
      console.error("Error adding article:", error);
      Swal.fire("Error", "Failed to add article", "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">المقالات</h2>
        <button
          onClick={() => setEditingArticle({})}
          className="bg-brown-500 text-white px-4 py-2 rounded hover:bg-brown-600 transition duration-300"
        >
          <FiPlus className="inline-block mr-2" />
          إضافة مقالة جديدة
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصورة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العنوان
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الكاتب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${article.image}`}
                      alt={article.title}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                    />
                  ) : (
                    <img
                      src={placeholderImage}
                      alt="Placeholder"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.author ? article.author.username : "غير معروف"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => onDeleteArticle(article.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingArticle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              {editingArticle.id ? "Edit Article" : "Add Article"}
            </h3>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Content"
            />
            <input
              type="text"
              value={breif}
              onChange={e => setBreif(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Brief"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 mb-2 border rounded"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-32 object-cover mb-2"
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={editingArticle.id ? handleSave : handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                {editingArticle.id ? "Save" : "Add"}
              </button>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setImage(null);
                  setPreviewImage("");
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesTab;
