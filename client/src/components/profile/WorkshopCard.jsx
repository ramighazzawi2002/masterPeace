import React from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  Eye,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkshopCard = ({
  workshop,
  isEditing,
  setEditingItemId,
  setWorkshops,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditingItemId(workshop.id);
  };

  const handleSave = async updatedWorkshop => {
    try {
      await axios.put(`http://localhost:5000/workshop/update`, updatedWorkshop);
      setWorkshops(prevWorkshops =>
        prevWorkshops.map(w =>
          w.id === updatedWorkshop.id
            ? { ...w, ...updatedWorkshop, is_approved: false }
            : w
        )
      );
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating workshop:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/workshop/delete/${workshop.id}`
      );
      setWorkshops(prevWorkshops =>
        prevWorkshops.filter(w => w.id !== workshop.id)
      );
    } catch (error) {
      console.error("Error deleting workshop:", error);
    }
  };

  const formatDate = dateString => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200 relative">
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            workshop.is_approved
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {workshop.is_approved ? "معتمد" : "قيد المراجعة"}
        </span>
      </div>
      {workshop.image && (
        <img
          src={`http://localhost:5000/uploads/${workshop.image}`}
          alt={workshop.title}
          className="w-full h-32 object-cover rounded-t-lg mb-2"
        />
      )}
      <h4 className="font-bold text-lg mb-1 text-customBrown">
        {workshop.title}
      </h4>
      <p className="text-gray-600 mb-2 text-sm line-clamp-2">
        {workshop.description}
      </p>
      <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
        <div className="flex items-center text-gray-500">
          <Clock className="w-3 h-3 ml-1" />
          <span>
            {workshop.start_time} - {workshop.end_time}
          </span>
        </div>
        <div className="flex items-center text-gray-500">
          <Calendar className="w-3 h-3 ml-1" />
          <span>{formatDate(workshop.date)}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <DollarSign className="w-3 h-3 ml-1" />
          <span>{workshop.cost} دينار أردني</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="w-3 h-3 ml-1" />
          <span>{workshop.location}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        {workshop.is_approved && (
          <button
            onClick={() => navigate(`/workshopinfo/${workshop.id}`)}
            className="text-customGreen hover:text-customBrown transition duration-300 flex items-center text-sm"
          >
            <Eye className="w-4 h-4 ml-1" /> عرض التفاصيل
          </button>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingItemId(workshop.id)}
            className="text-customGreen hover:text-customBrown transition duration-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(workshop.id)}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
