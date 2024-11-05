import React, { useState, useRef } from "react";
import { Edit, Camera } from "lucide-react";
import axios from "axios";
import profileImage from "../../img/profile-circle-icon-512x512-zxne30hp.png";

const ProfileHeader = ({ profile, setProfile, fetchProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    if (profile.auth_type === "local") {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async e => {
    if (profile.auth_type === "local") {
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
          setProfile({ ...profile, image: response.data.image });
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { username, currentPassword, newPassword, image } = profile;
      await axios.put("http://localhost:5000/user/update-profile-data", {
        username,
        currentPassword,
        newPassword,
        image,
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      alert("كلمة المرور الحالية غير صحيحة");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-customBrown h-40 relative">
        <div className="absolute bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <img
              className={`w-32 h-32 rounded-full border-4 border-white bg-white object-cover ${
                profile.auth_type === "local" ? "cursor-pointer" : ""
              } `}
              src={`${
                profile.image
                  ? profile.auth_type === "local"
                    ? `http://localhost:5000/uploads/${profile.image}`
                    : profile?.image
                  : profileImage
              }`}
              alt="Profile"
              onClick={handleImageClick}
            />
            {isEditing && profile.auth_type === "local" && (
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
            {profile.auth_type === "local" && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            )}
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded"
              placeholder="الاسم"
            />
            {profile.auth_type === "local" && (
              <>
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
              </>
            )}
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
                <Edit className="w-4 h-4 ml-1" /> تعديل الملف الشخصي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
