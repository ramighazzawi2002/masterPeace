import React from "react";

const ProductsTab = ({ products, onAddProduct, onDeleteProduct }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">إدارة المنتجات</h2>
    <button
      onClick={onAddProduct}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4"
    >
      إضافة منتج جديد
    </button>
    <table className="w-full">
      <thead className="bg-brown-100">
        <tr>
          <th className="p-3 text-right">اسم المنتج</th>
          <th className="p-3 text-right">السعر</th>
          <th className="p-3 text-right">الكمية المتوفرة</th>
          <th className="p-3 text-right">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} className="border-b">
            <td className="p-3">{product.name}</td>
            <td className="p-3">{product.price}</td>
            <td className="p-3">{product.stock}</td>
            <td className="p-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
                تعديل
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductsTab;
