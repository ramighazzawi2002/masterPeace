import React from "react";

const WorkshopsTab = ({ workshops, onAddWorkshop, onDeleteWorkshop }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">إدارة الورشات</h2>
    <button
      onClick={onAddWorkshop}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4"
    >
      إضافة ورشة جديدة
    </button>
    <table className="w-full">
      <thead className="bg-brown-100">
        <tr>
          <th className="p-3 text-right">العنوان</th>
          <th className="p-3 text-right">التاريخ</th>
          <th className="p-3 text-right">عدد المشاركين</th>
          <th className="p-3 text-right">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {workshops.map(workshop => (
          <tr key={workshop.id} className="border-b">
            <td className="p-3">{workshop.title}</td>
            <td className="p-3">{workshop.date}</td>
            <td className="p-3">{workshop.participants}</td>
            <td className="p-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
                تعديل
              </button>
              <button
                onClick={() => onDeleteWorkshop(workshop.id)}
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

export default WorkshopsTab;
