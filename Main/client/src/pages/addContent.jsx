import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const AddContentPage = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("article");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    breif: "",
    image: null,
    description: "",
    topics_covered: [""],
    requirements: [""],
    duration: "",
    start_time: "",
    end_time: "",
    cost: "",
    location: "",
    benefits: [""],
    max_participants: "",
    start_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Reset form data when content type changes
    setFormData({
      title: "",
      content: "",
      breif: "",
      image: null,
      description: "",
      topics_covered: [""],
      requirements: [""],
      duration: "",
      start_time: "",
      end_time: "",
      cost: "",
      location: "",
      benefits: [""],
      max_participants: "",
      start_date: "",
    });
    setFieldErrors({});
  }, [contentType]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]:
          name === "cost" || name === "max_participants"
            ? parseFloat(value) || ""
            : value,
      }));
    }
    validateField(name, type === "file" ? files[0] : value);
  };

  const handleMultiInputChange = (e, field, index) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
    validateField(field, value);
  };

  const addItem = field => {
    setFormData(prevData => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  const removeItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prevData => ({
        ...prevData,
        [field]: prevData[field].filter((_, i) => i !== index),
      }));
    }
  };

  const validateField = debounce((name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (value.length < 3) error = "العنوان يجب أن يكون 3 أحرف على الأقل";
        break;
      case "content":
      case "description":
        if (value.length < 10) error = "المحتوى يجب أن يكون 10 أحرف على الأقل";
        break;
      case "breif":
        if (value.length < 5) error = "النبذة يجب أن تكون 5 أحرف على الأقل";
        break;
      case "image":
        if (!value) error = "الصورة مطلوبة";
        break;
      case "duration":
        if (isNaN(value) || value <= 0)
          error = "المدة يجب أن تكون رقمًا موجبًا";
        break;
      case "cost":
        if (isNaN(value) || value < 0)
          error = "التكلفة يجب أن تكون رقمًا غير سالب";
        break;
      case "max_participants":
        if (isNaN(value) || value <= 0)
          error = "عدد المشاركين يجب أن يكون رقمًا موجبًا";
        break;
      case "topics_covered":
      case "requirements":
      case "benefits":
        if (value.length < 2) error = "يجب أن يكون حرفين على الأقل";
        break;
      case "start_time":
      case "end_time":
        if (!value) error = "الوقت مطلوب";
        break;
      case "start_date":
        if (!value) error = "تاريخ البدء مطلوب";
        break;
    }
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  }, 300);

  const validateForm = () => {
    const requiredFields =
      contentType === "article"
        ? ["title", "content", "breif", "image"]
        : [
            "title",
            "description",
            "topics_covered",
            "requirements",
            "duration",
            "start_date",
            "start_time",
            "end_time",
            "cost",
            "location",
            "benefits",
            "max_participants",
          ];

    const errors = {};
    requiredFields.forEach(field => {
      if (Array.isArray(formData[field])) {
        if (
          formData[field].length === 0 ||
          formData[field].every(item => item === "")
        ) {
          errors[field] = `حقل ${field} مطلوب`;
        }
      } else if (!formData[field]) {
        errors[field] = `حقل ${field} مطلوب`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }

    if (Object.values(fieldErrors).some(error => error !== "")) {
      setError("يرجى تصحيح الأخطاء في النموذج");
      return false;
    }

    // Validate start time is before end time
    if (contentType === "workshop") {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      if (startTime >= endTime) {
        setError("يجب أن يكون وقت البدء قبل وقت الانتهاء");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        contentType === "article"
          ? "http://localhost:5000/article/add-article"
          : "http://localhost:5000/workshop/add";

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item, index) => {
            formDataToSend.append(`${key}[${index}]`, item);
          });
        } else if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key]);
        } else if (
          (key === "start_time" || key === "end_time") &&
          contentType === "workshop"
        ) {
          // Only format time for workshops
          const [hours, minutes] = formData[key].split(":");
          const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
            2,
            "0"
          )}`;
          formDataToSend.append(key, formattedTime);
        } else if (formData[key] !== "") {
          // Only append non-empty values
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log("formDataToSend", Object.fromEntries(formDataToSend));
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Server response:", response.data);
      setSuccess("تمت إضافة المحتوى بنجاح");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error adding content:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      setError(
        error.response?.data?.message ||
          "حدث خطأ أثناء إضافة المحتوى. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMultiInput = (field, placeholder) => (
    <div>
      {formData[field].map((item, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            value={item}
            onChange={e => handleMultiInputChange(e, field, index)}
            placeholder={placeholder}
            className={`w-full p-2 border rounded ${
              fieldErrors[field] ? "border-red-500" : ""
            }`}
            required={index === 0}
          />
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(field, index)}
              className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              حذف
            </button>
          )}
        </div>
      ))}
      {fieldErrors[field] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
      )}
      <button
        type="button"
        onClick={() => addItem(field)}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
      >
        إضافة{" "}
        {field === "topics_covered"
          ? "موضوع"
          : field === "requirements"
          ? "متطلب"
          : "فائدة"}
      </button>
    </div>
  );

  return (
    <>
      <SEO
        title="إضافة محتوى"
        description="إضافة محتوى جديد إلى موقع التراث الأردني"
        keywords="إضافة محتوى, مشاركة, نشر"
      />
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen pt-20 pb-10">
        <main className="container mx-auto mt-8 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden p-8 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-customBrown">
              إضافة محتوى جديد
            </h2>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mb-6">
                <AlertTitle>نجاح</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-customBrown">
                نوع المحتوى:
              </label>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setContentType("article")}
                  className={`px-6 py-2 rounded-full transition-all ${
                    contentType === "article"
                      ? "bg-customBrown text-white"
                      : "bg-amber-100 text-customBrown hover:bg-amber-200"
                  }`}
                >
                  مقالة
                </button>
                <button
                  onClick={() => setContentType("workshop")}
                  className={`px-6 py-2 rounded-full transition-all ${
                    contentType === "workshop"
                      ? "bg-customBrown text-white"
                      : "bg-amber-100 text-customBrown hover:bg-amber-200"
                  }`}
                >
                  ورشة
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label
                  htmlFor="title"
                  className="block mb-2 font-semibold text-customBrown"
                >
                  العنوان
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="أدخل العنوان هنا"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                    fieldErrors.title ? "border-red-500" : "border-amber-200"
                  }`}
                  required
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              {contentType === "article" ? (
                <>
                  <div className="form-group">
                    <label
                      htmlFor="content"
                      className="block mb-2 font-semibold text-customBrown"
                    >
                      المحتوى
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="أدخل محتوى المقالة هنا"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                        fieldErrors.content
                          ? "border-red-500"
                          : "border-amber-200"
                      }`}
                      rows="10"
                      required
                    ></textarea>
                    {fieldErrors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.content}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="breif"
                      className="block mb-2 font-semibold text-customBrown"
                    >
                      نبذة مختصرة
                    </label>
                    <input
                      type="text"
                      id="breif"
                      name="breif"
                      value={formData.breif}
                      onChange={handleChange}
                      placeholder="أدخل نبذة مختصرة عن المقالة"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                        fieldErrors.breif
                          ? "border-red-500"
                          : "border-amber-200"
                      }`}
                      required
                    />
                    {fieldErrors.breif && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.breif}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label
                      htmlFor="description"
                      className="block mb-2 font-semibold text-customBrown"
                    >
                      الوصف
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="أدخل وصف الورشة هنا"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                        fieldErrors.description
                          ? "border-red-500"
                          : "border-amber-200"
                      }`}
                      rows="4"
                      required
                    ></textarea>
                    {fieldErrors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.description}
                      </p>
                    )}
                  </div>
                  {renderMultiInput("topics_covered", "المواضيع المغطاة")}
                  {renderMultiInput("requirements", "المتطلبات")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor="duration"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        المدة بالأيام
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="أدخل المدة"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.duration
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.duration && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.duration}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="start_date"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        تاريخ البدء
                      </label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.start_date
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.start_date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor="start_time"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        وقت البدء
                      </label>
                      <input
                        type="time"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.start_time
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.start_time && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.start_time}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="end_time"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        وقت الانتهاء
                      </label>
                      <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.end_time
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.end_time && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.end_time}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    * يرجى تحديد وقت بداية ونهاية الورشة
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor="cost"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        التكلفة
                      </label>
                      <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        placeholder="أدخل التكلفة"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.cost
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.cost && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.cost}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="location"
                        className="block mb-2 font-semibold text-customBrown"
                      >
                        المكان
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="أدخل مكان الورشة"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                          fieldErrors.location
                            ? "border-red-500"
                            : "border-amber-200"
                        }`}
                        required
                      />
                      {fieldErrors.location && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {renderMultiInput("benefits", "الفوائد")}
                  <div className="form-group">
                    <label
                      htmlFor="max_participants"
                      className="block mb-2 font-semibold text-customBrown"
                    >
                      الحد الأقصى للمشاركين
                    </label>
                    <input
                      type="number"
                      id="max_participants"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      placeholder="أدخل الحد الأقصى للمشاركين"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                        fieldErrors.max_participants
                          ? "border-red-500"
                          : "border-amber-200"
                      }`}
                      required
                    />
                    {fieldErrors.max_participants && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.max_participants}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="form-group">
                <label
                  htmlFor="image"
                  className="block mb-2 font-semibold text-customBrown"
                >
                  الصورة
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customBrown transition-all ${
                    fieldErrors.image ? "border-red-500" : "border-amber-200"
                  }`}
                  required
                />
                {fieldErrors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.image}
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                className={`bg-customBrown text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all w-full font-semibold text-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading
                  ? "جاري الإضافة..."
                  : contentType === "article"
                  ? "إضافة المقالة"
                  : "إضافة الورشة"}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AddContentPage;
