import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { BASE_URL, IMAGE_URL } from "../config";
import Swal from "sweetalert2";

const ProductsTab = ({
  products,
  onAddProduct,
  onDeleteProduct,
  onEditProduct,
}) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleEdit = product => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setPreviewImage(
      product.image ? `${IMAGE_URL}/uploads/${product.image}` : ""
    );
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("stock", Number(stock));
      if (image) {
        formData.append("image", image);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (!editingProduct.id) {
        throw new Error("Missing product ID");
      }

      await onEditProduct(editingProduct.id, formData);
      resetForm();
      Swal.fire({
        title: "نجاح",
        text: "تم تحديث المنتج بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "خطأ",
        text: error.message || "فشل تحديث المنتج",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) {
        formData.append("image", image);
      }
      await onAddProduct(formData);
      resetForm();
      Swal.fire("نجاح", "تمت إضافة المنتج بنجاح", "success");
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire("خطأ", "فشل إضافة المنتج", "error");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
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
          <h2 className="text-3xl font-bold text-gray-800">المنتجات</h2>
          <button
            onClick={() => setEditingProduct({})}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FiPlus className="mr-2" />
            إضافة منتج جديد
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
                    اسم المنتج
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    السعر
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    الكمية المتوفرة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={`${IMAGE_URL}/uploads/${product.image}`}
                        alt={product.name}
                        className="h-12 w-12 rounded-full object-cover cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            `${IMAGE_URL}/uploads/${product.image}`
                          )
                        }
                        onError={e => {
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.price}</td>
                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700 ml-3"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
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
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center bg-customBrown text-white p-4">
              <h3 className="text-xl font-semibold">
                {editingProduct.id ? "تعديل المنتج" : "إضافة منتج جديد"}
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
                  editingProduct.id ? handleSave(e) : handleAdd(e);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    اسم المنتج
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل اسم المنتج"
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
                    placeholder="أدخل وصف المنتج"
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    السعر
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل سعر المنتج"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الكمية المتوفرة
                  </label>
                  <input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBrown"
                    placeholder="أدخل الكمية المتوفرة"
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
                    {editingProduct.id ? "حفظ التغييرات" : "إضافة المنتج"}
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

export default ProductsTab;
