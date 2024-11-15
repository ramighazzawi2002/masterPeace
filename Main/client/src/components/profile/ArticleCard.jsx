import React from "react";
import { Calendar, Edit, Trash2, Eye, Clock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article, isEditing, setEditingItemId, setArticles }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditingItemId(article.id);
  };

  const handleSave = async updatedArticle => {
    try {
      await axios.put(`http://localhost:5000/article/update`, updatedArticle);
      setArticles(prevArticles =>
        prevArticles.map(a =>
          a.id === updatedArticle.id
            ? { ...a, ...updatedArticle, is_approved: false }
            : a
        )
      );
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/article/delete/${article.id}`);
      setArticles(prevArticles =>
        prevArticles.filter(a => a.id !== article.id)
      );
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleViewArticle = () => {
    navigate(`/articleinfo/${article.id}`);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave({
              id: article.id,
              title: e.target.title.value,
              breif: e.target.breif.value,
              content: e.target.content.value,
            });
          }}
          className="space-y-4"
        >
          <input
            name="title"
            defaultValue={article.title}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
            required
          />
          <textarea
            name="breif"
            defaultValue={article.breif}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
            rows="3"
            required
          ></textarea>
          <textarea
            name="content"
            defaultValue={article.content}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-customGreen focus:border-transparent"
            rows="5"
            required
          ></textarea>
          <div className="flex justify-end space-x-2">
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
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200 relative">
      {article.image && (
        <img
          src={`http://localhost:5000/uploads/${article.image}`}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}
      <h4 className="font-bold text-xl mb-2 text-customBrown">
        {article.title}
      </h4>
      <p className="text-gray-600 mb-4 line-clamp-3">{article.breif}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="w-4 h-4 mr-1" />
        <span>{new Date(article.createdAt).toLocaleDateString("ar-EG")}</span>
      </div>
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            article.is_approved
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {article.is_approved ? "معتمد" : "قيد المراجعة"}
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        {article.is_approved && (
          <button
            onClick={handleViewArticle}
            className="text-customGreen hover:text-customBrown transition duration-300 flex items-center"
          >
            <Eye className="w-5 h-5 mr-1" /> عرض المقال
          </button>
        )}
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-customGreen hover:text-customBrown transition duration-300"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
