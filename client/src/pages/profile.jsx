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
} from "lucide-react";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    about: "",
    image: "",
  });

  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchArticles();
    fetchWorkshops();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Implement backend API endpoint
      const response = await axios.get("/api/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      // TODO: Implement backend API endpoint
      const response = await axios.get("/api/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      // TODO: Implement backend API endpoint
      const response = await axios.get("/api/workshops");
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
        // TODO: Implement backend API endpoint
        const response = await axios.post("/api/profile/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfile({ ...profile, image: response.data.imageUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // TODO: Implement backend API endpoint
      await axios.put("/api/profile", profile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-customBrown h-40 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              {isEditing ? (
                <div className="relative">
                  <img
                    className="w-32 h-32 rounded-full border-4 border-white bg-white cursor-pointer object-cover"
                    src={profile.image || "https://via.placeholder.com/128"}
                    alt="Profile"
                    onClick={handleImageClick}
                  />
                  <div
                    className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
                  src={profile.image || "https://via.placeholder.com/128"}
                  alt="Profile"
                />
              )}
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
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  placeholder="الاسم"
                />
                <input
                  type="text"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  placeholder="نبذة قصيرة"
                />
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="نبذة تفصيلية"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-customBrown transition duration-300"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">نبذة</h3>
                  <p className="text-gray-600">{profile.about}</p>
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

        {/* Articles Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">المقالات</h3>
            <Link
              to="/add-content"
              className="flex items-center text-customGreen hover:text-customBrown transition duration-300"
            >
              <Book className="w-5 h-5 mr-1" /> إضافة مقالة أو ورشة
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                <p className="text-gray-600 mb-4">{article.brief}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
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
              </div>
            ))}
          </div>
        </div>

        {/* Workshops Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">الورشات</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map(workshop => (
              <div
                key={workshop.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <h4 className="font-semibold text-lg mb-2">{workshop.title}</h4>
                <p className="text-gray-600 mb-4">{workshop.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(workshop.start_time).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{workshop.cost}</span>
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
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
