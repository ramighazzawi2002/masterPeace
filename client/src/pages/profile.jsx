import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Book,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Clock,
  DollarSign,
  Save,
  X,
  Trash2,
} from "lucide-react";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: 0,
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    is_admin: false,
    auth_type: "",
    createdAt: "",
    updatedAt: "",
    image: "",
  });

  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemType, setEditingItemType] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchArticles();
    fetchWorkshops();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/article/get-by-user"
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/workshop/get-by-user"
      );
      setWorkshops(response.data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  };

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          "http://localhost:5000/user/upload-profile-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Image uploaded:", response.data);
        setProfile({ ...profile, image: response.data.image });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Send username, current password, new password, and image in the update request
      const { username, currentPassword, newPassword, image } = profile;
      await axios.put("http://localhost:5000/user/update-profile-data", {
        username,
        currentPassword,
        newPassword,
        image,
      });
      setIsEditing(false);
      // Refresh the profile data after update
      fetchProfile();
    } catch (error) {
      alert("كلمة المرور الحالية غير صحيحة");
      // Handle error (e.g., show error message to user)
    }
  };
  const handleEditItem = (id, type) => {
    setEditingItemId(id);
    setEditingItemType(type);
  };

  const handleItemChange = (e, id, type) => {
    if (type === "article") {
      setArticles(
        articles.map(article =>
          article.id === id
            ? { ...article, [e.target.name]: e.target.value }
            : article
        )
      );
    } else if (type === "workshop") {
      setWorkshops(
        workshops.map(workshop =>
          workshop.id === id
            ? { ...workshop, [e.target.name]: e.target.value }
            : workshop
        )
      );
    }
  };

  const handleSaveItem = async (id, type) => {
    try {
      if (type === "article") {
        const article = articles.find(a => a.id === id);
        console.log("Article:", article);
        await axios.put(`http://localhost:5000/article/update`, article);
        // add to articles state the new article with is_approved false
        setArticles(
          articles.map(article =>
            article.id === id ? { ...article, is_approved: false } : article
          )
        );
      } else if (type === "workshop") {
        const workshop = workshops.find(w => w.id === id);
        await axios.put(
          `http://localhost:5000/workshop/update/${id}`,
          workshop
        );
        // add to workshops state the new workshop with is_approved false
        setWorkshops(
          workshops.map(workshop =>
            workshop.id === id ? { ...workshop, is_approved: false } : workshop
          )
        );
      }

      setEditingItemId(null);
      setEditingItemType(null);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleRemoveItem = async (id, type) => {
    try {
      if (type === "article") {
        await axios.delete(`/api/articles/${id}`);
        setArticles(articles.filter(article => article.id !== id));
      } else if (type === "workshop") {
        await axios.delete(`/api/workshops/${id}`);
        setWorkshops(workshops.filter(workshop => workshop.id !== id));
      }
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
    }
  };

  const renderWorkshopCard = workshop => (
    <div
      key={workshop.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
    >
      {editingItemId === workshop.id && editingItemType === "workshop" ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSaveItem(workshop.id, "workshop");
          }}
        >
          <input
            type="text"
            name="title"
            value={workshop.title}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            name="description"
            value={workshop.description}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
            rows="3"
          ></textarea>

          {/* Topics Covered */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              المواضيع المغطاة
            </label>
            {workshop.topics_covered.split(",").map((topic, index) => (
              <input
                key={index}
                type="text"
                value={topic.trim()}
                onChange={e => {
                  const newTopics = workshop.topics_covered.split(",");
                  newTopics[index] = e.target.value;
                  handleItemChange(
                    {
                      target: {
                        name: "topics_covered",
                        value: newTopics.join(","),
                      },
                    },
                    workshop.id,
                    "workshop"
                  );
                }}
                className="w-full p-2 border rounded mb-1"
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleItemChange(
                  {
                    target: {
                      name: "topics_covered",
                      value: workshop.topics_covered
                        ? workshop.topics_covered + ","
                        : "",
                    },
                  },
                  workshop.id,
                  "workshop"
                )
              }
              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              إضافة موضوع
            </button>
          </div>

          {/* Requirements */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              المتطلبات
            </label>
            {workshop.requirements.split(",").map((requirement, index) => (
              <input
                key={index}
                type="text"
                value={requirement.trim()}
                onChange={e => {
                  const newRequirements = workshop.requirements.split(",");
                  newRequirements[index] = e.target.value;
                  handleItemChange(
                    {
                      target: {
                        name: "requirements",
                        value: newRequirements.join(","),
                      },
                    },
                    workshop.id,
                    "workshop"
                  );
                }}
                className="w-full p-2 border rounded mb-1"
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleItemChange(
                  {
                    target: {
                      name: "requirements",
                      value: workshop.requirements
                        ? workshop.requirements + ","
                        : "",
                    },
                  },
                  workshop.id,
                  "workshop"
                )
              }
              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              إضافة متطلب
            </button>
          </div>

          <input
            type="text"
            name="duration"
            value={workshop.duration}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
            placeholder="المدة"
          />
          <input
            type="time"
            name="start_time"
            value={workshop.start_time}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="time"
            name="end_time"
            value={workshop.end_time}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            name="cost"
            value={workshop.cost}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
            placeholder="التكلفة"
          />
          <input
            type="text"
            name="location"
            value={workshop.location}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
            placeholder="الموقع"
          />

          {/* Benefits */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              الفوائد
            </label>
            {workshop.benefits.split(",").map((benefit, index) => (
              <input
                key={index}
                type="text"
                value={benefit.trim()}
                onChange={e => {
                  const newBenefits = workshop.benefits.split(",");
                  newBenefits[index] = e.target.value;
                  handleItemChange(
                    {
                      target: {
                        name: "benefits",
                        value: newBenefits.join(","),
                      },
                    },
                    workshop.id,
                    "workshop"
                  );
                }}
                className="w-full p-2 border rounded mb-1"
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleItemChange(
                  {
                    target: {
                      name: "benefits",
                      value: workshop.benefits ? workshop.benefits + "," : "",
                    },
                  },
                  workshop.id,
                  "workshop"
                )
              }
              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              إضافة فائدة
            </button>
          </div>

          <input
            type="number"
            name="max_participants"
            value={workshop.max_participants}
            onChange={e => handleItemChange(e, workshop.id, "workshop")}
            className="w-full p-2 border rounded mb-2"
            placeholder="الحد الأقصى للمشاركين"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditingItemId(null)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <>
          {workshop.image && (
            <img
              src={`http://localhost:5000/uploads/${workshop.image}`}
              alt={workshop.title}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
          )}
          <h4 className="font-semibold text-lg mb-2">{workshop.title}</h4>
          <p className="text-gray-600 mb-4">{workshop.description}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-2" />
              <span>المواضيع: {workshop.topics_covered}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>المتطلبات: {workshop.requirements}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                التاريخ: {new Date(workshop.start_time).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                الوقت: {workshop.start_time} - {workshop.end_time}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>الموقع: {workshop.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>المدة: {workshop.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>التكلفة: {workshop.cost}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>الحد الأقصى للمشاركين: {workshop.max_participants}</span>
            </div>
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-2" />
              <span>الفوائد: {workshop.benefits}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span
              className={`px-2 py-1 rounded ${
                workshop.is_approved
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {workshop.is_approved ? "معتمد" : "قيد المراجعة"}
            </span>
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => handleEditItem(workshop.id, "workshop")}
              className="text-customGreen hover:text-customBrown transition duration-300"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRemoveItem(workshop.id, "workshop")}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderArticleCard = article => (
    <div
      key={article.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
    >
      {editingItemId === article.id && editingItemType === "article" ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSaveItem(article.id, "article");
          }}
        >
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={e => handleItemChange(e, article.id, "article")}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            name="breif"
            value={article.breif}
            onChange={e => handleItemChange(e, article.id, "article")}
            className="w-full p-2 border rounded mb-2"
            rows="3"
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditingItemId(null)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <>
          {article.image && (
            <img
              src={`http://localhost:5000/uploads/${article.image}`}
              alt={article.title}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
          )}
          <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
          <p className="text-gray-600 mb-4">{article.breif}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span
              className={`px-2 py-1 rounded ${
                article.is_approved
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {article.is_approved ? "معتمد" : "قيد المراجعة"}
            </span>
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => handleEditItem(article.id, "article")}
              className="text-customGreen hover:text-customBrown transition duration-300"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRemoveItem(article.id, "article")}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-amber-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-customBrown h-40 relative">
            <div className="absolute bottom-0 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <img
                  className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover cursor-pointer"
                  src={`${
                    profile.image
                      ? `http://localhost:5000/uploads/${profile.image}`
                      : "https://via.placeholder.com/128"
                  }`}
                  alt="Profile"
                  onClick={handleImageClick}
                />
                {isEditing && (
                  <div
                    className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 mt-16">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  placeholder="الاسم"
                />
                <input
                  type="password"
                  name="currentPassword"
                  value={profile.currentPassword}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  placeholder="كلمة المرور الحالية"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  placeholder="كلمة المرور الجديدة"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-customBrown text-white px-4 py-2 rounded hover:opacity-90 transition duration-300"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {profile.username}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-customGreen hover:text-customBrown transition duration-300"
                  >
                    <Edit className="w-4 h-4 mr-1" /> تعديل الملف الشخصي
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workshops Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">الورشات</h3>
            <Link
              to="/add-content"
              className="flex items-center text-customGreen hover:text-customBrown transition duration-300"
            >
              <Book className="w-5 h-5 mr-1" /> إضافة ورشة
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map(workshop => renderWorkshopCard(workshop))}
          </div>
        </div>

        {/* Articles Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">المقالات</h3>
            <Link
              to="/add-content"
              className="flex items-center text-customGreen hover:text-customBrown transition duration-300"
            >
              <Book className="w-5 h-5 mr-1" /> إضافة مقالة
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => renderArticleCard(article))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
