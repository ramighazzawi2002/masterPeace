import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { BASE_URL } from "../config";
import Swal from "sweetalert2";
import placeholderImage from "../img/card-img.jpg";

const WorkshopsTab = ({
  workshops,
  onAddWorkshop,
  onDeleteWorkshop,
  onEditWorkshop,
}) => {
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleEdit = workshop => {
    setEditingWorkshop(workshop);
    setTitle(workshop.title);
    setDescription(workshop.description);
    setStartTime(workshop.start_time);
    setMaxParticipants(workshop.max_participants);
    setPreviewImage(
      workshop.image ? `${BASE_URL}/uploads/${workshop.image}` : ""
    );
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
      formData.append("description", description);
      formData.append("start_time", startTime);
      formData.append("max_participants", maxParticipants);
      if (image) {
        formData.append("image", image);
      }

      await onEditWorkshop(editingWorkshop.id, formData);
      resetForm();
      Swal.fire("نجاح", "تم تحديث الورشة بنجاح", "success");
    } catch (error) {
      console.error("Error updating workshop:", error);
      Swal.fire("خطأ", "فشل تحديث الورشة", "error");
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("start_time", startTime);
      formData.append("max_participants", maxParticipants);
      if (image) {
        formData.append("image", image);
      }

      await onAddWorkshop(formData);
      resetForm();
      Swal.fire("نجاح", "تمت إضافة الورشة بنجاح", "success");
    } catch (error) {
      console.error("Error adding workshop:", error);
      Swal.fire("خطأ", "فشل إضافة الورشة", "error");
    }
  };

  const resetForm = () => {
    setEditingWorkshop(null);
    setTitle("");
    setDescription("");
    setStartTime("");
    setMaxParticipants("");
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
          <h2 className="text-3xl font-bold text-gray-800">الورش</h2>
          <button
            onClick={() => setEditingWorkshop({})}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FiPlus className="mr-2" />
            إضافة ورشة جديدة
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الصورة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  العنوان
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  عدد المشاركين
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((workshop, index) => (
                <tr
                  key={workshop.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4">
                    <img
                      src={
                        workshop.image
                          ? `${BASE_URL}/uploads/${workshop.image}`
                          : placeholderImage
                      }
                      alt={workshop.title}
                      className="h-12 w-12 rounded-full object-cover cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          `${BASE_URL}/uploads/${workshop.image}`
                        )
                      }
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-800">{workshop.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(workshop.start_time).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {workshop.max_participants}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(workshop)}
                      className="text-blue-500 hover:text-blue-700 ml-3"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteWorkshop(workshop.id)}
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
      {editingWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center bg-customBrown text-white p-4">
              <h3 className="text-xl font-semibold">
                {editingWorkshop.id ? "تعديل الورشة" : "إضافة ورشة جديدة"}
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
                onSubmit={editingWorkshop.id ? handleSave : handleAdd}
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
                    placeholder="أدخل عنوان الورشة"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown h-32"
                    placeholder="أدخل وصف الورشة"
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    تاريخ البدء
                  </label>
                  <input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxParticipants"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الحد الأقصى للمشاركين
                  </label>
                  <input
                    id="maxParticipants"
                    type="number"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل الحد الأقصى للمشاركين"
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
                    {editingWorkshop.id ? "حفظ التغييرات" : "إضافة الورشة"}
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

export default WorkshopsTab;
