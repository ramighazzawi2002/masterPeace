import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { BASE_URL, IMAGE_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";

const WorkshopsTab = () => {
  // State for workshops list and form data
  const [workshops, setWorkshops] = useState([]);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [cost, setCost] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  const [topicsList, setTopicsList] = useState([""]);
  const [requirementsList, setRequirementsList] = useState([""]);
  const [benefitsList, setBenefitsList] = useState([""]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/workshops`, {
        withCredentials: true,
      });
      setWorkshops(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workshops:", error);
      Swal.fire("خطأ", "فشل في جلب الورش", "error");
      setIsLoading(false);
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      if (
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !date ||
        !maxParticipants
      ) {
        console.log("Form data:", {
          title,
          description,
          startTime,
          endTime,
          date,
          maxParticipants,
        });
        Swal.fire("خطأ", "جميع الحقول الأساسية مطلوبة", "error");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("date", date);
      formData.append("max_participants", maxParticipants);
      formData.append("cost", cost || 0);
      formData.append("location", location || "");
      formData.append(
        "topics_covered",
        topicsList.filter(topic => topic.trim()).join("،") || ""
      );
      formData.append(
        "requirements",
        requirementsList.filter(req => req.trim()).join(",") || ""
      );
      formData.append(
        "benefits",
        benefitsList.filter(benefit => benefit.trim()).join("،") || ""
      );
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${BASE_URL}/admin/workshops`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setWorkshops([...workshops, response.data]);
      resetForm();
      Swal.fire("نجاح", "تمت إضافة الورشة بنجاح", "success");
    } catch (error) {
      console.error("Error adding workshop:", error);
      console.error("Error response:", error.response?.data);
      Swal.fire(
        "خطأ",
        error.response?.data?.message || "فشل إضافة الورشة",
        "error"
      );
    }
  };

  const handleEdit = workshop => {
    setEditingWorkshop(workshop);
    setTitle(workshop.title);
    setDescription(workshop.description);
    setStartTime(workshop.start_time);
    setEndTime(workshop.end_time);
    setDate(workshop.date);
    setMaxParticipants(workshop.max_participants);
    setCost(workshop.cost);
    setLocation(workshop.location);
    setTopicsList(
      workshop.topics_covered ? workshop.topics_covered.split("،") : [""]
    );
    setRequirementsList(
      workshop.requirements ? workshop.requirements.split(",") : [""]
    );
    setBenefitsList(workshop.benefits ? workshop.benefits.split("،") : [""]);
    setPreviewImage(
      workshop.image ? `${IMAGE_URL}/uploads/${workshop.image}` : ""
    );
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      if (
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !date ||
        !maxParticipants
      ) {
        Swal.fire("خطأ", "جميع الحقول الأساسية مطلوبة", "error");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("date", date);
      formData.append("max_participants", maxParticipants);
      formData.append("cost", cost || 0);
      formData.append("location", location || "");
      formData.append(
        "topics_covered",
        topicsList.filter(topic => topic.trim()).join("،")
      );
      formData.append(
        "requirements",
        requirementsList.filter(req => req.trim()).join(",")
      );
      formData.append(
        "benefits",
        benefitsList.filter(benefit => benefit.trim()).join("،")
      );
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${BASE_URL}/admin/workshops/${editingWorkshop.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setWorkshops(
        workshops.map(workshop =>
          workshop.id === editingWorkshop.id ? response.data : workshop
        )
      );
      resetForm();
      Swal.fire("نجاح", "تم تحديث الورشة بنجاح", "success");
    } catch (error) {
      console.error("Error updating workshop:", error);
      Swal.fire(
        "خطأ",
        error.response?.data?.message || "فشل تحديث الورشة",
        "error"
      );
    }
  };

  const handleDelete = async id => {
    try {
      await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!",
        cancelButtonText: "إلغاء",
      }).then(async result => {
        if (result.isConfirmed) {
          await axios.delete(`${BASE_URL}/admin/workshops/${id}`, {
            withCredentials: true,
          });
          setWorkshops(workshops.filter(workshop => workshop.id !== id));
          Swal.fire("تم الحذف!", "تم حذف الورشة بنجاح.", "success");
        }
      });
    } catch (error) {
      console.error("Error deleting workshop:", error);
      Swal.fire("خطأ", "فشل حذف الورشة", "error");
    }
  };

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const resetForm = () => {
    setEditingWorkshop(null);
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setDate("");
    setMaxParticipants("");
    setCost("");
    setLocation("");
    setTopicsList([""]);
    setRequirementsList([""]);
    setBenefitsList([""]);
    setImage(null);
    setPreviewImage("");
  };

  const handleImageClick = imageSrc => {
    setZoomedImage(imageSrc);
  };

  // Handlers for dynamic lists
  const handleAddTopic = () => {
    setTopicsList([...topicsList, ""]);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topicsList];
    newTopics[index] = value;
    setTopicsList(newTopics);
  };

  const handleRemoveTopic = index => {
    const newTopics = topicsList.filter((_, i) => i !== index);
    setTopicsList(newTopics);
  };

  const handleAddRequirement = () => {
    setRequirementsList([...requirementsList, ""]);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirementsList];
    newRequirements[index] = value;
    setRequirementsList(newRequirements);
  };

  const handleRemoveRequirement = index => {
    const newRequirements = requirementsList.filter((_, i) => i !== index);
    setRequirementsList(newRequirements);
  };

  const handleAddBenefit = () => {
    setBenefitsList([...benefitsList, ""]);
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefitsList];
    newBenefits[index] = value;
    setBenefitsList(newBenefits);
  };

  const handleRemoveBenefit = index => {
    const newBenefits = benefitsList.filter((_, i) => i !== index);
    setBenefitsList(newBenefits);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">الورش</h2>
          <button
            onClick={() => {
              setEditingWorkshop({});
              setTitle("");
              setDescription("");
              setStartTime("");
              setEndTime("");
              setDate("");
              setMaxParticipants("");
              setCost("");
              setLocation("");
              setImage(null);
              setPreviewImage("");
              setTopicsList([""]);
              setRequirementsList([""]);
              setBenefitsList([""]);
            }}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FiPlus className="mr-2" />
            إضافة ورشة جديدة
          </button>
        </div>

        {/* Workshops Table */}
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
                    التاريخ
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
                        src={`${IMAGE_URL}/uploads/${workshop.image}`}
                        alt={workshop.title}
                        className="h-12 w-12 rounded-full object-cover cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            `${IMAGE_URL}/uploads/${workshop.image}`
                          )
                        }
                        onError={e => {
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {workshop.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(workshop.date).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(workshop)}
                        className="text-blue-500 hover:text-blue-700 ml-3"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(workshop.id)}
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

        {/* Add/Edit Workshop Modal */}
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

              {/* Workshop Form */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (editingWorkshop.id) {
                      handleSave(e);
                    } else {
                      handleAdd(e);
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوصف
                    </label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows="4"
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التاريخ
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وقت البدء
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وقت الانتهاء
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحد الأقصى للمشاركين
                      </label>
                      <input
                        type="number"
                        value={maxParticipants}
                        onChange={e => setMaxParticipants(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التكلفة
                      </label>
                      <input
                        type="number"
                        value={cost}
                        onChange={e => setCost(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الموقع
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Dynamic Lists */}
                  {/* Topics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المواضيع المغطاة
                    </label>
                    {topicsList.map((topic, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={e =>
                            handleTopicChange(index, e.target.value)
                          }
                          className="flex-1 p-3 border border-gray-300 rounded-md"
                          placeholder="أدخل موضوعاً"
                        />
                        {topicsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      إضافة موضوع
                    </button>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المتطلبات
                    </label>
                    {requirementsList.map((requirement, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={e =>
                            handleRequirementChange(index, e.target.value)
                          }
                          className="flex-1 p-3 border border-gray-300 rounded-md"
                          placeholder="أدخل متطلباً"
                        />
                        {requirementsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRequirement(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      إضافة متطلب
                    </button>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفوائد
                    </label>
                    {benefitsList.map((benefit, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={e =>
                            handleBenefitChange(index, e.target.value)
                          }
                          className="flex-1 p-3 border border-gray-300 rounded-md"
                          placeholder="أدخل فائدة"
                        />
                        {benefitsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      إضافة فائدة
                    </button>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الصورة
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      accept="image/*"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-customBrown text-white rounded-md"
                    >
                      {editingWorkshop.id ? "حفظ التغييرات" : "إضافة الورشة"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
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
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopsTab;
